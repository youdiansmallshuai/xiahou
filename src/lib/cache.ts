import type {
  HenanGeoJsonMap,
  HenanOverview,
  WanxiaData,
  WeatherBundle
} from "../model/types";

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
  try {
    const raw = localStorage.getItem(HENAN_GEO_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedHenanGeoJsonMap;
    if (maxAgeMs !== undefined && isCacheExpired(cached.cachedAt, maxAgeMs)) return null;
    return cached;
  } catch {
    return null;
  }
}

export function writeHenanGeoJsonCache(map: HenanGeoJsonMap): void {
  try {
    localStorage.setItem(
      HENAN_GEO_CACHE_KEY,
      JSON.stringify({
        map,
        cachedAt: new Date().toISOString()
      })
    );
  } catch {
    // Cache is a convenience only. The app should still work if storage is blocked.
  }
}

function isCacheExpired(cachedAt: string, maxAgeMs: number): boolean {
  return Date.now() - new Date(cachedAt).getTime() > maxAgeMs;
}
