import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getCreatorContext, isBeforeSubmissionWindow, formatCampaignDate } from "@/lib/creator/queries";
import { CreatorShell } from "@/components/creator/CreatorShell";
import SubmissionCard from "@/components/creator/SubmissionCard";
import type { Submission } from "@/types/submission";

export default async function SubmissionsListPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
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
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p
                className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-2"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                My Submissions
              </p>
              <h1
                className="text-2xl font-bold text-emerald-950"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Tourism Story Submissions
              </h1>
              {(opensLabel || closesLabel) && (
                <p className="text-sm text-zinc-500 mt-1.5" style={{ fontFamily: "var(--font-inter)" }}>
                  {opensLabel && <>Window opens {opensLabel}</>}
                  {opensLabel && closesLabel && " · "}
                  {closesLabel && <>closes {closesLabel}</>}
                </p>
              )}
            </div>

            {!windowClosed && !beforeWindow && (
              <Link
                href="/dashboard/creator/submissions/new"
                className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                New Submission
              </Link>
            )}
          </div>

          {beforeWindow && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-800">
              <span className="font-semibold">Submissions open on {opensLabel}.</span>{" "}
              Use this time to scout your location, plan your story, and review the{" "}
              <Link href="/dashboard/creator/resources" className="underline">
                filming guidelines
              </Link>
              .
            </div>
          )}

          {windowClosed && (
            <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
              <span className="font-semibold">The submission window has closed.</span> New submissions
              are no longer accepted. Your submitted videos are under review.
            </div>
          )}

          {list.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-3xl">🎬</p>
              <p
                className="text-lg font-semibold text-emerald-950"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                No submissions yet
              </p>
              <p className="text-sm text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
                {beforeWindow
                  ? "Start building your draft now — submissions open soon."
                  : "Create your first tourism story submission."}
              </p>
              {!windowClosed && (
                <Link
                  href="/dashboard/creator/submissions/new"
                  className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Start a new submission
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {drafts.length > 0 && (
                <section>
                  <h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Drafts & revisions ({drafts.length})
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
                    Submitted ({submitted.length})
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
