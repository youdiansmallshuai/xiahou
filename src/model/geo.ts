import type { Coordinates, CorridorPoint } from "./types";

const EARTH_RADIUS_KM = 6371.0088;

export const ZHENGZHOU: Coordinates = {
  latitude: 34.7466,
  longitude: 113.6254
};

export function destinationPoint(
  origin: Coordinates,
  bearingDeg: number,
  distanceKm: number
): Coordinates {
  const bearing = toRad(bearingDeg);
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const lat1 = toRad(origin.latitude);
  const lon1 = toRad(origin.longitude);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    latitude: toDeg(lat2),
    longitude: normalizeLongitude(toDeg(lon2))
  };
}

export function buildLightCorridor(
  center: Coordinates,
  azimuthDeg: number,
  lightPathLabel = "西方光路"
): CorridorPoint[] {
  const near = destinationPoint(center, azimuthDeg, 60);
  const far = destinationPoint(center, azimuthDeg, 120);

  return [
    {
      id: "center",
      label: "郑州城区",
      distanceKm: 0,
      weight: 0.55,
      ...center
    },
    {
      id: "nearWest",
      label: `${lightPathLabel} 60km`,
      distanceKm: 60,
      weight: 0.3,
      ...near
    },
    {
      id: "farWest",
      label: `${lightPathLabel} 120km`,
      distanceKm: 120,
      weight: 0.15,
      ...far
    }
  ];
}

export function buildSunsetCorridor(
  center: Coordinates,
  sunsetAzimuthDeg: number
): CorridorPoint[] {
  return buildLightCorridor(center, sunsetAzimuthDeg, "西方光路");
}

function normalizeLongitude(longitude: number): number {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function toDeg(value: number): number {
  return (value * 180) / Math.PI;
}
