import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getCreatorContext } from "@/lib/creator/queries";
import { updateSubmissionAction } from "@/lib/creator/submission-actions";
import { CreatorShell } from "@/components/creator/CreatorShell";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import SubmissionForm from "@/components/creator/SubmissionForm";
import SubmitReviewButton from "@/components/creator/SubmitReviewButton";
import DeleteSubmissionButton from "@/components/creator/DeleteSubmissionButton";
import { states } from "@/lib/data/states";
import { getStateLabel } from "@/lib/admin/schools";
import type { Submission } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);
  const supabase = await createClient();

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!data) notFound();

  const submission = data as Submission;
  const canEdit = submission.status === "draft" || submission.status === "revision";
  const canSubmit = canEdit;

  const closesAt = ctx.settings?.submission_closes_at
    ? new Date(ctx.settings.submission_closes_at)
    : null;
  const windowClosed = closesAt ? new Date() > closesAt : false;
  const stateLabel = getStateLabel(submission.state_id);

  const boundUpdateAction = updateSubmissionAction.bind(null, submission.id);

  return (
    <div className="space-y-6">
      <CreatorShell>
        <div className="p-8 md:p-10 space-y-8">
          {/* Header */}
          <div>
            <Link
              href="/dashboard/creator/submissions"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-950 mb-4 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to submissions
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={submission.status} />
                  <CategoryPill category={submission.category as VideoCategory} />
                </div>
                <h1
                  className="text-2xl font-bold text-emerald-950"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {submission.title}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {submission.location}
                  {stateLabel ? ` · ${stateLabel}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Admin revision notes */}
          {submission.admin_notes && submission.status === "revision" && (
            <div className="rounded-2xl border border-orange-200/80 bg-orange-50/80 px-5 py-4">
              <p
                className="text-sm font-semibold text-orange-900 mb-1"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Revision requested
              </p>
              <p className="text-sm text-orange-800" style={{ fontFamily: "var(--font-inter)" }}>
                {submission.admin_notes}
              </p>
            </div>
          )}

          {/* Approved notice */}
          {submission.status === "approved" && (
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-800">
              🎉 Your submission has been approved. It is now in the judging queue.
            </div>
          )}

          {/* Video link preview */}
          {submission.video_url && (
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-sm font-semibold text-emerald-950 mb-0.5"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Video linked
                </p>
                <p
                  className="text-xs text-zinc-500 truncate max-w-xs"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {submission.video_url}
                </p>
              </div>
              <a
                href={submission.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-950 font-medium shrink-0"
              >
                Open <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Edit form or read-only summary */}
          {canEdit ? (
            <section className="border-t border-zinc-200/80 pt-8">
              <h2
                className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Edit your story
              </h2>
              <SubmissionForm
                mode="edit"
                defaultValues={submission}
                states={states.map((s) => ({ id: s.id, name: s.name }))}
                saveAction={boundUpdateAction}
                isWindowClosed={windowClosed}
              />
            </section>
          ) : (
            <section className="border-t border-zinc-200/80 pt-8 space-y-4">
              {submission.description && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-2">
                    Story Description
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{submission.description}</p>
                </div>
              )}
            </section>
          )}

          {/* Submit for review */}
          {canSubmit && (
            <div className="border-t border-zinc-200/80 pt-8 flex flex-wrap items-center gap-4">
              <SubmitReviewButton submissionId={submission.id} isWindowClosed={windowClosed} />
              <DeleteSubmissionButton submissionId={submission.id} />
            </div>
          )}

          {/* Delete draft (if no submit button shown) */}
          {!canSubmit && submission.status === "draft" && (
            <div className="border-t border-zinc-200/80 pt-8">
              <DeleteSubmissionButton submissionId={submission.id} />
            </div>
          )}
        </div>
      </CreatorShell>
    </div>
  );
}
