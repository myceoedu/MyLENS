import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { getStateLabel } from "@/lib/admin/schools";
import type { CampaignSettings, CampaignStep } from "@/types/campaign";
import type { Profile } from "@/types/profile";
import type { School } from "@/types/school";

export interface CreatorContext {
  profile: Profile;
  school: School | null;
  stateLabel: string | null;
  teammates: Pick<Profile, "id" | "full_name" | "email" | "avatar_url" | "bio">[];
  teamCount: number;
  settings: CampaignSettings | null;
}

const SETTINGS_TTL_MS = 60_000;
let cachedSettings: CampaignSettings | null | undefined;
let cachedSettingsAt = 0;
let inflightSettings: Promise<CampaignSettings | null> | null = null;

async function fetchCampaignSettings(): Promise<CampaignSettings | null> {
  const now = Date.now();
  if (cachedSettings !== undefined && now - cachedSettingsAt < SETTINGS_TTL_MS) {
    return cachedSettings;
  }

  if (inflightSettings) return inflightSettings;

  inflightSettings = (async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("campaign_settings")
      .select("id, submission_opens_at, submission_closes_at, updated_at")
      .limit(1)
      .maybeSingle();

    cachedSettings = (data as CampaignSettings | null) ?? null;
    cachedSettingsAt = Date.now();
    inflightSettings = null;
    return cachedSettings;
  })();

  return inflightSettings;
}

export const getCreatorContext = cache(async function getCreatorContext(
  profile: Profile,
  { includeTeammates = false }: { includeTeammates?: boolean } = {}
): Promise<CreatorContext> {
  const supabase = await createClient();

  let school: School | null = null;
  let teammates: CreatorContext["teammates"] = [];
  let teamCount = 0;
  const settingsPromise = fetchCampaignSettings();

  if (profile.school_id) {
    if (includeTeammates) {
      const [{ data: schoolData }, { data: teammateData }] = await Promise.all([
        supabase
          .from("schools")
          .select("id, slug, name, state_id, status, access_token, points, rank, created_at, updated_at")
          .eq("id", profile.school_id)
          .single(),
        supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url, bio")
          .eq("school_id", profile.school_id)
          .eq("role", "creator")
          .eq("status", "active")
          .order("full_name"),
      ]);

      school = (schoolData as School | null) ?? null;
      teammates = teammateData ?? [];
      teamCount = teammates.length;
    } else {
      const [{ data: schoolData }, { count }] = await Promise.all([
        supabase
          .from("schools")
          .select("id, slug, name, state_id, status, access_token, points, rank, created_at, updated_at")
          .eq("id", profile.school_id)
          .single(),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("school_id", profile.school_id)
          .eq("role", "creator")
          .eq("status", "active"),
      ]);

      school = (schoolData as School | null) ?? null;
      teamCount = count ?? 0;
    }
  }

  const settings = await settingsPromise;

  return {
    profile,
    school,
    stateLabel: school ? getStateLabel(school.state_id) : null,
    teammates,
    teamCount,
    settings,
  };
});

export function buildCampaignSteps(
  profile: Profile,
  teamCount: number,
  settings: CampaignSettings | null
): CampaignStep[] {
  const registered = profile.status === "active";
  const hasTeam = teamCount >= 1;
  const now = new Date();
  const opensAt = settings?.submission_opens_at ? new Date(settings.submission_opens_at) : null;
  const submissionsOpen = opensAt ? now >= opensAt : false;
  const readyForClass = registered && hasTeam;

  const registerStatus: CampaignStep["status"] = registered ? "complete" : "current";
  const teamStatus: CampaignStep["status"] = !registered
    ? "upcoming"
    : hasTeam
      ? "complete"
      : "current";
  const classStatus: CampaignStep["status"] = !readyForClass
    ? "upcoming"
    : submissionsOpen
      ? "complete"
      : "current";
  const captureStatus: CampaignStep["status"] = !readyForClass
    ? "upcoming"
    : submissionsOpen
      ? "complete"
      : "upcoming";
  const submitStatus: CampaignStep["status"] = submissionsOpen
    ? "current"
    : readyForClass
      ? "upcoming"
      : "locked";

  return [
    {
      id: "register",
      label: "Register",
      description: "Create your account and get approved by MyLENS admin.",
      status: registerStatus,
    },
    {
      id: "team",
      label: "Team",
      description: `Join your school team — up to ${MAX_CREATORS_PER_SCHOOL} creators per school.`,
      status: teamStatus,
    },
    {
      id: "class",
      label: "Class",
      description: "Complete Creator Academy lessons and prepare your filmmaking craft.",
      status: classStatus,
    },
    {
      id: "capture",
      label: "Capture",
      description: "Film authentic tourism stories across Malaysia's destinations.",
      status: captureStatus,
    },
    {
      id: "submit",
      label: "Submit",
      description: "Upload your 45-second video when submissions open.",
      status: submitStatus,
    },
  ];
}

export function formatCampaignDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(iso));
}

export function isBeforeSubmissionWindow(settings: CampaignSettings | null): boolean {
  if (!settings?.submission_opens_at) return false;
  return new Date() < new Date(settings.submission_opens_at);
}
