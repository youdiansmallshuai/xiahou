import type { Coordinates } from "./types";

export function getSolarAzimuthDeg(date: Date, location: Coordinates): number {
  const dayOfYear = getDayOfYear(date);
  const fractionalHour =
    date.getHours() +
    date.getMinutes() / 60 +
    date.getSeconds() / 3600 +
    date.getMilliseconds() / 3600000;
  const gamma =
    (2 * Math.PI) / 365 *
    (dayOfYear - 1 + (fractionalHour - 12) / 24);

  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const timezoneOffsetMinutes = -date.getTimezoneOffset();
  const trueSolarTime =
    fractionalHour * 60 + equationOfTime + 4 * location.longitude - timezoneOffsetMinutes;
  const hourAngle = toRad(trueSolarTime / 4 - 180);
  const latitude = toRad(location.latitude);

  const azimuth = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latitude) -
      Math.tan(declination) * Math.cos(latitude)
  );

  return normalizeDegrees(toDeg(azimuth) + 180);
}

export function directionLabelFromAzimuth(azimuthDeg: number): string {
  if (azimuthDeg >= 75 && azimuthDeg <= 105) return "东方";
  if (azimuthDeg >= 45 && azimuthDeg < 75) return "东北偏东";
  if (azimuthDeg > 105 && azimuthDeg <= 135) return "东南偏东";
  if (azimuthDeg >= 255 && azimuthDeg <= 285) return "西方";
  if (azimuthDeg >= 225 && azimuthDeg < 255) return "西南偏西";
  if (azimuthDeg > 285 && azimuthDeg <= 315) return "西北偏西";
  if (azimuthDeg > 135 && azimuthDeg < 225) return "南方";
  return "北方";
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function toDeg(value: number): number {
  return (value * 180) / Math.PI;
}
