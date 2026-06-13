import type { HenanGeoJsonMap, GeoJsonFeatureCollection } from "../model/types";
import cities from "../data/henanCitiesGeo.json";
import province from "../data/henanProvince.json";

export async function fetchHenanGeoJsonMap(): Promise<HenanGeoJsonMap> {
  return {
    province: province as unknown as GeoJsonFeatureCollection,
    cities: cities as unknown as GeoJsonFeatureCollection,
    fetchedAt: new Date().toISOString()
  };
}
