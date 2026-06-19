import Link from "next/link";
import { MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import type { Submission } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";
import { getStateLabel } from "@/lib/admin/schools";

export default function SubmissionCard({ submission }: { submission: Submission }) {
  const canEdit = submission.status === "draft" || submission.status === "revision";
  const stateLabel = getStateLabel(submission.state_id);

  return (
    <article
      className={cn(
        "group bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md",
        submission.status === "approved"
          ? "border-emerald-200/80"
          : submission.status === "revision"
            ? "border-orange-200/80"
            : "border-zinc-200/80"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={submission.status} />
            <CategoryPill category={submission.category as VideoCategory} size="xs" />
          </div>
          <h3
            className="text-base font-semibold text-emerald-950 leading-snug group-hover:text-emerald-800 transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {submission.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {submission.location}
              {stateLabel ? ` · ${stateLabel}` : ""}
            </span>
            {submission.video_url && (
              <span className="flex items-center gap-1.5">
                <Video className="w-3 h-3 shrink-0" />
                Video linked
              </span>
            )}
          </div>
          {submission.admin_notes && submission.status === "revision" && (
            <div className="rounded-xl border border-orange-200/80 bg-orange-50/80 px-4 py-3 text-sm text-orange-800 mt-2">
              <span className="font-semibold">Admin note: </span>
              {submission.admin_notes}
            </div>
          )}
        </div>
        <div className="shrink-0">
          {canEdit ? (
            <Link
              href={`/dashboard/creator/submissions/${submission.id}`}
              className="inline-flex items-center bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Edit draft
            </Link>
          ) : (
            <Link
              href={`/dashboard/creator/submissions/${submission.id}`}
              className="inline-flex items-center bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
