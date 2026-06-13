import type { CloudGridPoint, CloudMap, ForecastPoint, RegionBounds, SolarEventType } from "./types";

const ONE_MINUTE = 60000;

export const HENAN_MAP_BOUNDS = {
  minLatitude: 31.3,
  maxLatitude: 36.35,
  minLongitude: 110.3,
  maxLongitude: 116.8
};

export interface CloudGridForecastSample {
  point: CloudGridPoint;
  hourly: ForecastPoint[];
}

export function buildHenanCloudGrid(rows = 7, columns = 9): CloudGridPoint[] {
  return buildRegionCloudGrid(HENAN_MAP_BOUNDS, rows, columns);
}

export function buildRegionCloudGrid(
  bounds: RegionBounds,
  rows = 7,
  columns = 9
): CloudGridPoint[] {
  const points: CloudGridPoint[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const latitude =
        bounds.maxLatitude -
        (row / (rows - 1)) * (bounds.maxLatitude - bounds.minLatitude);
      const longitude =
        bounds.minLongitude +
        (column / (columns - 1)) * (bounds.maxLongitude - bounds.minLongitude);
      points.push({
        id: `grid-${row}-${column}`,
        row,
        column,
        latitude,
        longitude
      });
    }
  }
  return points;
}

export function computeCloudMap(
  samples: CloudGridForecastSample[],
  targetTime: string,
  rows: number,
  columns: number,
  eventType: SolarEventType = "sunset",
  bounds: RegionBounds = HENAN_MAP_BOUNDS
): CloudMap {
  const canvasRange: [number, number] = eventType === "sunrise" ? [-45, 15] : [-25, 25];
  const blockerRange: [number, number] = eventType === "sunrise" ? [-55, 20] : [-45, 15];
  const cells = samples.map((sample) => {
    const window = collectWindow(sample.hourly, targetTime, canvasRange[0], canvasRange[1]);
    const blockerWindow = collectWindow(sample.hourly, targetTime, blockerRange[0], blockerRange[1]);
    const cloudCoverLow = mean(blockerWindow.map((point) => point.cloudCoverLow));
    const cloudCoverMid = mean(window.map((point) => point.cloudCoverMid));
    const cloudCoverHigh = mean(window.map((point) => point.cloudCoverHigh));
    const visibilityKm = mean(blockerWindow.map((point) => point.visibilityM)) / 1000;
    const precipitationProbability = mean(blockerWindow.map((point) => point.precipitationProbability));
    const precipitationMm = mean(blockerWindow.map((point) => point.precipitationMm));
    const canvas = canvasScore(cloudCoverMid, cloudCoverHigh);
    const lightPath = lowCloudScore(cloudCoverLow);
    const transparency = visibilityScore(visibilityKm);
    const rainPenalty = clamp(precipitationProbability * 0.45 + precipitationMm * 24, 0, 45);
    const firePotential = clamp(canvas * 0.38 + lightPath * 0.34 + transparency * 0.28 - rainPenalty, 0, 100);
    const blocker = clamp(cloudCoverLow * 0.72 + precipitationProbability * 0.28, 0, 100);

    return {
      ...sample.point,
      cloudCoverLow: round1(cloudCoverLow),
      cloudCoverMid: round1(cloudCoverMid),
      cloudCoverHigh: round1(cloudCoverHigh),
      visibilityKm: round1(visibilityKm),
      precipitationProbability: round1(precipitationProbability),
      firePotential: round1(firePotential),
      blocker: round1(blocker)
    };
  });

  return {
    targetTime,
    rows,
    columns,
    cells,
    summary: summarizeCloudMap(cells.map((cell) => cell.firePotential), eventType),
    bounds
  };
}

function summarizeCloudMap(values: number[], eventType: SolarEventType): string {
  const average = mean(values);
  const strongCells = values.filter((value) => value >= 65).length;
  const glowLabel = eventType === "sunrise" ? "朝霞" : "晚霞";
  if (average >= 68) return `云图显示全省${glowLabel}潜力偏强，大片区域具备染色条件。`;
  if (strongCells >= 10) return "云图显示局地火烧云机会明显，重点看暖色高值区。";
  if (average >= 45) return "云图显示全省条件一般，机会集中在少数云缝区域。";
  return "云图显示整体偏弱，低云、降水或缺少画布限制较多。";
}

function collectWindow(
  hourly: ForecastPoint[],
  targetTime: string,
  startMinutes: number,
  endMinutes: number
): ForecastPoint[] {
  const start = new Date(new Date(targetTime).getTime() + startMinutes * ONE_MINUTE);
  const end = new Date(new Date(targetTime).getTime() + endMinutes * ONE_MINUTE);
  return hourly.filter((point) => {
    const time = new Date(point.time);
    return time >= start && time <= end;
  });
}

function lowCloudScore(value: number): number {
  return piecewiseScore(value, [
    [0, 100],
    [20, 100],
    [50, 48],
    [80, 12],
    [100, 0]
  ]);
}

function canvasScore(midCloud: number, highCloud: number): number {
  const high = piecewiseScore(highCloud, [
    [0, 0],
    [10, 20],
    [25, 90],
    [75, 100],
    [90, 55],
    [100, 18]
  ]);
  const mid = piecewiseScore(midCloud, [
    [0, 20],
    [10, 70],
    [50, 100],
    [70, 58],
    [100, 15]
  ]);
  return high * 0.68 + mid * 0.32;
}

function visibilityScore(value: number): number {
  return piecewiseScore(value, [
    [0, 0],
    [5, 20],
    [8, 58],
    [12, 88],
    [20, 100]
  ]);
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
