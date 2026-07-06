import { fetchPublicMapData, states } from "@/lib/map/queries";
import MalaysiaMapSectionClient from "@/components/sections/MalaysiaMapSectionClient";

export default async function MalaysiaMapSection() {
  const mapData = await fetchPublicMapData();
  return <MalaysiaMapSectionClient states={states} mapData={mapData} />;
}
