import type {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonMultiPolygon,
  GeoJsonPolygon,
  GeoJsonPosition
} from "./types";

export interface GeoBounds {
  minLongitude: number;
  maxLongitude: number;
  minLatitude: number;
  maxLatitude: number;
}

export interface SvgViewport {
  width: number;
  height: number;
  padding: number;
}

export function geoJsonBounds(collection: GeoJsonFeatureCollection): GeoBounds {
  const positions = collection.features.flatMap((feature) => featurePositions(feature));
  return positions.reduce(
    (bounds, [longitude, latitude]) => ({
      minLongitude: Math.min(bounds.minLongitude, longitude),
      maxLongitude: Math.max(bounds.maxLongitude, longitude),
      minLatitude: Math.min(bounds.minLatitude, latitude),
      maxLatitude: Math.max(bounds.maxLatitude, latitude)
    }),
    {
      minLongitude: Number.POSITIVE_INFINITY,
      maxLongitude: Number.NEGATIVE_INFINITY,
      minLatitude: Number.POSITIVE_INFINITY,
      maxLatitude: Number.NEGATIVE_INFINITY
    }
  );
}

export function featurePath(
  feature: GeoJsonFeature,
  bounds: GeoBounds,
  viewport: SvgViewport
): string {
  const polygons = normalizePolygons(feature.geometry.coordinates);
  return polygons
    .map((polygon) =>
      polygon
        .map((ring) => {
          const commands = ring.map(([longitude, latitude], index) => {
            const point = projectGeo(longitude, latitude, bounds, viewport);
            return `${index === 0 ? "M" : "L"}${round(point.x)} ${round(point.y)}`;
          });
          return `${commands.join(" ")} Z`;
        })
        .join(" ")
    )
    .join(" ");
}

export function collectionPath(
  collection: GeoJsonFeatureCollection,
  bounds: GeoBounds,
  viewport: SvgViewport
): string {
  return collection.features
    .map((feature) => featurePath(feature, bounds, viewport))
    .join(" ");
}

export function projectGeo(
  longitude: number,
  latitude: number,
  bounds: GeoBounds,
  viewport: SvgViewport
): { x: number; y: number } {
  const width = viewport.width - viewport.padding * 2;
  const height = viewport.height - viewport.padding * 2;
  const longitudeRange = bounds.maxLongitude - bounds.minLongitude || 1;
  const latitudeRange = bounds.maxLatitude - bounds.minLatitude || 1;
  const scale = Math.min(width / longitudeRange, height / latitudeRange);
  const mapWidth = longitudeRange * scale;
  const mapHeight = latitudeRange * scale;
  const offsetX = viewport.padding + (width - mapWidth) / 2;
  const offsetY = viewport.padding + (height - mapHeight) / 2;

  return {
    x: offsetX + (longitude - bounds.minLongitude) * scale,
    y: offsetY + (bounds.maxLatitude - latitude) * scale
  };
}

function featurePositions(feature: GeoJsonFeature): GeoJsonPosition[] {
  return normalizePolygons(feature.geometry.coordinates).flatMap((polygon) => polygon.flat());
}

function normalizePolygons(
  coordinates: GeoJsonPolygon | GeoJsonMultiPolygon
): GeoJsonMultiPolygon {
  const first = coordinates[0][0][0];
  if (typeof first === "number") return [coordinates as GeoJsonPolygon];
  if (Array.isArray(first)) return coordinates as GeoJsonMultiPolygon;
  return [];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
