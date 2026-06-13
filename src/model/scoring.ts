import { directionLabelFromAzimuth, getSolarAzimuthDeg } from "./solar";
import type {
  AirQualityPoint,
  FactorScore,
  ForecastPoint,
  ObservationAdjustment,
  ObservationSignal,
  PredictionSelection,
  SolarEventType,
  SunsetPrediction,
  WeatherBundle
} from "./types";

export const OBSERVATION_ADJUSTMENTS: ObservationAdjustment[] = [
  { signal: "westernGap", label: "西方地平线有清晰云缝", delta: 12, active: false },
  { signal: "brightCloudEdge", label: "西方云边已经发亮", delta: 9, active: false },
  { signal: "yellowCloudBase", label: "云底开始泛黄", delta: 8, active: false },
  { signal: "lowCloudWall", label: "西边低云灰墙压死", delta: -15, active: false },
  { signal: "milkyHighCloud", label: "整片乳白高云幕", delta: -6, active: false }
];

const ONE_MINUTE = 60000;
const DEFAULT_SELECTION: PredictionSelection = {
  eventType: "sunset",
  day: "today"
};

interface EventMeta {
  label: string;
  glowLabel: string;
  lightPathLabel: string;
  lightPathShort: string;
  sideShort: string;
  lowWindow: [number, number];
  canvasWindow: [number, number];
  centerWindow: [number, number];
  observationWindow: [number, number, number, number];
  timingPoints: Array<[number, number]>;
}

export function computeSunsetPrediction(
  bundle: WeatherBundle,
  now = new Date(),
  activeSignals: ObservationSignal[] = [],
  selection: PredictionSelection = DEFAULT_SELECTION
): SunsetPrediction {
  const centerForecast = bundle.forecasts[0];
  const eventTime = pickSelectedEventTime(centerForecast, now, selection);
  const targetDate = eventTime.slice(0, 10);
  const eventDate = new Date(eventTime);
  const regionCenter = centerForecast.location;
  const eventAzimuthDeg = getSolarAzimuthDeg(eventDate, regionCenter);
  const eventMeta = eventMetaFor(selection.eventType);

  const lowCloudWindow = collectWindow(bundle, eventTime, eventMeta.lowWindow[0], eventMeta.lowWindow[1]);
  const canvasWindow = collectWindow(bundle, eventTime, eventMeta.canvasWindow[0], eventMeta.canvasWindow[1]);
  const centerWindow = collectCenterWindow(centerForecast.hourly, eventTime, eventMeta.centerWindow[0], eventMeta.centerWindow[1]);
  const airQuality = nearestAirQuality(bundle.airQuality, eventTime);

  const lowStats = weightedCloudStats(lowCloudWindow, "cloudCoverLow");
  const midStats = weightedCloudStats(canvasWindow, "cloudCoverMid");
  const highStats = weightedCloudStats(canvasWindow, "cloudCoverHigh");
  const visibilityStats = weightedNumericStats(lowCloudWindow, "visibilityM");
  const precipitationStats = weightedNumericStats(lowCloudWindow, "precipitationMm");
  const precipitationProbabilityStats = weightedNumericStats(
    lowCloudWindow,
    "precipitationProbability"
  );
  const westernLowCloud = westWeightedMean(lowCloudWindow, "cloudCoverLow");
  const westernPrecipitation = westWeightedMean(lowCloudWindow, "precipitationMm");
  const wind = meanWind(centerWindow);

  const lightPathScore = scoreLightPath(lowStats.mean, westernLowCloud, eventMeta);
  const canvasScore = scoreCanvas(midStats.mean, highStats.mean);
  const visibilityScore = scoreVisibility(
    visibilityStats.mean / 1000,
    precipitationStats.mean,
    precipitationProbabilityStats.mean,
    centerWindow,
    eventMeta
  );
  const aerosolScore = scoreAerosol(
    airQuality,
    visibilityStats.mean / 1000,
    lowStats.mean
  );
  const windScore = scoreWind(
    wind,
    eventAzimuthDeg,
    westernLowCloud,
    westernPrecipitation,
    airQuality,
    eventMeta
  );
  const timingScore = scoreTiming(now, eventTime, eventMeta);
  const selectedSignals = OBSERVATION_ADJUSTMENTS.map((adjustment) => ({
    ...adjustmentForEvent(adjustment, selection.eventType),
    active: activeSignals.includes(adjustment.signal)
  }));
  const manualAdjustment = clamp(
    selectedSignals
      .filter((adjustment) => adjustment.active)
      .reduce((sum, adjustment) => sum + adjustment.delta, 0),
    -15,
    15
  );

  const factorScores = [
    lightPathScore,
    canvasScore,
    visibilityScore,
    aerosolScore,
    windScore,
    timingScore
  ];

  let rawScore =
    factorScores.reduce((sum, factor) => sum + factor.score, 0) + manualAdjustment;
  let cap: { value: number; reason: string } | undefined;

  cap = minCap(cap, lowStats.mean > 75, 55, "低云超过 75%，太阳低角度光路很难打通");
  cap = minCap(
    cap,
    precipitationStats.max > 0.3 || precipitationProbabilityStats.max >= 70,
    50,
    `${eventMeta.label}窗口有明显降水或高降水概率`
  );
  cap = minCap(
    cap,
    visibilityStats.mean / 1000 < 5,
    45,
    "能见度低于 5km，颜色和层次容易被雾霾吃掉"
  );

  const totalScore = Math.round(clamp(cap ? Math.min(rawScore, cap.value) : rawScore, 0, 100));
  const probability = Math.round(scoreToProbability(totalScore));
  const fireCloudProbability = Math.round(
    clamp(
      probability +
        fireCloudAdjustment(highStats.mean, midStats.mean, lowStats.mean, visibilityStats.mean / 1000),
      0,
      highStats.mean > 90 ? 58 : 100
    )
  );

  const majorBoosts = factorScores
    .filter((factor) => factor.status === "good")
    .map((factor) => factor.summary)
    .slice(0, 4);
  const majorRisks = [
    ...factorScores.filter((factor) => factor.status === "risk").map((factor) => factor.summary),
    ...selectedSignals.filter((signal) => signal.active && signal.delta < 0).map((signal) => signal.label)
  ].slice(0, 4);

  return {
    targetDate,
    eventType: selection.eventType,
    eventLabel: eventMeta.label,
    eventTime,
    sunsetTime: eventTime,
    observationWindow: {
      start: addMinutes(eventTime, eventMeta.observationWindow[0]),
      peakStart: addMinutes(eventTime, eventMeta.observationWindow[1]),
      peakEnd: addMinutes(eventTime, eventMeta.observationWindow[2]),
      end: addMinutes(eventTime, eventMeta.observationWindow[3])
    },
    directionLabel: directionLabelFromAzimuth(eventAzimuthDeg),
    eventAzimuthDeg,
    sunsetAzimuthDeg: eventAzimuthDeg,
    totalScore,
    probability,
    fireCloudProbability,
    factorScores,
    majorBoosts,
    majorRisks,
    strategy: buildStrategy(probability, eventTime, majorRisks, eventMeta),
    dataFreshness: bundle.fetchedAt,
    appliedCap: cap?.reason,
    manualAdjustment,
    selectedSignals,
    diagnostics: {
      weightedLowCloud: round1(lowStats.mean),
      weightedMidCloud: round1(midStats.mean),
      weightedHighCloud: round1(highStats.mean),
      weightedVisibilityKm: round1(visibilityStats.mean / 1000),
      weightedPrecipitationMm: round2(precipitationStats.mean),
      weightedPrecipitationProbability: round1(precipitationProbabilityStats.mean),
      westernLowCloud: round1(westernLowCloud),
      westernPrecipitationMm: round2(westernPrecipitation),
      pm25: round1(airQuality.pm25),
      aod: round2(airQuality.aerosolOpticalDepth),
      dust: round1(airQuality.dust),
      windSpeedKmh: round1(wind.speedKmh),
      windDirectionDeg: Math.round(wind.directionDeg),
      windGustsKmh: round1(wind.gustsKmh)
    }
  };
}

function scoreLightPath(
  lowCloud: number,
  directionalLowCloud: number,
  eventMeta: EventMeta
): FactorScore {
  const base = piecewiseScore(lowCloud, [
    [0, 25],
    [20, 25],
    [50, 12],
    [75, 4],
    [100, 0]
  ]);
  const directionalPenalty = directionalLowCloud > lowCloud + 18 ? 3 : 0;
  const score = clamp(base - directionalPenalty, 0, 25);
  const status = statusFor(score, 25, 0.76, 0.46);

  return {
    key: "lightPath",
    label: `${eventMeta.lightPathShort} / 低云`,
    score,
    max: 25,
    status,
    summary:
      status === "good"
        ? `低云约 ${round1(lowCloud)}%，光路干净`
        : status === "watch"
          ? `低云约 ${round1(lowCloud)}%，需要看${eventMeta.sideShort}云缝`
          : `低云约 ${round1(lowCloud)}%，低角度光路受阻`,
    details: [
      `郑州与${eventMeta.lightPathShort}走廊加权低云 ${round1(lowCloud)}%`,
      `${eventMeta.lightPathShort}走廊低云 ${round1(directionalLowCloud)}%`
    ]
  };
}

function scoreCanvas(midCloud: number, highCloud: number): FactorScore {
  const highScore = piecewiseScore(highCloud, [
    [0, 0],
    [10, 4],
    [25, 14],
    [75, 15],
    [90, 9],
    [100, 2]
  ]);
  const midScore = piecewiseScore(midCloud, [
    [0, 2],
    [10, 8],
    [50, 10],
    [70, 6],
    [100, 1]
  ]);
  const score = clamp(highScore + midScore, 0, 25);
  const status = statusFor(score, 25, 0.76, 0.46);

  return {
    key: "canvas",
    label: "中高云画布",
    score,
    max: 25,
    status,
    summary:
      status === "good"
        ? `高云 ${round1(highCloud)}%、中云 ${round1(midCloud)}%，画布合适`
        : highCloud < 10
          ? "高云太少，缺少被染色的画布"
          : highCloud > 90
            ? "高云接近铺满，可能偏粉灰云幕"
            : `中高云条件一般，高云 ${round1(highCloud)}%`,
    details: [`高云 ${round1(highCloud)}%`, `中云 ${round1(midCloud)}%`]
  };
}

function scoreVisibility(
  visibilityKm: number,
  precipitationMm: number,
  precipitationProbability: number,
  centerWindow: ForecastPoint[],
  eventMeta: EventMeta
): FactorScore {
  const visibilityScore = piecewiseScore(visibilityKm, [
    [0, 0],
    [5, 3],
    [8, 8],
    [12, 12],
    [20, 12]
  ]);
  const precipitationPenalty = clamp(precipitationMm * 18, 0, 7);
  const probabilityPenalty = piecewiseScore(precipitationProbability, [
    [0, 0],
    [20, 0],
    [50, 4],
    [80, 7],
    [100, 8]
  ]);
  const weatherPenalty = centerWindow.some((point) => isWetWeatherCode(point.weatherCode)) ? 2 : 0;
  const score = clamp(visibilityScore + 8 - precipitationPenalty - probabilityPenalty - weatherPenalty, 0, 20);
  const status = statusFor(score, 20, 0.76, 0.46);

  return {
    key: "visibility",
    label: "降水 / 能见度",
    score,
    max: 20,
    status,
    summary:
      status === "good"
        ? `能见度 ${round1(visibilityKm)}km，降水风险低`
        : precipitationMm > 0.1 || precipitationProbability > 50
          ? `${eventMeta.glowLabel}窗口有降水风险`
          : `能见度 ${round1(visibilityKm)}km，通透度一般`,
    details: [
      `平均能见度 ${round1(visibilityKm)}km`,
      `平均降水 ${round2(precipitationMm)}mm`,
      `平均降水概率 ${round1(precipitationProbability)}%`
    ]
  };
}

function scoreAerosol(
  airQuality: AirQualityPoint,
  visibilityKm: number,
  lowCloud: number
): FactorScore {
  const aodScore = piecewiseScore(airQuality.aerosolOpticalDepth, [
    [0, 4],
    [0.15, 7],
    [0.45, 7],
    [0.8, 2],
    [1.2, 0]
  ]);
  const pmScore = piecewiseScore(airQuality.pm25, [
    [0, 4],
    [15, 6],
    [45, 6],
    [75, 2],
    [120, 0]
  ]);
  const dustBonus =
    airQuality.dust > 20 && visibilityKm >= 10 && lowCloud < 40 ? 1 : airQuality.dust > 60 ? -1 : 0;
  const score = clamp((aodScore + pmScore) / 2 + dustBonus, 0, 10);
  const status = statusFor(score, 10, 0.74, 0.46);

  return {
    key: "aerosol",
    label: "气溶胶散射",
    score,
    max: 10,
    status,
    summary:
      status === "good"
        ? `AOD ${round2(airQuality.aerosolOpticalDepth)}、PM2.5 ${round1(airQuality.pm25)}，散射友好`
        : airQuality.pm25 > 75 || airQuality.aerosolOpticalDepth > 0.8
          ? "气溶胶偏重，可能变灰霾"
          : "气溶胶条件普通，颜色可能不够浓",
    details: [
      `AOD ${round2(airQuality.aerosolOpticalDepth)}`,
      `PM2.5 ${round1(airQuality.pm25)} μg/m³`,
      `dust ${round1(airQuality.dust)} μg/m³`
    ]
  };
}

function scoreWind(
  wind: { speedKmh: number; directionDeg: number; gustsKmh: number },
  eventAzimuthDeg: number,
  directionalLowCloud: number,
  directionalPrecipitation: number,
  airQuality: AirQualityPoint,
  eventMeta: EventMeta
): FactorScore {
  const fromEventDirection = angularDistance(wind.directionDeg, eventAzimuthDeg) <= 45;
  let score = 6;

  if (fromEventDirection && wind.speedKmh >= 4 && wind.speedKmh <= 25) {
    score += directionalLowCloud < 35 && directionalPrecipitation < 0.1 ? 3 : -3;
  }
  if (wind.gustsKmh > 40) score -= 2;
  if (wind.speedKmh < 4 && (airQuality.pm25 > 45 || airQuality.aerosolOpticalDepth > 0.45)) {
    score -= 2;
  }
  if (wind.speedKmh > 30) score -= 1;

  score = clamp(score, 0, 10);
  const status = statusFor(score, 10, 0.74, 0.46);

  return {
    key: "wind",
    label: "风向趋势",
    score,
    max: 10,
    status,
    summary:
      status === "good"
        ? `风向有利，${eventMeta.sideShort}云况会更快反馈到郑州`
        : status === "risk"
          ? "风向或阵风增加不确定性"
          : "风向影响中性",
    details: [
      `风向 ${Math.round(wind.directionDeg)}°，太阳方位 ${Math.round(eventAzimuthDeg)}°`,
      `风速 ${round1(wind.speedKmh)}km/h，阵风 ${round1(wind.gustsKmh)}km/h`
    ]
  };
}

function scoreTiming(now: Date, eventTime: string, eventMeta: EventMeta): FactorScore {
  const minutes = (now.getTime() - new Date(eventTime).getTime()) / ONE_MINUTE;
  const score = piecewiseScore(minutes, eventMeta.timingPoints);
  const status = statusFor(score, 10, 0.74, 0.46);

  return {
    key: "timing",
    label: "天文窗口 / 实况",
    score,
    max: 10,
    status,
    summary:
      minutes < eventMeta.observationWindow[0]
        ? `距离${eventMeta.label}较早，先看趋势`
        : minutes <= eventMeta.observationWindow[2]
          ? `正在进入${eventMeta.glowLabel}核心窗口`
          : "已过主窗口，收益下降",
    details: [`距离${eventMeta.label} ${Math.round(minutes)} 分钟`]
  };
}

function pickSelectedEventTime(
  sample: { dates?: string[]; sunrises?: string[]; sunsets: string[] },
  now: Date,
  selection: PredictionSelection
): string {
  const events = selection.eventType === "sunrise" ? (sample.sunrises ?? []) : sample.sunsets;
  const targetDate = formatLocalDate(addDays(now, selection.day === "tomorrow" ? 1 : 0));
  const dateIndex = sample.dates?.findIndex((date) => date === targetDate) ?? -1;
  const selected = dateIndex >= 0 ? events[dateIndex] : undefined;
  const fallback = events.filter(Boolean)[selection.day === "tomorrow" ? 1 : 0] ?? events.filter(Boolean)[0];
  return selected || fallback || sample.sunsets.filter(Boolean)[0] || new Date(now).toISOString();
}

function eventMetaFor(eventType: SolarEventType): EventMeta {
  if (eventType === "sunrise") {
    return {
      label: "日出",
      glowLabel: "朝霞",
      lightPathLabel: "东方光路",
      lightPathShort: "东方光路",
      sideShort: "东边",
      lowWindow: [-55, 20],
      canvasWindow: [-45, 15],
      centerWindow: [-60, 25],
      observationWindow: [-50, -35, 10, 20],
      timingPoints: [
        [-180, 7],
        [-70, 9],
        [-45, 10],
        [-15, 10],
        [10, 9],
        [20, 5],
        [80, 2]
      ]
    };
  }

  return {
    label: "日落",
    glowLabel: "晚霞",
    lightPathLabel: "西方光路",
    lightPathShort: "西方光路",
    sideShort: "西边",
    lowWindow: [-60, 10],
    canvasWindow: [-25, 25],
    centerWindow: [-60, 30],
    observationWindow: [-45, -15, 20, 30],
    timingPoints: [
      [-180, 8],
      [-60, 10],
      [-25, 10],
      [5, 10],
      [25, 8],
      [30, 5],
      [90, 2]
    ]
  };
}

function adjustmentForEvent(
  adjustment: ObservationAdjustment,
  eventType: SolarEventType
): ObservationAdjustment {
  if (eventType === "sunset") return adjustment;
  return {
    ...adjustment,
    label: adjustment.label
      .replaceAll("西方", "东方")
      .replaceAll("西边", "东边")
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
  bundle: WeatherBundle,
  sunsetTime: string,
  startMinutes: number,
  endMinutes: number
): Array<{ locationWeight: number; point: ForecastPoint; locationId: string }> {
  const start = new Date(new Date(sunsetTime).getTime() + startMinutes * ONE_MINUTE);
  const end = new Date(new Date(sunsetTime).getTime() + endMinutes * ONE_MINUTE);

  return bundle.forecasts.flatMap((sample) =>
    sample.hourly
      .filter((point) => {
        const time = new Date(point.time);
        return time >= start && time <= end;
      })
      .map((point) => ({
        locationWeight: sample.location.weight,
        locationId: sample.location.id,
        point
      }))
  );
}

function collectCenterWindow(
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

function weightedCloudStats(
  entries: Array<{ locationWeight: number; point: ForecastPoint }>,
  key: "cloudCoverLow" | "cloudCoverMid" | "cloudCoverHigh"
) {
  return weightedNumericStats(entries, key);
}

function weightedNumericStats(
  entries: Array<{ locationWeight: number; point: ForecastPoint }>,
  key: keyof ForecastPoint
): { mean: number; max: number; min: number } {
  if (!entries.length) return { mean: 0, max: 0, min: 0 };
  const values = entries.map((entry) => Number(entry.point[key]));
  const weightedSum = entries.reduce(
    (sum, entry) => sum + Number(entry.point[key]) * entry.locationWeight,
    0
  );
  const weight = entries.reduce((sum, entry) => sum + entry.locationWeight, 0);
  return {
    mean: weightedSum / weight,
    max: Math.max(...values),
    min: Math.min(...values)
  };
}

function westWeightedMean(
  entries: Array<{ locationWeight: number; point: ForecastPoint; locationId: string }>,
  key: "cloudCoverLow" | "precipitationMm"
): number {
  const westEntries = entries.filter((entry) => entry.locationId !== "center");
  if (!westEntries.length) return 0;
  const sum = westEntries.reduce((total, entry) => total + entry.point[key] * entry.locationWeight, 0);
  const weight = westEntries.reduce((total, entry) => total + entry.locationWeight, 0);
  return sum / weight;
}

function meanWind(points: ForecastPoint[]): { speedKmh: number; directionDeg: number; gustsKmh: number } {
  if (!points.length) return { speedKmh: 0, directionDeg: 0, gustsKmh: 0 };
  const speedKmh = mean(points.map((point) => point.windSpeedKmh));
  const gustsKmh = Math.max(...points.map((point) => point.windGustsKmh));
  const vectors = points.map((point) => {
    const radians = (point.windDirectionDeg * Math.PI) / 180;
    return {
      x: Math.sin(radians),
      y: Math.cos(radians)
    };
  });
  const x = mean(vectors.map((vector) => vector.x));
  const y = mean(vectors.map((vector) => vector.y));
  const directionDeg = ((Math.atan2(x, y) * 180) / Math.PI + 360) % 360;
  return { speedKmh, directionDeg, gustsKmh };
}

function buildStrategy(
  probability: number,
  eventTime: string,
  risks: string[],
  eventMeta: EventMeta
): string {
  const peakStart = formatClock(addMinutes(eventTime, eventMeta.observationWindow[1]));
  const peakEnd = formatClock(addMinutes(eventTime, eventMeta.observationWindow[2]));

  if (probability >= 80) {
    return `${peakStart} 前到位，主盯${eventMeta.sideShort}低空云缝，${peakEnd} 后再决定撤。`;
  }
  if (probability >= 65) {
    return `${peakStart} 左右出门观察，若${eventMeta.sideShort}云边发亮就继续等到 ${peakEnd}。`;
  }
  if (probability >= 50) {
    return `${peakStart} 快速看一眼${eventMeta.sideShort}，只有出现清晰云缝或云底泛黄才继续蹲。`;
  }
  return risks.length
    ? `不建议专门等，除非临场看到${eventMeta.sideShort}突然开口；主要风险是${risks[0]}。`
    : `不建议专门等，临场有明显${eventMeta.sideShort}云缝再追加观察。`;
}

function scoreToProbability(score: number): number {
  if (score < 35) return score * 0.8;
  if (score < 50) return 28 + (score - 35) * 1.1;
  if (score < 65) return 45 + (score - 50) * 1.25;
  if (score < 80) return 64 + (score - 65) * 1.2;
  return 82 + (score - 80) * 0.9;
}

function fireCloudAdjustment(
  highCloud: number,
  midCloud: number,
  lowCloud: number,
  visibilityKm: number
): number {
  let adjustment = 0;
  if (highCloud >= 25 && highCloud <= 75) adjustment += 8;
  if (midCloud >= 10 && midCloud <= 50) adjustment += 4;
  if (lowCloud > 50) adjustment -= 14;
  if (highCloud < 10) adjustment -= 18;
  if (highCloud > 90) adjustment -= 16;
  if (visibilityKm < 8) adjustment -= 12;
  return adjustment;
}

function minCap(
  current: { value: number; reason: string } | undefined,
  condition: boolean,
  value: number,
  reason: string
) {
  if (!condition) return current;
  if (!current || value < current.value) return { value, reason };
  return current;
}

function addMinutes(time: string, minutes: number): string {
  return new Date(new Date(time).getTime() + minutes * ONE_MINUTE).toISOString();
}

function formatClock(time: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(time));
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

function statusFor(
  score: number,
  max: number,
  goodRatio: number,
  watchRatio: number
): FactorScore["status"] {
  const ratio = score / max;
  if (ratio >= goodRatio) return "good";
  if (ratio >= watchRatio) return "watch";
  return "risk";
}

function isWetWeatherCode(code: number): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 71 && code <= 77) ||
    (code >= 80 && code <= 82) ||
    (code >= 85 && code <= 86) ||
    (code >= 95 && code <= 99)
  );
}

function angularDistance(a: number, b: number): number {
  const difference = Math.abs(((a - b + 540) % 360) - 180);
  return difference;
}

function mean(values: number[]): number {
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
