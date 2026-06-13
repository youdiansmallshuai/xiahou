import { describe, expect, it } from "vitest";
import { buildSunsetCorridor, ZHENGZHOU } from "./geo";
import { computeSunsetPrediction } from "./scoring";
import type {
  AirQualityPoint,
  ForecastPoint,
  ForecastSample,
  ObservationSignal,
  WeatherBundle
} from "./types";

const SUNSET = "2026-06-11T19:38";
const SUNRISE = "2026-06-11T05:12";
const NOW = new Date("2026-06-11T18:50");
const TIMES = [
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

describe("computeSunsetPrediction", () => {
  it("scores a clean low-cloud, textured high-cloud setup as worth watching", () => {
    const prediction = computeSunsetPrediction(makeBundle(), NOW);

    expect(prediction.probability).toBeGreaterThanOrEqual(75);
    expect(prediction.fireCloudProbability).toBeGreaterThanOrEqual(prediction.probability);
    expect(prediction.majorBoosts.length).toBeGreaterThan(0);
  });

  it("caps the probability when low cloud blocks the western light path", () => {
    const prediction = computeSunsetPrediction(
      makeBundle({
        cloudCoverLow: 88,
        cloudCoverMid: 30,
        cloudCoverHigh: 45
      }),
      NOW
    );

    expect(prediction.totalScore).toBeLessThanOrEqual(55);
    expect(prediction.appliedCap).toContain("低云");
  });

  it("penalizes a missing high-cloud canvas", () => {
    const prediction = computeSunsetPrediction(
      makeBundle({
        cloudCoverLow: 8,
        cloudCoverMid: 15,
        cloudCoverHigh: 4
      }),
      NOW
    );
    const canvas = prediction.factorScores.find((factor) => factor.key === "canvas");

    expect(canvas?.status).toBe("risk");
    expect(prediction.fireCloudProbability).toBeLessThan(prediction.probability);
  });

  it("limits fire-cloud probability when high cloud is overfilled", () => {
    const prediction = computeSunsetPrediction(
      makeBundle({
        cloudCoverLow: 7,
        cloudCoverMid: 20,
        cloudCoverHigh: 96
      }),
      NOW
    );

    expect(prediction.fireCloudProbability).toBeLessThanOrEqual(58);
    expect(prediction.factorScores.find((factor) => factor.key === "canvas")?.summary).toContain("粉灰");
  });

  it("caps the whole forecast when rain is present near sunset", () => {
    const prediction = computeSunsetPrediction(
      makeBundle({
        precipitationMm: 0.8,
        precipitationProbability: 86,
        weatherCode: 61
      }),
      NOW
    );

    expect(prediction.totalScore).toBeLessThanOrEqual(50);
    expect(prediction.appliedCap).toContain("降水");
  });

  it("strongly penalizes poor visibility and heavy aerosol", () => {
    const prediction = computeSunsetPrediction(
      makeBundle(
        {
          visibilityM: 3200
        },
        {
          pm25: 92,
          aerosolOpticalDepth: 0.92,
          dust: 80
        }
      ),
      NOW
    );

    expect(prediction.totalScore).toBeLessThanOrEqual(45);
    expect(prediction.factorScores.find((factor) => factor.key === "aerosol")?.status).toBe("risk");
  });

  it("lets western wind amplify a clear western corridor", () => {
    const clearWest = computeSunsetPrediction(
      makeBundle({
        windDirectionDeg: 292,
        windSpeedKmh: 14,
        windGustsKmh: 22,
        westernLowCloud: 12
      }),
      NOW
    );
    const blockedWest = computeSunsetPrediction(
      makeBundle({
        windDirectionDeg: 292,
        windSpeedKmh: 14,
        windGustsKmh: 22,
        westernLowCloud: 82
      }),
      NOW
    );

    expect(scoreOf(clearWest, "wind")).toBeGreaterThan(scoreOf(blockedWest, "wind"));
  });

  it("applies and clamps manual observation adjustments", () => {
    const signals: ObservationSignal[] = ["westernGap", "brightCloudEdge", "yellowCloudBase"];
    const prediction = computeSunsetPrediction(makeBundle(), NOW, signals);

    expect(prediction.manualAdjustment).toBe(15);
    expect(prediction.selectedSignals.filter((signal) => signal.active)).toHaveLength(3);
  });

  it("scores a selected sunrise forecast with an eastern viewing direction", () => {
    const prediction = computeSunsetPrediction(
      makeBundle(),
      new Date("2026-06-11T04:50"),
      [],
      {
        eventType: "sunrise",
        day: "today"
      }
    );

    expect(prediction.eventType).toBe("sunrise");
    expect(prediction.eventLabel).toBe("日出");
    expect(prediction.directionLabel).toContain("东");
    expect(prediction.strategy).toContain("东");
  });
});

function scoreOf(
  prediction: ReturnType<typeof computeSunsetPrediction>,
  key: string
): number {
  return prediction.factorScores.find((factor) => factor.key === key)?.score ?? 0;
}

function makeBundle(
  overrides: Partial<ForecastPoint> & { westernLowCloud?: number } = {},
  airOverrides: Partial<AirQualityPoint> = {}
): WeatherBundle {
  const corridor = buildSunsetCorridor(ZHENGZHOU, 292);
  const forecasts: ForecastSample[] = corridor.map((location) => ({
    location,
    dates: ["2026-06-11", "2026-06-12"],
    sunrises: [SUNRISE, "2026-06-12T05:12"],
    sunsets: [SUNSET, "2026-06-12T19:39"],
    hourly: TIMES.map((time) => {
      const pointOverrides: Partial<ForecastPoint> = { ...overrides };
      if (location.id !== "center" && overrides.westernLowCloud !== undefined) {
        pointOverrides.cloudCoverLow = overrides.westernLowCloud;
      }
      return makeForecastPoint(time, pointOverrides);
    })
  }));

  return {
    corridor,
    forecasts,
    airQuality: TIMES.map((time) => makeAirQualityPoint(time, airOverrides)),
    fetchedAt: "2026-06-11T09:00:00.000Z"
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
    windDirectionDeg: 260,
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
