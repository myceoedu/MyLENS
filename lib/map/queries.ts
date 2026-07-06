import { states } from "@/lib/data/states";
import { createClient } from "@/lib/supabase/server";
import type { ParticipatingSchool, PublicMapData } from "@/lib/map/types";

export async function fetchPublicMapData(): Promise<PublicMapData> {
  const supabase = await createClient();

  const { data: schoolRows, error: schoolsError } = await supabase.rpc(
    "get_public_participating_schools",
    { p_state_id: null }
  );

  if (schoolsError) {
    console.error("Failed to load participating schools:", schoolsError);
    return { schoolsByState: {} };
  }

  const schoolsByState: Record<string, ParticipatingSchool[]> = {};

  for (const row of schoolRows ?? []) {
    const entry: ParticipatingSchool = {
      id: row.id,
      name: row.name,
      points: row.points,
      videoCount: Number(row.video_count),
      creatorCount: Number(row.creator_count),
    };

    if (!schoolsByState[row.state_id]) {
      schoolsByState[row.state_id] = [];
    }
    schoolsByState[row.state_id].push(entry);
  }

  return { schoolsByState };
}

export { states };
