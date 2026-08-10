import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import { createSubmissionAction } from "@/lib/creator/submission-actions";
import {
  CreatorBreadcrumbs,
  CreatorPageHeader,
  CreatorShell,
} from "@/components/creator/CreatorShell";
import SubmissionForm from "@/components/creator/SubmissionForm";
import { STATE_OPTIONS } from "@/lib/data/state-options";

export default async function NewSubmissionPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  const closesAt = ctx.settings?.submission_closes_at
    ? new Date(ctx.settings.submission_closes_at)
    : null;
  const windowClosed = closesAt ? new Date() > closesAt : false;

  return (
    <CreatorShell>
      <CreatorBreadcrumbs
        items={[
          { label: "Submissions", href: "/dashboard/creator/submissions" },
          { label: "New submission" },
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
      <CreatorPageHeader
        title="New submission"
        description="Capture an authentic Malaysian destination in 45 seconds. Save a draft, then submit when ready."
      />

      <div className="p-4 sm:p-5">
        {windowClosed ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            The submission window has closed. New submissions are no longer accepted.
          </div>
        ) : (
          <SubmissionForm
            mode="create"
            defaultStateId={ctx.school?.state_id}
            states={[...STATE_OPTIONS]}
            saveAction={createSubmissionAction}
            isWindowClosed={false}
          />
        )}
      </div>
    </CreatorShell>
  );
}
