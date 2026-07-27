import Link from "next/link";
import { Film, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getCreatorContext, isBeforeSubmissionWindow, formatCampaignDate } from "@/lib/creator/queries";
import { CreatorShell } from "@/components/creator/CreatorShell";
import SubmissionCard from "@/components/creator/SubmissionCard";
import { DashboardEmptyState, DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import type { Submission } from "@/types/submission";

export default async function SubmissionsListPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      "id, user_id, school_id, title, description, category, location, state_id, video_url, status, admin_notes, created_at, updated_at"
    )
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false });

  const list = (submissions ?? []) as Submission[];
  const beforeWindow = isBeforeSubmissionWindow(ctx.settings);
  const closesAt = ctx.settings?.submission_closes_at
    ? new Date(ctx.settings.submission_closes_at)
    : null;
  const windowClosed = closesAt ? new Date() > closesAt : false;
  const opensLabel = formatCampaignDate(ctx.settings?.submission_opens_at ?? null);
  const closesLabel = formatCampaignDate(ctx.settings?.submission_closes_at ?? null);

  const drafts    = list.filter((s) => s.status === "draft" || s.status === "revision");
  const submitted = list.filter((s) => s.status !== "draft" && s.status !== "revision");

  return (
    <div className="space-y-6">
      <CreatorShell>
        <div className="space-y-8 p-6 sm:p-8 md:p-10">
          <DashboardPageHeader
            eyebrow="Creator submissions"
            title="Official story entries"
            description={
              opensLabel || closesLabel
                ? `${opensLabel ? `Opens ${opensLabel}` : ""}${opensLabel && closesLabel ? " · " : ""}${closesLabel ? `Closes ${closesLabel}` : ""}`
                : "Prepare, refine, and submit your Malaysian tourism stories for the MyLENS selection process."
            }
            action={
              !windowClosed && !beforeWindow ? (
                <Link
                  href="/dashboard/creator/submissions/new"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#10271c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  New submission
                </Link>
              ) : undefined
            }
          />

          {beforeWindow && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-800">
              <span className="font-semibold">Entry submissions open on {opensLabel}.</span>{" "}
              Use this production window to scout your location and shape your story.
            </div>
          )}

          {windowClosed && (
            <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
              <span className="font-semibold">The submission window has closed.</span> New submissions
              are no longer accepted. Your submitted videos are under review.
            </div>
          )}

          {list.length === 0 ? (
            <DashboardEmptyState
              icon={<Film className="h-5 w-5" />}
              title="No submissions yet"
              description={
                beforeWindow
                  ? "Start developing your story now — submissions open soon."
                  : "Create your first tourism story submission when you are ready."
              }
              action={
                !windowClosed ? (
                <Link
                  href="/dashboard/creator/submissions/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#10271c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
                >
                  <Plus className="w-4 h-4" />
                  Start a submission
                </Link>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-8">
              {drafts.length > 0 && (
                <section>
                  <h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    In development · {drafts.length}
                  </h2>
                  <div className="space-y-3">
                    {drafts.map((s) => (
                      <SubmissionCard key={s.id} submission={s} />
                    ))}
                  </div>
                </section>
              )}

              {submitted.length > 0 && (
                <section>
                  <h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Submitted entries · {submitted.length}
                  </h2>
                  <div className="space-y-3">
                    {submitted.map((s) => (
                      <SubmissionCard key={s.id} submission={s} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </CreatorShell>
    </div>
  );
}
