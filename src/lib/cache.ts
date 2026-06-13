import type {
  HenanGeoJsonMap,
  HenanOverview,
  PredictionSelection,
  WanxiaData,
  WeatherBundle
} from "../model/types";
import { DEFAULT_REGION_ID, normalizeRegionId } from "../model/regions";

const WEATHER_CACHE_KEY = "wanxia.weatherBundle.v1";
const HENAN_CACHE_KEY = "wanxia.henanOverview.v1";
const WANXIA_CACHE_KEY = "wanxia.unifiedData.v1";
const HENAN_GEO_CACHE_KEY = "wanxia.henanGeoJson.v1";

export interface CachedWeatherBundle {
  bundle: WeatherBundle;
  cachedAt: string;
}

export interface CachedHenanOverview {
  overview: HenanOverview;
  cachedAt: string;
}

export interface CachedWanxiaData {
  data: WanxiaData;
  cachedAt: string;
}

export interface CachedHenanGeoJsonMap {
  map: HenanGeoJsonMap;
  cachedAt: string;
}

export function readWeatherCache(): CachedWeatherBundle | null {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedWeatherBundle;
  } catch {
    return null;
  }
}

export function writeWeatherCache(bundle: WeatherBundle): void {
  try {
    localStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({
        bundle,
        cachedAt: new Date().toISOString()
      })
    );
  } catch {
    // Cache is a convenience only. The app should still work if storage is blocked.
  }
}

export function readHenanOverviewCache(): CachedHenanOverview | null {
  try {
    const raw = localStorage.getItem(HENAN_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedHenanOverview;
  } catch {
    return null;
  }
}

export function writeHenanOverviewCache(overview: HenanOverview): void {
  try {
    localStorage.setItem(
      HENAN_CACHE_KEY,
      JSON.stringify({
        overview,
        cachedAt: new Date().toISOString()
      })
    );
  } catch {
    // Cache is a convenience only. The app should still work if storage is blocked.
  }
}

export function readWanxiaDataCache(maxAgeMs?: number): CachedWanxiaData | null {
  try {
    const raw = localStorage.getItem(WANXIA_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedWanxiaData;
    if (maxAgeMs !== undefined && isCacheExpired(cached.cachedAt, maxAgeMs)) return null;
    return cached;
  } catch {
    return null;
  }
}

export function writeWanxiaDataCache(data: WanxiaData): void {
  try {
    localStorage.setItem(
      WANXIA_CACHE_KEY,
      JSON.stringify({
        data,
        cachedAt: new Date().toISOString()
      })
    );
  } catch {
    // Cache is a convenience only. The app should still work if storage is blocked.
  }
}

export function readHenanGeoJsonCache(maxAgeMs?: number): CachedHenanGeoJsonMap | null {
  return readRegionGeoJsonCache("410000", maxAgeMs);
}

export function writeHenanGeoJsonCache(map: HenanGeoJsonMap): void {
  writeRegionGeoJsonCache(map);
}

export function readRegionGeoJsonCache(regionId = DEFAULT_REGION_ID, maxAgeMs?: number): CachedHenanGeoJsonMap | null {
  try {
    const raw = localStorage.getItem(regionGeoCacheKey(regionId));
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedHenanGeoJsonMap;
    if (maxAgeMs !== undefined && isCacheExpired(cached.cachedAt, maxAgeMs)) return null;
    return cached;
  } catch {
    return null;
  }
}

export function writeRegionGeoJsonCache(map: HenanGeoJsonMap): void {
  try {
    localStorage.setItem(
      regionGeoCacheKey(map.region?.id),
      JSON.stringify({
        map,
        cachedAt: new Date().toISOString()
      })
    );
  } catch {
    // Cache is a convenience only. The app should still work if storage is blocked.
  }
}

export function samePredictionSelection(
  left: PredictionSelection | undefined,
  right: PredictionSelection
): boolean {
  return (
    left?.day === right.day &&
    left.eventType === right.eventType &&
    normalizeRegionId(left.regionId) === normalizeRegionId(right.regionId)
  );
}

function regionGeoCacheKey(regionId: string | undefined): string {
  return `${HENAN_GEO_CACHE_KEY}.${normalizeRegionId(regionId)}`;
}

function isCacheExpired(cachedAt: string, maxAgeMs: number): boolean {
  return Date.now() - new Date(cachedAt).getTime() > maxAgeMs;
}
