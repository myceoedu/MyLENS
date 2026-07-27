import Link from "next/link";
import { Calendar } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import {
  buildCampaignSteps,
  formatCampaignDate,
  getCreatorContext,
  isBeforeSubmissionWindow,
} from "@/lib/creator/queries";
import CampaignProgress from "@/components/creator/CampaignProgress";
import { CreatorShell } from "@/components/creator/CreatorShell";
import CreatorEventBriefing from "@/components/creator/CreatorEventBriefing";
import CreatorNextStep from "@/components/creator/CreatorNextStep";

export default async function CreatorDashboardPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  const steps = buildCampaignSteps(profile, ctx.teamCount, ctx.settings);
  const submissionOpens = formatCampaignDate(ctx.settings?.submission_opens_at ?? null);
  const beforeWindow = isBeforeSubmissionWindow(ctx.settings);

  return (
    <div className="space-y-6">
      <CreatorShell>
        <div className="space-y-9 p-8 md:space-y-10 md:p-10 lg:p-12">
          <CreatorEventBriefing
            creatorName={profile.full_name}
            schoolName={ctx.school?.name ?? null}
            stateLabel={ctx.stateLabel}
            teamCount={ctx.teamCount}
          />

          {beforeWindow && submissionOpens && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/35 bg-gradient-to-r from-amber-50/90 to-[#faf3e8]/90 px-5 py-4 shadow-sm">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#8b6914]" />
              <div>
                <p
                  className="text-sm font-semibold text-[#5c3d1e]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Submissions open on {submissionOpens}
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed text-[#6b5344]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Use this time for Creator Academy, team planning, and filming your story. Head to{" "}
                  <Link
                    href="/dashboard/creator/submissions"
                    className="font-medium text-emerald-900 underline hover:text-emerald-800"
                  >
                    Submissions
                  </Link>{" "}
                  to start your draft.
                </p>
              </div>
            </div>
          )}

          <CreatorNextStep
            hasSchool={Boolean(ctx.school)}
            teamCount={ctx.teamCount}
            settings={ctx.settings}
          />

          <section className="space-y-5">
            <h2
              className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4a3f35]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Delegate pathway
            </h2>
            <CampaignProgress steps={steps} />
          </section>
        </div>
      </CreatorShell>
    </div>
  );
}
