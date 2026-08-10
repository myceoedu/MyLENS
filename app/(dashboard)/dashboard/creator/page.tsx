import Link from "next/link";
import { Calendar } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import {
  buildCampaignSteps,
  formatCampaignDate,
  getCreatorContext,
  isBeforeSubmissionWindow,
} from "@/lib/creator/queries";
import { getCreatorCompletedLearningItemIds, getCreatorLearningModules } from "@/lib/learning/queries";
import { createClient } from "@/lib/supabase/server";
import CampaignProgress from "@/components/creator/CampaignProgress";
import { CreatorShell } from "@/components/creator/CreatorShell";
import CreatorEventBriefing from "@/components/creator/CreatorEventBriefing";
import CreatorNextStep from "@/components/creator/CreatorNextStep";
import CreatorOverview from "@/components/creator/CreatorOverview";
import type { SubmissionStatus } from "@/types/auth";

export default async function CreatorDashboardPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);
  const supabase = await createClient();

  const steps = buildCampaignSteps(profile, ctx.teamCount, ctx.settings);
  const submissionOpens = formatCampaignDate(ctx.settings?.submission_opens_at ?? null);
  const beforeWindow = isBeforeSubmissionWindow(ctx.settings);
  const [{ data: submissions }, modules, completedItemIds] = await Promise.all([
    supabase
      .from("submissions")
      .select("id, status")
      .eq("user_id", profile.id),
    getCreatorLearningModules(),
    getCreatorCompletedLearningItemIds(profile.id),
  ]);
  const lessonCount = modules.reduce((total, module) => total + module.items.length, 0);
  const nextClass =
    modules
      .flatMap((module) => module.items)
      .filter(
        (item) =>
          item.content_type === "live_class" &&
          item.starts_at &&
          new Date(item.starts_at).getTime() >= Date.now() - 2 * 60 * 60 * 1000
      )
      .sort((a, b) => new Date(a.starts_at!).getTime() - new Date(b.starts_at!).getTime())[0] ??
    null;

  return (
    <CreatorShell>
      <CreatorEventBriefing
        creatorName={profile.full_name}
        schoolName={ctx.school?.name ?? null}
        stateLabel={ctx.stateLabel}
        teamCount={ctx.teamCount}
      />

      <CreatorOverview
        submissions={(submissions ?? []).map((submission) => ({
          id: submission.id,
          status: submission.status as SubmissionStatus,
        }))}
        completedLessons={completedItemIds.length}
        lessonCount={lessonCount}
        nextClass={
          nextClass
            ? { id: nextClass.id, title: nextClass.title, startsAt: nextClass.starts_at }
            : null
        }
        submissionOpensAt={ctx.settings?.submission_opens_at ?? null}
        submissionClosesAt={ctx.settings?.submission_closes_at ?? null}
      />

      {beforeWindow && submissionOpens ? (
        <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Submissions open on {submissionOpens}
            </p>
            <p className="mt-1 text-sm text-amber-800/80">
              Use this time for Learning, team planning, and filming. Start a draft in{" "}
              <Link
                href="/dashboard/creator/submissions"
                className="font-medium underline hover:text-amber-950"
              >
                Submissions
              </Link>
              .
            </p>
          </div>
        </div>
      ) : null}

      <CreatorNextStep
        hasSchool={Boolean(ctx.school)}
        teamCount={ctx.teamCount}
        settings={ctx.settings}
      />

      <section className="px-4 py-5 sm:px-5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Campaign pathway
        </h2>
        <CampaignProgress steps={steps} />
      </section>
    </CreatorShell>
  );
}
