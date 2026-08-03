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
        "group border bg-white transition-colors hover:border-[#c8b077]",
        submission.status === "approved"
          ? "border-emerald-200/80"
          : submission.status === "revision"
            ? "border-orange-200/80"
            : "border-[#e2ded5]"
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
                  ? "bg-[#B68A35]"
                  : "bg-[#10271c]"
          )}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={submission.status} />
              <CategoryPill category={submission.category as VideoCategory} size="xs" />
              <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-400">
                {submission.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h3 className="font-serif text-xl font-semibold leading-snug text-[#1A2332] transition-colors group-hover:text-[#5e471d]">
              {submission.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {submission.location}
                {stateLabel ? ` · ${stateLabel}` : ""}
              </span>
              {submission.video_url && (
                <span className="flex items-center gap-1.5">
                  <Video className="h-3 w-3 shrink-0" />
                  Video linked
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3 shrink-0" />
                Updated {updatedLabel}
              </span>
            </div>
            {submission.admin_notes && submission.status === "revision" && (
              <div className="mt-2 border border-orange-200/80 bg-orange-50/80 px-4 py-3 text-sm text-orange-800">
                <span className="font-semibold">Admin note: </span>
                {submission.admin_notes}
              </div>
            )}
          </div>
          <div className="shrink-0">
            {canEdit ? (
              <Link
                href={`/dashboard/creator/submissions/${submission.id}`}
                className="inline-flex items-center bg-[#10271c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Edit draft
              </Link>
            ) : (
              <Link
                href={`/dashboard/creator/submissions/${submission.id}`}
                className="inline-flex items-center border border-[#ddd8ce] bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-[#B68A35] hover:text-[#1A2332]"
                style={{ fontFamily: "var(--font-inter)" }}
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
