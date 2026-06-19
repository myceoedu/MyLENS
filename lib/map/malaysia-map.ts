import type { Feature, FeatureCollection, Geometry } from "geojson";

export interface MalaysiaGeoProperties {
  state: string;
  code_state: number;
}

/** Map DOSM GeoJSON state names → our app state IDs */
export const geoNameToStateId: Record<string, string> = {
  Johor: "johor",
  Kedah: "kedah",
  Kelantan: "kelantan",
  Melaka: "melaka",
  "Negeri Sembilan": "negerisembilan",
  Pahang: "pahang",
  Perak: "perak",
  Perlis: "perlis",
  "Pulau Pinang": "penang",
  Sabah: "sabah",
  Sarawak: "sarawak",
  Selangor: "selangor",
  Terengganu: "terengganu",
  "W.P. Kuala Lumpur": "kualalumpur",
  "W.P. Labuan": "labuan",
  "W.P. Putrajaya": "putrajaya",
};

export function getStateIdFromFeature(
  feature: Feature<Geometry, MalaysiaGeoProperties>
): string | null {
  const name = feature.properties?.state;
  if (!name) return null;
  return geoNameToStateId[name] ?? null;
}

export type MalaysiaFeatureCollection = FeatureCollection<
  Geometry,
  MalaysiaGeoProperties
>;
