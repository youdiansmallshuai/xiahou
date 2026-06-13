import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";
import { fetchWanxiaDataBatch } from "../src/api/openMeteo";
import { DEFAULT_REGION_ID, normalizeRegionId } from "../src/model/regions";
import type {
  ForecastDay,
  PredictionSelection,
  SolarEventType,
  WanxiaData
} from "../src/model/types";

const PORT = Number(process.env.WANXIA_PORT ?? 8787);
const CACHE_FILE = process.env.WANXIA_CACHE_FILE ?? "/tmp/wanxia-cache.json";
const REFRESH_INTERVAL_MS = Number(process.env.WANXIA_REFRESH_INTERVAL_MS ?? 60 * 60 * 1000);
const FAILED_REFRESH_COOLDOWN_MS = Number(process.env.WANXIA_FAILED_REFRESH_COOLDOWN_MS ?? 5 * 60 * 1000);
const CACHE_VERSION = 3;
const execFileAsync = promisify(execFile);
const nativeFetch = globalThis.fetch.bind(globalThis);

const SELECTIONS: PredictionSelection[] = [
  { day: "today", eventType: "sunrise", regionId: DEFAULT_REGION_ID },
  { day: "today", eventType: "sunset", regionId: DEFAULT_REGION_ID },
  { day: "tomorrow", eventType: "sunrise", regionId: DEFAULT_REGION_ID },
  { day: "tomorrow", eventType: "sunset", regionId: DEFAULT_REGION_ID }
];

interface CacheItem {
  selection: PredictionSelection;
  data: WanxiaData;
  updatedAt: string;
}

interface RefreshError {
  selection: PredictionSelection;
  message: string;
  at: string;
}

interface PersistentCache {
  version: number;
  updatedAt: string | null;
  nextRefreshAt: string | null;
  refreshStartedAt: string | null;
  refreshFinishedAt: string | null;
  items: Record<string, CacheItem>;
  errors: RefreshError[];
}

let cache: PersistentCache = emptyCache();
let refreshPromise: Promise<void> | null = null;
let lastFailedRefreshAt = 0;

async function main() {
  installCurlTransport();
  cache = await readCache();
  scheduleRefresh();
  void refreshAll("startup");

  const server = createServer((request, response) => {
    void handleRequest(request, response).catch((error) => {
      writeJson(response, 500, {
        error: error instanceof Error ? error.message : "Internal server error"
      });
    });
  });

  server.listen(PORT, "127.0.0.1", () => {
    log(`Wanxia cache service listening on 127.0.0.1:${PORT}`);
  });
}

function installCurlTransport() {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes("open-meteo.com")) {
      return curlFetch(url);
    }
    return nativeFetch(input, init);
  }) as typeof fetch;
}

async function curlFetch(url: string): Promise<Response> {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "--silent",
      "--show-error",
      "--location",
      "--connect-timeout",
      "12",
      "--max-time",
      "90",
      "--write-out",
      "\n%{http_code}",
      url
    ],
    {
      maxBuffer: 30 * 1024 * 1024
    }
  );
  const splitAt = stdout.lastIndexOf("\n");
  const body = splitAt >= 0 ? stdout.slice(0, splitAt) : stdout;
  const status = splitAt >= 0 ? Number(stdout.slice(splitAt + 1)) : 200;
  return new Response(body, {
    status: Number.isFinite(status) ? status : 502,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

async function handleRequest(
  request: Parameters<typeof createServer>[0] extends (request: infer R, response: infer S) => unknown ? R : never,
  response: Parameters<typeof createServer>[0] extends (request: infer R, response: infer S) => unknown ? S : never
) {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (url.pathname === "/api/wanxia-data") {
    const selection = selectionFromUrl(url);
    const item = await getCacheItem(selection);
    if (!item) {
      writeJson(response, 503, {
        error: "后台数据仍在预热",
        status: cacheStatus()
      });
      return;
    }

    response.setHeader("X-Wanxia-Backend-Cache", isCacheFresh(item.updatedAt) ? "HIT" : "STALE");
    response.setHeader("X-Wanxia-Backend-Updated-At", item.updatedAt);
    writeJson(response, 200, item.data);
    return;
  }

  if (url.pathname === "/api/wanxia-cache/status") {
    writeJson(response, 200, cacheStatus());
    return;
  }

  writeJson(response, 404, { error: "Not found" });
}

async function getCacheItem(selection: PredictionSelection): Promise<CacheItem | null> {
  const key = selectionKey(selection);
  const existing = cache.items[key];
  if (existing) return existing;

  if (!canRetryAfterFailure()) return null;
  await ensureRefresh([selection]);
  if (!cache.items[key] && canRetryAfterFailure()) {
    await refreshAll("request", [selection]);
  }
  return cache.items[key] ?? null;
}

function selectionFromUrl(url: URL): PredictionSelection {
  const regionId = normalizeRegionId(url.searchParams.get("regionId") ?? undefined);
  const day = url.searchParams.get("day") === "tomorrow" ? "tomorrow" : "today";
  const eventType = url.searchParams.get("eventType") === "sunrise" ? "sunrise" : "sunset";
  return { day, eventType, regionId };
}

function scheduleRefresh() {
  setInterval(() => void refreshAll("interval"), REFRESH_INTERVAL_MS);
}

async function ensureRefresh(selections = SELECTIONS): Promise<void> {
  if (!refreshPromise) refreshPromise = refreshAll("request", selections);
  return refreshPromise;
}

function canRetryAfterFailure(): boolean {
  return Date.now() - lastFailedRefreshAt >= FAILED_REFRESH_COOLDOWN_MS;
}

async function refreshAll(reason: string, selections = SELECTIONS): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const startedAt = new Date();
    const nextCache: PersistentCache = {
      ...cache,
      version: CACHE_VERSION,
      refreshStartedAt: startedAt.toISOString(),
      refreshFinishedAt: null,
      errors: []
    };

    log(`Refresh started (${reason})`);
    try {
      const results = await fetchWanxiaDataBatch(new Date(), selections);
      for (const data of results) {
        const selection = data.selection;
        nextCache.items[selectionKey(selection)] = {
          selection,
          data,
          updatedAt: new Date().toISOString()
        };
        log(`Refreshed ${selection.day}/${selection.eventType}`);
      }
      lastFailedRefreshAt = 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      for (const selection of selections) {
        nextCache.errors.push({
          selection,
          message,
          at: new Date().toISOString()
        });
      }
      lastFailedRefreshAt = Date.now();
      log(`Refresh failed: ${message}`);
    }

    const finishedAt = new Date();
    nextCache.updatedAt = finishedAt.toISOString();
    nextCache.refreshFinishedAt = finishedAt.toISOString();
    nextCache.nextRefreshAt = new Date(finishedAt.getTime() + REFRESH_INTERVAL_MS).toISOString();
    cache = nextCache;
    await writeCache(cache);
    log(`Refresh finished with ${nextCache.errors.length} error(s)`);
  })();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function readCache(): Promise<PersistentCache> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as PersistentCache;
    if (parsed.version !== CACHE_VERSION || !parsed.items) return emptyCache();
    return parsed;
  } catch {
    return emptyCache();
  }
}

async function writeCache(nextCache: PersistentCache): Promise<void> {
  await mkdir(dirname(CACHE_FILE), { recursive: true });
  const tempFile = `${CACHE_FILE}.${process.pid}.tmp`;
  await writeFile(tempFile, JSON.stringify(nextCache), "utf8");
  await rename(tempFile, CACHE_FILE);
}

function cacheStatus() {
  return {
    version: cache.version,
    updatedAt: cache.updatedAt,
    nextRefreshAt: cache.nextRefreshAt,
    refreshStartedAt: cache.refreshStartedAt,
    refreshFinishedAt: cache.refreshFinishedAt,
    refreshing: Boolean(refreshPromise),
    retryAvailableAt: new Date(lastFailedRefreshAt + FAILED_REFRESH_COOLDOWN_MS).toISOString(),
    selections: Object.fromEntries(
      SELECTIONS.map((selection) => {
        const item = cache.items[selectionKey(selection)];
        return [
          selectionKey(selection),
          item
            ? {
                updatedAt: item.updatedAt,
                fresh: isCacheFresh(item.updatedAt),
                fetchedAt: item.data.fetchedAt
              }
            : null
        ];
      })
    ),
    cachedRegions: Array.from(
      new Set(Object.values(cache.items).map((item) => item.selection.regionId ?? DEFAULT_REGION_ID))
    ).sort(),
    errors: cache.errors
  };
}

function selectionKey(selection: PredictionSelection): `${string}-${ForecastDay}-${SolarEventType}` {
  return `${normalizeRegionId(selection.regionId)}-${selection.day}-${selection.eventType}`;
}

function isCacheFresh(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() <= REFRESH_INTERVAL_MS + 5 * 60 * 1000;
}

function emptyCache(): PersistentCache {
  return {
    version: CACHE_VERSION,
    updatedAt: null,
    nextRefreshAt: null,
    refreshStartedAt: null,
    refreshFinishedAt: null,
    items: {},
    errors: []
  };
}

function writeJson(
  response: Parameters<typeof createServer>[0] extends (request: infer R, response: infer S) => unknown ? S : never,
  statusCode: number,
  body: unknown
) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

void main();
