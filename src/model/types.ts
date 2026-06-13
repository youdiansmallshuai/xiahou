export type FactorKey =
  | "lightPath"
  | "canvas"
  | "visibility"
  | "aerosol"
  | "wind"
  | "timing";

export type ObservationSignal =
  | "westernGap"
  | "brightCloudEdge"
  | "yellowCloudBase"
  | "lowCloudWall"
  | "milkyHighCloud";

export type SolarEventType = "sunrise" | "sunset";
export type ForecastDay = "today" | "tomorrow";

export interface PredictionSelection {
  eventType: SolarEventType;
  day: ForecastDay;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HenanCity extends Coordinates {
  id: string;
  name: string;
  shortName: string;
  labelDx?: number;
  labelDy?: number;
}

export interface CorridorPoint extends Coordinates {
  id: "center" | "nearWest" | "farWest";
  label: string;
  distanceKm: number;
  weight: number;
}

export interface ForecastPoint {
  time: string;
  cloudCover: number;
  cloudCoverLow: number;
  cloudCoverMid: number;
  cloudCoverHigh: number;
  visibilityM: number;
  precipitationMm: number;
  precipitationProbability: number;
  rainMm: number;
  showersMm: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windGustsKmh: number;
  weatherCode: number;
  pressureMsl: number;
}

export interface ForecastSample {
  location: CorridorPoint;
  hourly: ForecastPoint[];
  dates: string[];
  sunrises: string[];
  sunsets: string[];
}

export interface AirQualityPoint {
  time: string;
  pm10: number;
  pm25: number;
  aerosolOpticalDepth: number;
  dust: number;
  usAqi: number;
}

export interface WeatherBundle {
  corridor: CorridorPoint[];
  forecasts: ForecastSample[];
  airQuality: AirQualityPoint[];
  fetchedAt: string;
}

export interface CityForecastSample {
  city: HenanCity;
  hourly: ForecastPoint[];
  dates: string[];
  sunrises: string[];
  sunsets: string[];
}

export interface CityAirQualitySample {
  cityId: string;
  hourly: AirQualityPoint[];
}

export interface HenanCityPrediction {
  city: HenanCity;
  probability: number;
  fireCloudProbability: number;
  score: number;
  grade: "high" | "mediumHigh" | "medium" | "low" | "veryLow";
  eventType: SolarEventType;
  eventTime: string;
  eventLabel: string;
  sunsetTime: string;
  reason: string;
  risk: string;
  diagnostics: {
    lowCloud: number;
    midCloud: number;
    highCloud: number;
    visibilityKm: number;
    precipitationProbability: number;
    pm25: number;
    aod: number;
  };
}

export interface HenanOverview {
  targetDate: string;
  generatedAt: string;
  averageProbability: number;
  averageFireCloudProbability: number;
  summary: string;
  bestCities: HenanCityPrediction[];
  riskCities: HenanCityPrediction[];
  cities: HenanCityPrediction[];
}

export type CloudMapLayer = "potential" | "low" | "canvas" | "precipitation";

export interface CloudGridPoint extends Coordinates {
  id: string;
  row: number;
  column: number;
}

export interface CloudMapCell extends CloudGridPoint {
  cloudCoverLow: number;
  cloudCoverMid: number;
  cloudCoverHigh: number;
  visibilityKm: number;
  precipitationProbability: number;
  firePotential: number;
  blocker: number;
}

export interface CloudMap {
  targetTime: string;
  rows: number;
  columns: number;
  cells: CloudMapCell[];
  summary: string;
  bounds: {
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
  };
}

export interface WanxiaData {
  weatherBundle: WeatherBundle;
  henanOverview: HenanOverview;
  cloudMap: CloudMap;
  selection: PredictionSelection;
  fetchedAt: string;
}

export type GeoJsonPosition = [number, number];
export type GeoJsonPolygon = GeoJsonPosition[][];
export type GeoJsonMultiPolygon = GeoJsonPolygon[];

export interface GeoJsonFeature {
  type: "Feature";
  properties: {
    name?: string;
    adcode?: number;
    center?: GeoJsonPosition;
    centroid?: GeoJsonPosition;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: GeoJsonPolygon | GeoJsonMultiPolygon;
  };
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface HenanGeoJsonMap {
  province: GeoJsonFeatureCollection;
  cities: GeoJsonFeatureCollection;
  fetchedAt: string;
}

export interface ObservationAdjustment {
  signal: ObservationSignal;
  label: string;
  delta: number;
  active: boolean;
}

export interface FactorScore {
  key: FactorKey;
  label: string;
  score: number;
  max: number;
  status: "good" | "watch" | "risk";
  summary: string;
  details: string[];
}

export interface SunsetPrediction {
  targetDate: string;
  eventType: SolarEventType;
  eventLabel: string;
  eventTime: string;
  sunsetTime: string;
  observationWindow: {
    start: string;
    peakStart: string;
    peakEnd: string;
    end: string;
  };
  directionLabel: string;
  eventAzimuthDeg: number;
  sunsetAzimuthDeg: number;
  totalScore: number;
  probability: number;
  fireCloudProbability: number;
  factorScores: FactorScore[];
  majorBoosts: string[];
  majorRisks: string[];
  strategy: string;
  dataFreshness: string;
  appliedCap?: string;
  manualAdjustment: number;
  selectedSignals: ObservationAdjustment[];
  diagnostics: {
    weightedLowCloud: number;
    weightedMidCloud: number;
    weightedHighCloud: number;
    weightedVisibilityKm: number;
    weightedPrecipitationMm: number;
    weightedPrecipitationProbability: number;
    westernLowCloud: number;
    westernPrecipitationMm: number;
    pm25: number;
    aod: number;
    dust: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    windGustsKmh: number;
  };
}
