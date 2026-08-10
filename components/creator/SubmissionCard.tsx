import Link from "next/link";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import type { Submission } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";
import { getStateLabel } from "@/lib/admin/schools";

export default function SubmissionCard({ submission }: { submission: Submission }) {
  const canEdit = submission.status === "draft" || submission.status === "revision";
  const stateLabel = getStateLabel(submission.state_id);
  const updatedLabel = new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(submission.updated_at));

  return (
    <article
      className={cn(
        "group border bg-white transition-colors hover:border-zinc-400",
        submission.status === "approved"
          ? "border-emerald-200"
          : submission.status === "revision"
            ? "border-orange-200"
            : "border-zinc-200"
      )}
    >
      <div className="flex">
        <div
          className={cn(
            "w-1 shrink-0",
            submission.status === "approved"
              ? "bg-emerald-600"
              : submission.status === "revision"
                ? "bg-orange-500"
                : submission.status === "draft"
                  ? "bg-zinc-400"
                  : "bg-zinc-900"
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={submission.status} />
              <CategoryPill category={submission.category as VideoCategory} size="xs" />
            </div>
            <h3 className="text-base font-semibold leading-snug text-zinc-900">
              {submission.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {submission.location}
                {stateLabel ? ` · ${stateLabel}` : ""}
              </span>
              {submission.video_url ? (
                <span className="flex items-center gap-1.5">
                  <Video className="h-3 w-3 shrink-0" />
                  Video linked
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3 shrink-0" />
                Updated {updatedLabel}
              </span>
            </div>
            {submission.admin_notes && submission.status === "revision" ? (
              <div className="mt-2 border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                <span className="font-semibold">Admin note: </span>
                {submission.admin_notes}
              </div>
            ) : null}
          </div>
          <div className="shrink-0">
            {canEdit ? (
              <Link
                href={`/dashboard/creator/submissions/${submission.id}`}
                className="inline-flex items-center bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Edit draft
              </Link>
            ) : (
              <Link
                href={`/dashboard/creator/submissions/${submission.id}`}
                className="inline-flex items-center border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400"
              >
                View
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
