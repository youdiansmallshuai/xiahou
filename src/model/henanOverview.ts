import type {
  AirQualityPoint,
  CityAirQualitySample,
  CityForecastSample,
  ForecastPoint,
  HenanCityPrediction,
  HenanOverview,
  PredictionSelection,
  SolarEventType
} from "./types";

const ONE_MINUTE = 60000;
const DEFAULT_SELECTION: PredictionSelection = {
  eventType: "sunset",
  day: "today"
};

export function computeHenanOverview(
  forecasts: CityForecastSample[],
  airQualitySamples: CityAirQualitySample[],
  now = new Date(),
  selection: PredictionSelection = DEFAULT_SELECTION
): HenanOverview {
  const cities = forecasts
    .map((sample) => {
      const airQuality = airQualitySamples.find((item) => item.cityId === sample.city.id)?.hourly ?? [];
      return computeCityPrediction(sample, airQuality, now, selection);
    })
    .sort((a, b) => b.probability - a.probability);

  const averageProbability = round1(mean(cities.map((city) => city.probability)));
  const averageFireCloudProbability = round1(mean(cities.map((city) => city.fireCloudProbability)));
  const bestCities = cities.slice(0, 5);
  const riskCities = [...cities].sort((a, b) => a.probability - b.probability).slice(0, 4);
  const targetDate = cities[0]?.eventTime.slice(0, 10) ?? "";

  return {
    targetDate,
    generatedAt: new Date().toISOString(),
    averageProbability,
    averageFireCloudProbability,
    summary: buildOverviewSummary(averageProbability, bestCities, selection.eventType),
    bestCities,
    riskCities,
    cities
  };
}

function computeCityPrediction(
  sample: CityForecastSample,
  airQuality: AirQualityPoint[],
  now: Date,
  selection: PredictionSelection
): HenanCityPrediction {
  const eventTime = pickSelectedEventTime(sample, now, selection);
  const windows = eventWindowsFor(selection.eventType);
  const window = collectWindow(sample.hourly, eventTime, windows.blocker[0], windows.blocker[1]);
  const canvasWindow = collectWindow(sample.hourly, eventTime, windows.canvas[0], windows.canvas[1]);
  const nearestAir = nearestAirQuality(airQuality, eventTime);

  const lowCloud = mean(window.map((point) => point.cloudCoverLow));
  const midCloud = mean(canvasWindow.map((point) => point.cloudCoverMid));
  const highCloud = mean(canvasWindow.map((point) => point.cloudCoverHigh));
  const visibilityKm = mean(window.map((point) => point.visibilityM)) / 1000;
  const precipitationMm = mean(window.map((point) => point.precipitationMm));
  const precipitationProbability = mean(window.map((point) => point.precipitationProbability));
  const windSpeed = mean(window.map((point) => point.windSpeedKmh));
  const gusts = Math.max(...window.map((point) => point.windGustsKmh), 0);

  const lightScore = piecewiseScore(lowCloud, [
    [0, 30],
    [20, 30],
    [50, 14],
    [80, 4],
    [100, 0]
  ]);
  const canvasScore =
    piecewiseScore(highCloud, [
      [0, 0],
      [10, 5],
      [25, 17],
      [75, 17],
      [90, 10],
      [100, 2]
    ]) +
    piecewiseScore(midCloud, [
      [0, 2],
      [10, 8],
      [50, 11],
      [70, 6],
      [100, 1]
    ]);
  const visibilityScore =
    piecewiseScore(visibilityKm, [
      [0, 0],
      [5, 4],
      [8, 10],
      [12, 14],
      [20, 14]
    ]) +
    8 -
    clamp(precipitationMm * 18, 0, 8) -
    piecewiseScore(precipitationProbability, [
      [0, 0],
      [25, 0],
      [50, 4],
      [80, 8],
      [100, 10]
    ]);
  const aerosolScore =
    (piecewiseScore(nearestAir.aerosolOpticalDepth, [
      [0, 4],
      [0.15, 7],
      [0.45, 7],
      [0.8, 2],
      [1.2, 0]
    ]) +
      piecewiseScore(nearestAir.pm25, [
        [0, 4],
        [15, 7],
        [45, 7],
        [75, 2],
        [120, 0]
      ])) /
    1.15;
  const windScore = clamp(6 + (windSpeed >= 4 && windSpeed <= 25 ? 2 : 0) - (gusts > 40 ? 2 : 0), 0, 8);

  let score = lightScore + canvasScore + visibilityScore + aerosolScore + windScore;
  if (lowCloud > 78) score = Math.min(score, 52);
  if (precipitationMm > 0.3 || precipitationProbability > 75) score = Math.min(score, 48);
  if (visibilityKm < 5) score = Math.min(score, 44);

  const probability = Math.round(clamp(scoreToProbability(score), 0, 100));
  const fireCloudProbability = Math.round(
    clamp(
      probability +
        (highCloud >= 25 && highCloud <= 75 ? 8 : 0) +
        (midCloud >= 10 && midCloud <= 50 ? 4 : 0) -
        (lowCloud > 50 ? 14 : 0) -
        (highCloud < 10 ? 18 : 0) -
        (highCloud > 90 ? 16 : 0) -
        (visibilityKm < 8 ? 12 : 0),
      0,
      highCloud > 90 ? 58 : 100
    )
  );

  return {
    city: sample.city,
    probability,
    fireCloudProbability,
    score: Math.round(clamp(score, 0, 100)),
    grade: gradeFor(probability),
    eventType: selection.eventType,
    eventTime,
    eventLabel: eventLabelFor(selection.eventType),
    sunsetTime: eventTime,
    reason: reasonFor(lowCloud, midCloud, highCloud, visibilityKm, precipitationProbability),
    risk: riskFor(lowCloud, highCloud, visibilityKm, precipitationProbability, nearestAir),
    diagnostics: {
      lowCloud: round1(lowCloud),
      midCloud: round1(midCloud),
      highCloud: round1(highCloud),
      visibilityKm: round1(visibilityKm),
      precipitationProbability: round1(precipitationProbability),
      pm25: round1(nearestAir.pm25),
      aod: round2(nearestAir.aerosolOpticalDepth)
    }
  };
}

function buildOverviewSummary(
  averageProbability: number,
  bestCities: HenanCityPrediction[],
  eventType: SolarEventType
): string {
  if (!bestCities.length) return "暂无河南城市概览数据";
  const names = bestCities.slice(0, 3).map((city) => city.city.shortName).join("、");
  const side = eventType === "sunrise" ? "东边" : "西边";
  const glowLabel = eventType === "sunrise" ? "朝霞" : "晚霞";
  if (averageProbability >= 70) return `全省${glowLabel}整体偏强，${names}一带最值得看${side}。`;
  if (averageProbability >= 55) return `全省有局地机会，优先看${names}。`;
  if (averageProbability >= 40) return `全省机会一般，${names}相对更有看头。`;
  return `全省整体偏弱，除非临场${side}突然开口。`;
}

function reasonFor(
  lowCloud: number,
  midCloud: number,
  highCloud: number,
  visibilityKm: number,
  precipitationProbability: number
): string {
  if (lowCloud <= 25 && highCloud >= 25 && highCloud <= 80 && visibilityKm >= 10) {
    return "低云少，中高云画布较好";
  }
  if (precipitationProbability > 60) return "降水概率偏高";
  if (lowCloud > 55) return "低云遮挡偏重";
  if (highCloud < 10) return "高云画布不足";
  if (highCloud > 90) return "高云过满，易成粉灰云幕";
  if (midCloud >= 10 && midCloud <= 60) return "中云纹理尚可";
  return "条件中性，等临场云缝";
}

function riskFor(
  lowCloud: number,
  highCloud: number,
  visibilityKm: number,
  precipitationProbability: number,
  airQuality: AirQualityPoint
): string {
  if (precipitationProbability > 60) return "雨幕";
  if (lowCloud > 55) return "低云墙";
  if (visibilityKm < 8) return "通透度";
  if (airQuality.pm25 > 65 || airQuality.aerosolOpticalDepth > 0.7) return "霾";
  if (highCloud < 10) return "无画布";
  if (highCloud > 90) return "云幕过厚";
  return "临场云缝";
}

function pickSelectedEventTime(
  sample: CityForecastSample,
  now: Date,
  selection: PredictionSelection
): string {
  const events = selection.eventType === "sunrise" ? sample.sunrises : sample.sunsets;
  const targetDate = formatLocalDate(addDays(now, selection.day === "tomorrow" ? 1 : 0));
  const dateIndex = sample.dates.findIndex((date) => date === targetDate);
  const selected = dateIndex >= 0 ? events[dateIndex] : undefined;
  const fallback = events.filter(Boolean)[selection.day === "tomorrow" ? 1 : 0] ?? events.filter(Boolean)[0];
  return selected || fallback || sample.sunsets.filter(Boolean)[0] || new Date(now).toISOString();
}

function eventLabelFor(eventType: SolarEventType): string {
  return eventType === "sunrise" ? "日出" : "日落";
}

function eventWindowsFor(eventType: SolarEventType): {
  blocker: [number, number];
  canvas: [number, number];
} {
  if (eventType === "sunrise") {
    return {
      blocker: [-55, 20],
      canvas: [-45, 15]
    };
  }
  return {
    blocker: [-45, 25],
    canvas: [-25, 25]
  };
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

function collectWindow(
  hourly: ForecastPoint[],
  sunsetTime: string,
  startMinutes: number,
  endMinutes: number
): ForecastPoint[] {
  const start = new Date(new Date(sunsetTime).getTime() + startMinutes * ONE_MINUTE);
  const end = new Date(new Date(sunsetTime).getTime() + endMinutes * ONE_MINUTE);
  return hourly.filter((point) => {
    const time = new Date(point.time);
    return time >= start && time <= end;
  });
}

function nearestAirQuality(airQuality: AirQualityPoint[], sunsetTime: string): AirQualityPoint {
  if (!airQuality.length) {
    return {
      time: sunsetTime,
      pm10: 0,
      pm25: 0,
      aerosolOpticalDepth: 0,
      dust: 0,
      usAqi: 0
    };
  }
  const target = new Date(sunsetTime).getTime();
  return airQuality.reduce((nearest, point) => {
    const nearestDistance = Math.abs(new Date(nearest.time).getTime() - target);
    const pointDistance = Math.abs(new Date(point.time).getTime() - target);
    return pointDistance < nearestDistance ? point : nearest;
  });
}

function gradeFor(probability: number): HenanCityPrediction["grade"] {
  if (probability >= 80) return "high";
  if (probability >= 65) return "mediumHigh";
  if (probability >= 50) return "medium";
  if (probability >= 35) return "low";
  return "veryLow";
}

function scoreToProbability(score: number): number {
  if (score < 35) return score * 0.8;
  if (score < 50) return 28 + (score - 35) * 1.1;
  if (score < 65) return 45 + (score - 50) * 1.25;
  if (score < 80) return 64 + (score - 65) * 1.2;
  return 82 + (score - 80) * 0.9;
}

function piecewiseScore(value: number, points: Array<[number, number]>): number {
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  if (value <= sorted[0][0]) return sorted[0][1];
  for (let index = 1; index < sorted.length; index += 1) {
    const [x1, y1] = sorted[index - 1];
    const [x2, y2] = sorted[index];
    if (value <= x2) {
      const progress = (value - x1) / (x2 - x1);
      return y1 + (y2 - y1) * progress;
    }
  }
  return sorted[sorted.length - 1][1];
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
