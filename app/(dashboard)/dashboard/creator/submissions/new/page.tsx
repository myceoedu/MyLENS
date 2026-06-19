import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import { createSubmissionAction } from "@/lib/creator/submission-actions";
import { CreatorShell } from "@/components/creator/CreatorShell";
import SubmissionForm from "@/components/creator/SubmissionForm";
import { states } from "@/lib/data/states";

export default async function NewSubmissionPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  const closesAt = ctx.settings?.submission_closes_at
    ? new Date(ctx.settings.submission_closes_at)
    : null;
  const windowClosed = closesAt ? new Date() > closesAt : false;

  return (
    <CreatorShell>
      <div className="p-8 md:p-10 space-y-8">
        <div>
          <Link
            href="/dashboard/creator/submissions"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-950 mb-4 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to submissions
          </Link>
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            New Submission
          </p>
          <h1
            className="text-2xl font-bold text-emerald-950 mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Share Your Tourism Story
          </h1>
          <p className="text-zinc-600 text-sm max-w-xl" style={{ fontFamily: "var(--font-inter)" }}>
            Capture an authentic Malaysian destination in 45 seconds. Fill in the details below — you can
            save a draft and submit when you&apos;re ready.
          </p>
        </div>

        {windowClosed ? (
          <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800">
            The submission window has closed. New submissions are no longer accepted.
          </div>
        ) : (
          <SubmissionForm
            mode="create"
            defaultStateId={ctx.school?.state_id}
            states={states.map((s) => ({ id: s.id, name: s.name }))}
            saveAction={createSubmissionAction}
            isWindowClosed={false}
          />
        )}
      </div>
    </CreatorShell>
  );
}
