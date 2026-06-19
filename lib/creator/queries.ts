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

export async function getCreatorContext(profile: Profile): Promise<CreatorContext> {
  const supabase = await createClient();

  let school: School | null = null;
  let teammates: CreatorContext["teammates"] = [];

  if (profile.school_id) {
    const [{ data: schoolData }, { data: teammateData }] = await Promise.all([
      supabase.from("schools").select("*").eq("id", profile.school_id).single(),
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
  }

  const { data: settings } = await supabase
    .from("campaign_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return {
    profile,
    school,
    stateLabel: school ? getStateLabel(school.state_id) : null,
    teammates,
    teamCount: teammates.length,
    settings: (settings as CampaignSettings | null) ?? null,
  };
}

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

  const registerStatus: CampaignStep["status"] = registered ? "complete" : "current";
  const teamStatus: CampaignStep["status"] = !registered
    ? "upcoming"
    : hasTeam
      ? "complete"
      : "current";
  const captureStatus: CampaignStep["status"] =
    !registered || !hasTeam ? "upcoming" : submissionsOpen ? "complete" : "current";
  const submitStatus: CampaignStep["status"] = submissionsOpen
    ? "current"
    : registered && hasTeam
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
