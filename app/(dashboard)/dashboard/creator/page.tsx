import Link from "next/link";
import { Calendar, Film, Users } from "lucide-react";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { requireRole } from "@/lib/auth/session";
import {
  buildCampaignSteps,
  formatCampaignDate,
  getCreatorContext,
  isBeforeSubmissionWindow,
} from "@/lib/creator/queries";
import { createClient } from "@/lib/supabase/server";
import CampaignProgress from "@/components/creator/CampaignProgress";
import { CreatorShell } from "@/components/creator/CreatorShell";
import ResourceList from "@/components/creator/ResourceList";
import type { CampaignResource } from "@/types/campaign";

export default async function CreatorDashboardPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("campaign_resources")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .limit(3);

  const steps = buildCampaignSteps(profile, ctx.teamCount, ctx.settings);
  const submissionOpens = formatCampaignDate(ctx.settings?.submission_opens_at ?? null);
  const beforeWindow = isBeforeSubmissionWindow(ctx.settings);

  return (
    <div className="space-y-6">
      <CreatorShell>
        <div className="p-8 md:p-10 lg:p-12 space-y-9 md:space-y-10">
          <section className="space-y-3">
            <p
              className="text-[0.65rem] uppercase tracking-[0.35em] text-emerald-800/80 font-semibold"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Student Workspace
            </p>
            <h1
              className="text-3xl md:text-[2.125rem] font-semibold text-[#2c2419] leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Welcome, {profile.full_name ?? "Creator"}
            </h1>
            <p
              className="text-[#5c5046] text-sm max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {ctx.school ? (
                <>
                  Representing <strong className="text-[#3d3229]">{ctx.school.name}</strong>
                  {ctx.stateLabel ? ` · ${ctx.stateLabel}` : ""}. Track your campaign progress and
                  prepare your tourism video submission.
                </>
              ) : (
                "Your school assignment is pending. Contact your MyLENS administrator."
              )}
            </p>
          </section>

          {beforeWindow && submissionOpens && (
            <div
              className="flex items-start gap-3 rounded-2xl border border-amber-400/35 bg-gradient-to-r from-amber-50/90 to-[#faf3e8]/90 px-5 py-4 shadow-sm"
            >
              <Calendar className="w-5 h-5 text-[#8b6914] shrink-0 mt-0.5" />
              <div>
                <p
                  className="text-sm font-semibold text-[#5c3d1e]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Submissions open on {submissionOpens}
                </p>
                <p
                  className="text-sm text-[#6b5344] mt-1 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Use this time to review resources, plan with your team, and capture your story.
                  Head to{" "}
                  <Link
                    href="/dashboard/creator/submissions"
                    className="underline font-medium text-emerald-900 hover:text-emerald-800"
                  >
                    Submissions
                  </Link>{" "}
                  to start your draft.
                </p>
              </div>
            </div>
          )}

          <section className="space-y-5">
            <h2
              className="text-sm font-semibold text-[#4a3f35] uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Campaign progress
            </h2>
            <CampaignProgress steps={steps} />
          </section>

          <section className="border-t border-[#e8dcc8]/80 pt-8 md:pt-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2
                className="text-sm font-semibold text-[#4a3f35] uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Quick links
              </h2>
              <Link
                href="/dashboard/creator/team"
                className="inline-flex items-center gap-2 text-sm text-emerald-900 hover:text-[#8b6914] font-medium transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Users className="w-4 h-4" />
                {ctx.teamCount}/{MAX_CREATORS_PER_SCHOOL} team members
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/creator/submissions"
                className="bg-emerald-900 hover:bg-[#1a4d3e] text-amber-50 text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-900/20 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Film className="w-4 h-4" />
                My submissions
              </Link>
              <Link
                href="/dashboard/creator/resources"
                className="bg-white/80 border border-[#e8dcc8] hover:border-amber-400/40 text-[#4a3f35] text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                View resources
              </Link>
              <Link
                href="/dashboard/creator/profile"
                className="bg-white/80 border border-[#e8dcc8] hover:border-amber-400/40 text-[#4a3f35] text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Edit profile
              </Link>
            </div>
          </section>
        </div>
      </CreatorShell>

      {(resources ?? []).length > 0 && (
        <CreatorShell>
          <div className="p-8 md:p-10 lg:px-12">
            <h2
              className="text-xl font-semibold text-[#2c2419] mb-5 tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Featured resources
            </h2>
            <ResourceList resources={(resources ?? []) as CampaignResource[]} />
          </div>
        </CreatorShell>
      )}
    </div>
  );
}
