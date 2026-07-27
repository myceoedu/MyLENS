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

const CACHE_TTL_MS = 60_000;
let cachedData: PublicMapData | null = null;
let cachedAt = 0;
let inflightRequest: Promise<PublicMapData> | null = null;

/**
 * Public, non-personalized stats — cached in-memory for 60s so the homepage
 * map doesn't hit Supabase on every single request. Same data, same shape.
 *
 * Uses a plain module-level cache instead of `unstable_cache` — the latter
 * relies on Next's internal incremental-cache instance being present on the
 * work store, which isn't guaranteed for Server Components loaded via
 * `next/dynamic` and throws `generateSimpleCacheKey is not a function` here.
 */
export async function fetchPublicMapData(): Promise<PublicMapData> {
  const isFresh = cachedData !== null && Date.now() - cachedAt < CACHE_TTL_MS;
  if (isFresh) return cachedData!;

  if (!inflightRequest) {
    inflightRequest = loadPublicMapData()
      .then((data) => {
        cachedData = data;
        cachedAt = Date.now();
        return data;
      })
      .finally(() => {
        inflightRequest = null;
      });
  }

  return inflightRequest;
}

export { states };
