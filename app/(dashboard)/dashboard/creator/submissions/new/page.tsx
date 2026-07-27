import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import { createSubmissionAction } from "@/lib/creator/submission-actions";
import { CreatorShell } from "@/components/creator/CreatorShell";
import SubmissionForm from "@/components/creator/SubmissionForm";
import { STATE_OPTIONS } from "@/lib/data/state-options";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export default async function NewSubmissionPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  const closesAt = ctx.settings?.submission_closes_at
    ? new Date(ctx.settings.submission_closes_at)
    : null;
  const windowClosed = closesAt ? new Date() > closesAt : false;

  return (
    <CreatorShell>
      <div className="space-y-8 p-6 sm:p-8 md:p-10">
        <div>
          <Link
            href="/dashboard/creator/submissions"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-950 mb-4 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to submissions
          </Link>
          <DashboardPageHeader
            eyebrow="New story submission"
            title="Share your tourism story"
            description="Capture an authentic Malaysian destination in 45 seconds. Save a draft first, then submit for review when it is ready."
          />
        </div>

        {windowClosed ? (
          <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
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
