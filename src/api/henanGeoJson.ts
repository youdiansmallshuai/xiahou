import type { HenanGeoJsonMap, GeoJsonFeatureCollection } from "../model/types";
import { DEFAULT_REGION_ID, getRegionOption, normalizeRegionId } from "../model/regions";

export async function fetchHenanGeoJsonMap(): Promise<HenanGeoJsonMap> {
  return fetchRegionGeoJsonMap("410000");
}

export async function fetchRegionGeoJsonMap(regionId = DEFAULT_REGION_ID): Promise<HenanGeoJsonMap> {
  const normalizedRegionId = normalizeRegionId(regionId);
  const region = getRegionOption(normalizedRegionId);
  const china = await fetchGeoJson("/data/china-provinces.json");

  if (normalizedRegionId === DEFAULT_REGION_ID) {
    return {
      region,
      province: china,
      cities: china,
      fetchedAt: new Date().toISOString()
    };
  }

  const provinceFeature = china.features.find((feature) => String(feature.properties.adcode) === region.adcode);
  const province = provinceFeature
    ? featureCollection([provinceFeature])
    : await fetchGeoJson(`/data/provinces/${region.adcode}.json`);
  const cities = await fetchGeoJson(`/data/provinces/${region.adcode}.json`);

  return {
    region,
    province,
    cities,
    fetchedAt: new Date().toISOString()
  };
}

async function fetchGeoJson(path: string): Promise<GeoJsonFeatureCollection> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`地图数据请求失败：${response.status}`);
  }
  return response.json() as Promise<GeoJsonFeatureCollection>;
}

function featureCollection(features: GeoJsonFeatureCollection["features"]): GeoJsonFeatureCollection {
  return {
    type: "FeatureCollection",
    features
  };
}
