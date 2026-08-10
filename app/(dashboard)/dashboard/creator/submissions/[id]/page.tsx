import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getCreatorContext } from "@/lib/creator/queries";
import { updateSubmissionAction } from "@/lib/creator/submission-actions";
import { CreatorBreadcrumbs, CreatorNotice, CreatorShell } from "@/components/creator/CreatorShell";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import SubmissionForm from "@/components/creator/SubmissionForm";
import SubmitReviewButton from "@/components/creator/SubmitReviewButton";
import DeleteSubmissionButton from "@/components/creator/DeleteSubmissionButton";
import { STATE_OPTIONS } from "@/lib/data/state-options";
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
    <CreatorShell>
      <CreatorBreadcrumbs
        items={[
          { label: "Submissions", href: "/dashboard/creator/submissions" },
          { label: submission.title },
        ]}
      />
      <div className="border-b border-zinc-200 px-4 py-3 sm:px-5">
        <Link
          href="/dashboard/creator/submissions"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to submissions
        </Link>
      </div>

      <header className="border-b border-zinc-200 px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={submission.status} />
          <CategoryPill category={submission.category as VideoCategory} />
          <span className="font-mono text-[10px] tracking-wide text-zinc-400">
            {submission.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          {submission.title}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin className="h-3.5 w-3.5" />
          {submission.location}
          {stateLabel ? ` · ${stateLabel}` : ""}
        </p>
      </header>

      <div className="space-y-5 p-4 sm:p-5">
        {submission.admin_notes && submission.status === "revision" ? (
          <CreatorNotice tone="warning">
            <p className="text-sm font-semibold text-orange-900">Revision requested</p>
            <p className="mt-1 text-sm text-orange-800">{submission.admin_notes}</p>
          </CreatorNotice>
        ) : null}

        {submission.status === "approved" ? (
          <CreatorNotice tone="success">
            <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>Your submission has been approved. It is now in the judging queue.</p>
            </div>
          </CreatorNotice>
        ) : null}

        {submission.status === "rejected" ? (
          <CreatorNotice tone="danger">
            <p className="font-semibold">This submission was not selected.</p>
            {submission.admin_notes ? <p className="mt-1">{submission.admin_notes}</p> : null}
          </CreatorNotice>
        ) : null}

        {submission.status === "in_review" || submission.status === "submitted" ? (
          <CreatorNotice tone="info">
            Your entry is with the MyLENS team for review. You will see the outcome here.
          </CreatorNotice>
        ) : null}

        {submission.video_url ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900">Video linked</p>
              <p className="truncate text-xs text-zinc-500">{submission.video_url}</p>
            </div>
            <a
              href={submission.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : null}

        {canEdit ? (
          <section>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Edit submission
            </h2>
            <SubmissionForm
              mode="edit"
              defaultValues={submission}
              states={[...STATE_OPTIONS]}
              saveAction={boundUpdateAction}
              isWindowClosed={windowClosed}
            />
          </section>
        ) : submission.description ? (
          <section>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700">{submission.description}</p>
          </section>
        ) : null}

        {canSubmit ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-5">
            <SubmitReviewButton submissionId={submission.id} isWindowClosed={windowClosed} />
            <DeleteSubmissionButton submissionId={submission.id} />
          </div>
        ) : null}

        {!canSubmit && submission.status === "draft" ? (
          <div className="border-t border-zinc-200 pt-5">
            <DeleteSubmissionButton submissionId={submission.id} />
          </div>
        ) : null}
      </div>
    </CreatorShell>
  );
}
