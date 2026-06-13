import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { buildSunsetCorridor, ZHENGZHOU } from "./model/geo";
import type {
  AirQualityPoint,
  CloudMap,
  ForecastPoint,
  HenanOverview,
  PredictionSelection,
  WanxiaData
} from "./model/types";

const HOURLY_TIMES = [
  "2026-06-11T04:00",
  "2026-06-11T05:00",
  "2026-06-11T06:00",
  "2026-06-11T18:00",
  "2026-06-11T19:00",
  "2026-06-11T20:00",
  "2026-06-12T04:00",
  "2026-06-12T05:00",
  "2026-06-12T06:00",
  "2026-06-12T18:00",
  "2026-06-12T19:00",
  "2026-06-12T20:00"
];

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders a live prediction from mocked Open-Meteo responses", async () => {
    const fetchMock = vi.fn(mockOpenMeteoFetch);
    vi.stubGlobal("fetch", fetchMock);

    const { unmount } = render(<App clock={() => new Date("2026-06-11T18:45:00+08:00")} />);

    expect(await screen.findByText("总体概率")).toBeInTheDocument();
    expect(screen.getByText("烧度预报")).toBeInTheDocument();
    expect(screen.getByText("全国云图概览")).toBeInTheDocument();
    expect(screen.getByText("现场修正")).toBeInTheDocument();
    expect(screen.getByText("主要加分项")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "今日" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "明日" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /朝霞/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /晚霞/ })).toBeInTheDocument();
    expect(screen.getByLabelText("选择全国或省份")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([input]) => String(input).includes("/api/wanxia-data"))).toBe(true);
      expect(fetchMock.mock.calls.some(([input]) => String(input).includes("/data/china-provinces.json"))).toBe(true);
    });
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/wanxia-data");
    expect(fetchMock.mock.calls.some(([input]) => String(input).includes("geo.datav"))).toBe(false);

    unmount();
    fetchMock.mockClear();
    render(<App clock={() => new Date("2026-06-11T18:50:00+08:00")} />);

    expect(await screen.findByText("总体概率")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(/后台预热数据/).length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([input]) => String(input).includes("/api/wanxia-data"))).toBe(true);
    });
  });
});

function mockOpenMeteoFetch(input: RequestInfo | URL): Promise<unknown> {
  const url = new URL(String(input), "http://127.0.0.1:5173");
  if (url.pathname === "/data/china-provinces.json" || url.pathname.startsWith("/data/provinces/")) {
    return Promise.resolve(jsonResponse(geoJsonResponse()));
  }
  if (url.pathname === "/api/wanxia-data") {
    const selection: PredictionSelection = {
      regionId: url.searchParams.get("regionId") ?? "china",
      day: url.searchParams.get("day") === "tomorrow" ? "tomorrow" : "today",
      eventType: url.searchParams.get("eventType") === "sunrise" ? "sunrise" : "sunset"
    };
    return Promise.resolve(jsonResponse(wanxiaDataResponse(selection)));
  }
  const latitudeCount = (url.searchParams.get("latitude") ?? "").split(",").filter(Boolean).length;
  if (url.pathname.includes("/api/air-quality")) {
    return Promise.resolve(
      jsonResponse(latitudeCount > 1 ? repeated(latitudeCount, airQualityResponse()) : airQualityResponse())
    );
  }
  return Promise.resolve(jsonResponse(weatherResponse(latitudeCount || 3)));
}

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload
  };
}

function wanxiaDataResponse(selection: PredictionSelection): WanxiaData {
  return {
    weatherBundle: {
      corridor: buildSunsetCorridor(ZHENGZHOU, 292),
      forecasts: buildSunsetCorridor(ZHENGZHOU, 292).map((location) => ({
        location,
        dates: ["2026-06-11", "2026-06-12"],
        sunrises: ["2026-06-11T05:12", "2026-06-12T05:12"],
        sunsets: ["2026-06-11T19:38", "2026-06-12T19:39"],
        hourly: HOURLY_TIMES.map((time) => makeForecastPoint(time))
      })),
      airQuality: HOURLY_TIMES.map((time) => makeAirQualityPoint(time)),
      fetchedAt: "2026-06-11T09:00:00.000Z"
    },
    henanOverview: overviewResponse(),
    cloudMap: cloudMapResponse(),
    selection,
    region: {
      id: "china",
      adcode: "100000",
      name: "全国",
      shortName: "全国",
      level: "country",
      latitude: 35.8617,
      longitude: 104.1954,
      bounds: {
        minLatitude: 31.3,
        maxLatitude: 36.35,
        minLongitude: 110.3,
        maxLongitude: 116.8
      }
    },
    fetchedAt: "2026-06-11T09:00:00.000Z"
  };
}

function geoJsonResponse() {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          adcode: 100000,
          name: "全国",
          center: [113.6, 34.7]
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [110.3, 31.3],
              [116.8, 31.3],
              [116.8, 36.35],
              [110.3, 36.35],
              [110.3, 31.3]
            ]
          ]
        }
      }
    ]
  };
}

function overviewResponse(): HenanOverview {
  return {
    targetDate: "2026-06-11",
    generatedAt: "2026-06-11T09:00:00.000Z",
    averageProbability: 72,
    averageFireCloudProbability: 68,
    summary: "云图显示局地火烧云机会明显，重点看暖色高值区。",
    bestCities: [],
    riskCities: [],
    cities: []
  };
}

function cloudMapResponse(): CloudMap {
  return {
    targetTime: "2026-06-11T19:38",
    rows: 2,
    columns: 2,
    bounds: {
      minLatitude: 31.3,
      maxLatitude: 36.35,
      minLongitude: 110.3,
      maxLongitude: 116.8
    },
    summary: "云图显示局地火烧云机会明显，重点看暖色高值区。",
    cells: [
      cloudCell("grid-0-0", 0, 0, 36.35, 110.3, 72),
      cloudCell("grid-0-1", 0, 1, 36.35, 116.8, 66),
      cloudCell("grid-1-0", 1, 0, 31.3, 110.3, 58),
      cloudCell("grid-1-1", 1, 1, 31.3, 116.8, 74)
    ]
  };
}

function cloudCell(
  id: string,
  row: number,
  column: number,
  latitude: number,
  longitude: number,
  firePotential: number
) {
  return {
    id,
    row,
    column,
    latitude,
    longitude,
    cloudCoverLow: 8,
    cloudCoverMid: 32,
    cloudCoverHigh: 52,
    visibilityKm: 15.5,
    precipitationProbability: 5,
    firePotential,
    blocker: 8
  };
}

function makeForecastPoint(time: string, overrides: Partial<ForecastPoint> = {}): ForecastPoint {
  return {
    time,
    cloudCover: 45,
    cloudCoverLow: 8,
    cloudCoverMid: 32,
    cloudCoverHigh: 52,
    visibilityM: 15500,
    precipitationMm: 0,
    precipitationProbability: 5,
    rainMm: 0,
    showersMm: 0,
    relativeHumidity: 50,
    windSpeedKmh: 12,
    windDirectionDeg: 292,
    windGustsKmh: 20,
    weatherCode: 2,
    pressureMsl: 1002,
    ...overrides
  };
}

function makeAirQualityPoint(time: string, overrides: Partial<AirQualityPoint> = {}): AirQualityPoint {
  return {
    time,
    pm10: 42,
    pm25: 28,
    aerosolOpticalDepth: 0.28,
    dust: 22,
    usAqi: 88,
    ...overrides
  };
}

function weatherResponse(count = 3) {
  return repeated(count, {
    daily: {
      time: ["2026-06-11", "2026-06-12"],
      sunrise: ["2026-06-11T05:12", "2026-06-12T05:12"],
      sunset: ["2026-06-11T19:38", "2026-06-12T19:39"]
    },
    hourly: {
      time: HOURLY_TIMES,
      cloud_cover: fill(45),
      cloud_cover_low: fill(8),
      cloud_cover_mid: fill(32),
      cloud_cover_high: fill(52),
      visibility: fill(15500),
      precipitation: fill(0),
      precipitation_probability: fill(5),
      rain: fill(0),
      showers: fill(0),
      relative_humidity_2m: fill(50),
      wind_speed_10m: fill(12),
      wind_direction_10m: fill(292),
      wind_gusts_10m: fill(20),
      weather_code: fill(2),
      pressure_msl: fill(1002)
    }
  });
}

function airQualityResponse() {
  return {
    hourly: {
      time: HOURLY_TIMES,
      pm10: fill(42),
      pm2_5: fill(28),
      aerosol_optical_depth: fill(0.28),
      dust: fill(22),
      us_aqi: fill(88)
    }
  };
}

function fill(value: number) {
  return HOURLY_TIMES.map(() => value);
}

function repeated<T>(count: number, value: T): T[] {
  return Array.from({ length: count }, () => value);
}

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    }
  };
}
