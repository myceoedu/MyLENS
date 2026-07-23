import { unstable_cache } from "next/cache";
import { states } from "@/lib/data/states";
import { createAnonymousClient } from "@/lib/supabase/server";
import type { ParticipatingSchool, PublicMapData } from "@/lib/map/types";

async function loadPublicMapData(): Promise<PublicMapData> {
  const supabase = createAnonymousClient();

  const { data: schoolRows, error: schoolsError } = await supabase.rpc(
    "get_public_participating_schools",
    { p_state_id: null }
  );

  if (schoolsError) {
    console.error(
      "Failed to load participating schools:",
      schoolsError.message || schoolsError.code || schoolsError
    );
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

/**
 * Public, non-personalized stats — cached for 60s so the homepage map
 * doesn't hit Supabase on every single request. Same data, same shape.
 */
export const fetchPublicMapData = unstable_cache(loadPublicMapData, ["public-map-data"], {
  revalidate: 60,
});

export { states };
