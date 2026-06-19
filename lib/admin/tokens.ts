import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";
import { getStateShortName } from "@/lib/admin/schools";

type Client = SupabaseClient<Database>;

export async function generateUniqueAccessToken(
  supabase: Client,
  stateId: string
): Promise<string> {
  const short = getStateShortName(stateId);

  const { data: existing } = await supabase
    .from("schools")
    .select("access_token")
    .eq("state_id", stateId)
    .not("access_token", "is", null);

  const used = new Set((existing ?? []).map((s) => s.access_token));

  for (let attempt = 0; attempt < 100; attempt++) {
    const suffix = String(Math.floor(Math.random() * 90) + 10);
    const token = `MYLENS-${short}-${suffix}`;
    if (!used.has(token)) return token;
  }

  const fallback = `MYLENS-${short}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
  return fallback;
}
