import { buildRegionCloudGrid, computeCloudMap } from "../model/cloudMap";
import { buildLightCorridor } from "../model/geo";
import { computeHenanOverview } from "../model/henanOverview";
import {
  DEFAULT_REGION_ID,
  getRegionOption,
  getRegionSamplePoints,
  normalizeRegionId
} from "../model/regions";
import { getSolarAzimuthDeg } from "../model/solar";
import type {
  AirQualityPoint,
  CityAirQualitySample,
  CityForecastSample,
  CloudGridPoint,
  CorridorPoint,
  ForecastPoint,
  ForecastSample,
  HenanCity,
  HenanOverview,
  PredictionSelection,
  WanxiaData,
  WeatherBundle
} from "../model/types";

export type WanxiaDataLoadSource = "backend" | "live";

export interface WanxiaDataLoadResult {
  data: WanxiaData;
  source: WanxiaDataLoadSource;
}

const WEATHER_CHUNK_SIZE = 9;
const CLOUD_GRID_ROWS = 7;
const CLOUD_GRID_COLUMNS = 9;
const WEATHER_API_ENDPOINT = "/api/open-meteo/v1/forecast";
const AIR_QUALITY_API_ENDPOINT = "/api/air-quality/v1/air-quality";
const WEATHER_DIRECT_ENDPOINT =
  typeof window === "undefined"
    ? "https://historical-forecast-api.open-meteo.com/v1/forecast"
    : "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_DIRECT_ENDPOINT = "https://air-quality-api.open-meteo.com/v1/air-quality";
const OPEN_METEO_TIMEOUT_MS = 45_000;

const WEATHER_HOURLY = [
  "cloud_cover",
  "cloud_cover_low",
  "cloud_cover_mid",
  "cloud_cover_high",
  "visibility",
  "precipitation",
  "precipitation_probability",
  "rain",
  "showers",
  "relative_humidity_2m",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "weather_code",
  "pressure_msl"
].join(",");

const AIR_HOURLY = ["pm10", "pm2_5", "aerosol_optical_depth", "dust", "us_aqi"].join(",");

interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
  hourly: {
    time: string[];
    cloud_cover: number[];
    cloud_cover_low: number[];
    cloud_cover_mid: number[];
    cloud_cover_high: number[];
    visibility: number[];
    precipitation: number[];
    precipitation_probability: number[];
    rain: number[];
    showers: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
    weather_code: number[];
    pressure_msl: number[];
  };
}

interface OpenMeteoAirResponse {
  hourly: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    aerosol_optical_depth: number[];
    dust: number[];
    us_aqi: number[];
  };
}

interface ForecastRequestLocation<T> {
  id: string;
  latitude: number;
  longitude: number;
  source: T;
}

const DEFAULT_SELECTION: PredictionSelection = {
  eventType: "sunset",
  day: "today",
  regionId: DEFAULT_REGION_ID
};
const ALL_SELECTIONS: PredictionSelection[] = [
  { day: "today", eventType: "sunrise", regionId: DEFAULT_REGION_ID },
  { day: "today", eventType: "sunset", regionId: DEFAULT_REGION_ID },
  { day: "tomorrow", eventType: "sunrise", regionId: DEFAULT_REGION_ID },
  { day: "tomorrow", eventType: "sunset", regionId: DEFAULT_REGION_ID }
];

export async function loadWanxiaData(
  now = new Date(),
  selection: PredictionSelection = DEFAULT_SELECTION
): Promise<WanxiaDataLoadResult> {
  try {
    return {
      data: await fetchBackendWanxiaData(selection),
      source: "backend"
    };
  } catch {
    return {
      data: await fetchWanxiaData(now, selection),
      source: "live"
    };
  }
}

export async function fetchWanxiaData(
  now = new Date(),
  selection: PredictionSelection = DEFAULT_SELECTION
): Promise<WanxiaData> {
  return (await fetchWanxiaDataBatch(now, [selection]))[0];
}

export async function fetchWanxiaDataBatch(
  now = new Date(),
  selections: PredictionSelection[] = ALL_SELECTIONS
): Promise<WanxiaData[]> {
  const results: WanxiaData[] = [];
  const groupedSelections = groupSelectionsByRegion(selections);
  for (const [regionId, regionSelections] of groupedSelections) {
    results.push(...(await fetchWanxiaDataForRegionBatch(now, regionSelections, regionId)));
  }
  return results;
}

async function fetchWanxiaDataForRegionBatch(
  now: Date,
  selections: PredictionSelection[],
  regionId: string
): Promise<WanxiaData[]> {
  const fetchedAt = new Date().toISOString();
  const region = getRegionOption(regionId);
  const target = {
    id: region.id,
    name: region.name,
    shortName: region.shortName,
    latitude: region.latitude,
    longitude: region.longitude
  };
  const regionSamplePoints = getRegionSamplePoints(region.id);
  const [centerForecast] = await fetchForecastForLocations([
    {
      id: `${region.id}-target`,
      latitude: region.latitude,
      longitude: region.longitude,
      source: target
    }
  ]);
  const contexts = selections.map((selection) => {
    const targetEventTime = pickSelectedEventTime(centerForecast, now, selection);
    const eventAzimuth = getSolarAzimuthDeg(new Date(targetEventTime), region);
    return {
      key: selectionKey({ ...selection, regionId: region.id }),
      selection: { ...selection, regionId: region.id },
      targetEventTime,
      corridor: buildLightCorridor(
        target,
        eventAzimuth,
        selection.eventType === "sunrise" ? "东方光路" : "西方光路"
      )
    };
  });
  const cloudGrid = buildRegionCloudGrid(region.bounds, CLOUD_GRID_ROWS, CLOUD_GRID_COLUMNS);

  const corridorRequests = contexts.flatMap((context) =>
    context.corridor.map((location) => ({
      id: `${context.key}-${location.id}`,
      latitude: location.latitude,
      longitude: location.longitude,
      source: {
        key: context.key,
        location
      }
    }))
  );

  const corridorForecasts = await fetchForecastForLocations(corridorRequests);
  const cityForecasts = await fetchForecastForLocations(
    regionSamplePoints.map((city) => forecastLocation(city.id, city))
  );
  const cloudForecasts = await fetchForecastForLocations(
    cloudGrid.map((point) => forecastLocation(point.id, point)),
    WEATHER_CHUNK_SIZE
  );
  const cityAirQuality = await fetchAirQualityForCities(regionSamplePoints);

  const zhengzhouAirQuality =
    cityAirQuality.find((sample) => sample.cityId === regionSamplePoints[0]?.id)?.hourly ?? [];
  const cityForecastSamples: CityForecastSample[] = cityForecasts.map((sample) => ({
      city: sample.source,
      dates: sample.dates,
      sunrises: sample.sunrises,
      sunsets: sample.sunsets,
      hourly: sample.hourly
  }));
  const cloudForecastSamples = cloudForecasts.map((sample) => ({
      point: sample.source,
      hourly: sample.hourly
  }));
  const corridorForecastMap = new Map(
    corridorForecasts.map((sample) => [
      `${sample.source.key}-${sample.source.location.id}`,
      sample
    ])
  );

  return contexts.map((context) => {
    const weatherBundle: WeatherBundle = {
      corridor: context.corridor,
      forecasts: context.corridor.map((location) => {
        const sample = corridorForecastMap.get(`${context.key}-${location.id}`);
        if (!sample) {
          throw new Error(`缺少${context.key}光路采样点：${location.id}`);
        }
        return {
          location,
          dates: sample.dates,
          sunrises: sample.sunrises,
          sunsets: sample.sunsets,
          hourly: sample.hourly
        };
      }),
      airQuality: zhengzhouAirQuality,
      fetchedAt
    };
    const henanOverview = computeHenanOverview(
      cityForecastSamples,
      cityAirQuality,
      now,
      context.selection,
      region.shortName
    );
    const cloudMap = computeCloudMap(
      cloudForecastSamples,
      context.targetEventTime,
      CLOUD_GRID_ROWS,
      CLOUD_GRID_COLUMNS,
      context.selection.eventType,
      region.bounds
    );

    return {
      weatherBundle,
      henanOverview,
      cloudMap,
      selection: context.selection,
      region,
      fetchedAt
    };
  });
}

export async function fetchWeatherBundle(now = new Date()): Promise<WeatherBundle> {
  return (await fetchWanxiaData(now)).weatherBundle;
}

export async function fetchHenanOverview(now = new Date()): Promise<HenanOverview> {
  return (await fetchWanxiaData(now)).henanOverview;
}

export async function fetchForecast(corridor: CorridorPoint[]): Promise<ForecastSample[]> {
  const samples = await fetchForecastForLocations(
    corridor.map((location) => forecastLocation(location.id, location))
  );
  return samples.map((sample) => ({
    location: sample.source,
    dates: sample.dates,
    sunrises: sample.sunrises,
    sunsets: sample.sunsets,
    hourly: sample.hourly
  }));
}

export async function fetchAirQuality(): Promise<AirQualityPoint[]> {
  const region = getRegionOption(DEFAULT_REGION_ID);
  const [sample] = await fetchAirQualityForCities([
    {
      id: region.id,
      name: region.name,
      shortName: region.shortName,
      latitude: region.latitude,
      longitude: region.longitude
    }
  ]);
  return sample.hourly;
}

async function fetchForecastForLocations<T>(
  locations: ForecastRequestLocation<T>[],
  chunkSize = WEATHER_CHUNK_SIZE
): Promise<Array<{ source: T; hourly: ForecastPoint[]; dates: string[]; sunrises: string[]; sunsets: string[] }>> {
  const chunks = chunk(locations, chunkSize);
  const responses: Array<{ source: T; hourly: ForecastPoint[]; dates: string[]; sunrises: string[]; sunsets: string[] }> = [];
  for (const locationChunk of chunks) {
    const params = new URLSearchParams({
      latitude: locationChunk.map((location) => location.latitude.toFixed(4)).join(","),
      longitude: locationChunk.map((location) => location.longitude.toFixed(4)).join(","),
      timezone: "Asia/Shanghai",
      forecast_days: "3",
      hourly: WEATHER_HOURLY,
      daily: "sunrise,sunset",
      wind_speed_unit: "kmh",
      precipitation_unit: "mm"
    });
    const json = await fetchOpenMeteoJson<OpenMeteoWeatherResponse | OpenMeteoWeatherResponse[]>(
      WEATHER_API_ENDPOINT,
      WEATHER_DIRECT_ENDPOINT,
      params,
      "天气"
    );
    const payloads: OpenMeteoWeatherResponse[] = Array.isArray(json) ? json : [json];
    responses.push(
      ...payloads.map((payload, index) => ({
        source: locationChunk[index].source,
        dates: payload.daily.time,
        sunrises: payload.daily.sunrise,
        sunsets: payload.daily.sunset,
        hourly: normalizeForecastHourly(payload)
      }))
    );
  }
  return responses;
}

async function fetchAirQualityForCities(cities: HenanCity[]): Promise<CityAirQualitySample[]> {
  const chunks = chunk(cities, WEATHER_CHUNK_SIZE);
  const samples: CityAirQualitySample[] = [];
  for (const cityChunk of chunks) {
    const params = new URLSearchParams({
      latitude: cityChunk.map((city) => city.latitude.toFixed(4)).join(","),
      longitude: cityChunk.map((city) => city.longitude.toFixed(4)).join(","),
      timezone: "Asia/Shanghai",
      forecast_days: "3",
      hourly: AIR_HOURLY
    });
    const json = await fetchOpenMeteoJson<OpenMeteoAirResponse | OpenMeteoAirResponse[]>(
      AIR_QUALITY_API_ENDPOINT,
      AIR_QUALITY_DIRECT_ENDPOINT,
      params,
      "空气质量"
    );
    const payloads: OpenMeteoAirResponse[] = Array.isArray(json) ? json : [json];
    samples.push(
      ...payloads.map((payload, index) => ({
        cityId: cityChunk[index].id,
        hourly: normalizeAirHourly(payload)
      }))
    );
  }
  return samples;
}

function forecastLocation<T extends CorridorPoint | HenanCity | CloudGridPoint>(
  id: string,
  source: T
): ForecastRequestLocation<T> {
  return {
    id,
    latitude: source.latitude,
    longitude: source.longitude,
    source
  };
}

function selectionKey(selection: PredictionSelection): string {
  return `${normalizeRegionId(selection.regionId)}-${selection.day}-${selection.eventType}`;
}

async function fetchOpenMeteoJson<T>(
  proxyEndpoint: string,
  directEndpoint: string,
  params: URLSearchParams,
  label: string
): Promise<T> {
  const query = params.toString();
  let proxyStatus: number | undefined;
  const serverSide = !canUseSameOriginProxy();

  if (!serverSide) {
    try {
      const proxyResponse = await fetchWithTimeout(`${proxyEndpoint}?${query}`);
      if (proxyResponse.ok) return proxyResponse.json() as Promise<T>;
      proxyStatus = proxyResponse.status;
    } catch {
      proxyStatus = 0;
    }
  }

  const maxAttempts = serverSide ? 4 : 1;
  let lastFailure = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const directResponse = await fetchWithTimeout(`${directEndpoint}?${query}`);
      if (directResponse.ok) return directResponse.json() as Promise<T>;
      lastFailure = `直连失败：${directResponse.status}`;
      if (!serverSide || !isRetryableStatus(directResponse.status) || attempt === maxAttempts) {
        break;
      }
    } catch (error) {
      lastFailure = error instanceof Error ? `直连 Open-Meteo 失败：${describeFetchError(error)}` : "直连 Open-Meteo 失败";
      if (!serverSide || attempt === maxAttempts) break;
    }
    await delay(3000 * attempt);
  }

  const prefix = proxyStatus === undefined ? "" : `代理失败：${proxyStatus}，`;
  throw new Error(`${label}接口请求失败：${prefix}${lastFailure}`);
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPEN_METEO_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function describeFetchError(error: Error): string {
  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause && typeof cause === "object") {
    const code = "code" in cause ? String(cause.code) : "";
    const message = "message" in cause ? String(cause.message) : "";
    return [error.message, code, message].filter(Boolean).join(" / ");
  }
  return error.message;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

async function fetchBackendWanxiaData(selection: PredictionSelection): Promise<WanxiaData> {
  const params = new URLSearchParams({
    regionId: normalizeRegionId(selection.regionId),
    day: selection.day,
    eventType: selection.eventType
  });
  const response = await fetch(`/api/wanxia-data?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`后台预热数据请求失败：${response.status}`);
  }
  return response.json() as Promise<WanxiaData>;
}

function groupSelectionsByRegion(selections: PredictionSelection[]): Map<string, PredictionSelection[]> {
  const groups = new Map<string, PredictionSelection[]>();
  for (const selection of selections) {
    const regionId = normalizeRegionId(selection.regionId);
    const nextSelection = { ...selection, regionId };
    groups.set(regionId, [...(groups.get(regionId) ?? []), nextSelection]);
  }
  return groups;
}

function canUseSameOriginProxy(): boolean {
  return typeof window !== "undefined" && typeof window.location !== "undefined";
}

function pickSelectedEventTime(
  sample: { dates: string[]; sunrises: string[]; sunsets: string[] },
  now: Date,
  selection: PredictionSelection
): string {
  const targetDate = formatLocalDate(addDays(now, selection.day === "tomorrow" ? 1 : 0));
  const index = sample.dates.findIndex((date) => date === targetDate);
  const events = selection.eventType === "sunrise" ? sample.sunrises : sample.sunsets;
  const selected = index >= 0 ? events[index] : undefined;
  const fallback = events.filter(Boolean)[selection.day === "tomorrow" ? 1 : 0] ?? events.filter(Boolean)[0];
  return selected || fallback || new Date(now).toISOString();
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeForecastHourly(payload: OpenMeteoWeatherResponse): ForecastPoint[] {
  return payload.hourly.time.map((time, index) => ({
    time,
    cloudCover: safeNumber(payload.hourly.cloud_cover[index]),
    cloudCoverLow: safeNumber(payload.hourly.cloud_cover_low[index]),
    cloudCoverMid: safeNumber(payload.hourly.cloud_cover_mid[index]),
    cloudCoverHigh: safeNumber(payload.hourly.cloud_cover_high[index]),
    visibilityM: safeNumber(payload.hourly.visibility[index]),
    precipitationMm: safeNumber(payload.hourly.precipitation[index]),
    precipitationProbability: safeNumber(payload.hourly.precipitation_probability[index]),
    rainMm: safeNumber(payload.hourly.rain[index]),
    showersMm: safeNumber(payload.hourly.showers[index]),
    relativeHumidity: safeNumber(payload.hourly.relative_humidity_2m[index]),
    windSpeedKmh: safeNumber(payload.hourly.wind_speed_10m[index]),
    windDirectionDeg: safeNumber(payload.hourly.wind_direction_10m[index]),
    windGustsKmh: safeNumber(payload.hourly.wind_gusts_10m[index]),
    weatherCode: safeNumber(payload.hourly.weather_code[index]),
    pressureMsl: safeNumber(payload.hourly.pressure_msl[index])
  }));
}

function normalizeAirHourly(payload: OpenMeteoAirResponse): AirQualityPoint[] {
  return payload.hourly.time.map((time, index) => ({
    time,
    pm10: safeNumber(payload.hourly.pm10[index]),
    pm25: safeNumber(payload.hourly.pm2_5[index]),
    aerosolOpticalDepth: safeNumber(payload.hourly.aerosol_optical_depth[index]),
    dust: safeNumber(payload.hourly.dust[index]),
    usAqi: safeNumber(payload.hourly.us_aqi[index])
  }));
}

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
