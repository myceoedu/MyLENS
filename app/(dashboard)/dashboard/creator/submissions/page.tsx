import Link from "next/link";
import { Film, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  getCreatorContext,
  isBeforeSubmissionWindow,
  formatCampaignDate,
} from "@/lib/creator/queries";
import {
  CreatorEmptyState,
  CreatorPageHeader,
  CreatorShell,
} from "@/components/creator/CreatorShell";
import SubmissionsWorkspace from "@/components/creator/SubmissionsWorkspace";
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

  const windowHint =
    opensLabel || closesLabel
      ? `${opensLabel ? `Opens ${opensLabel}` : ""}${opensLabel && closesLabel ? " · " : ""}${closesLabel ? `Closes ${closesLabel}` : ""}`
      : `${list.length} ${list.length === 1 ? "entry" : "entries"}`;

  return (
    <CreatorShell>
      <CreatorPageHeader
        title="Submissions"
        description={windowHint}
        action={
          !windowClosed && !beforeWindow ? (
            <Link
              href="/dashboard/creator/submissions/new"
              className="inline-flex items-center gap-2 bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New submission
            </Link>
          ) : undefined
        }
      />

      <div className="space-y-5 p-4 sm:p-5">
        {beforeWindow ? (
          <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Submissions open on {opensLabel}.</span> You can prepare
            drafts once the window opens.
          </div>
        ) : null}

        {windowClosed ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span className="font-semibold">Submission window closed.</span> New entries are no
            longer accepted.
          </div>
        ) : null}

        {list.length === 0 ? (
          <CreatorEmptyState
            icon={<Film className="h-5 w-5" />}
            title="No submissions yet"
            description={
              beforeWindow
                ? "Submissions open soon. Prepare your story and location in the meantime."
                : "Create your first tourism story submission when you are ready."
            }
            action={
              !windowClosed && !beforeWindow ? (
                <Link
                  href="/dashboard/creator/submissions/new"
                  className="inline-flex items-center gap-2 bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                  Start a submission
                </Link>
              ) : undefined
            }
          />
        ) : (
          <SubmissionsWorkspace submissions={list} />
        )}
      </div>
    </CreatorShell>
  );
}
