import Link from "next/link";
import { CalendarDays, Clapperboard, MapPin, Video } from "lucide-react";
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
        "group overflow-hidden border bg-white shadow-[0_12px_28px_-24px_rgba(16,39,28,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-26px_rgba(16,39,28,0.46)]",
        submission.status === "approved"
          ? "border-emerald-200/80"
          : submission.status === "revision"
            ? "border-orange-200/80"
            : "border-zinc-200/80"
      )}
    >
      <div className="grid sm:grid-cols-[9.5rem_minmax(0,1fr)]">
        <div className="flex min-h-36 flex-col justify-between bg-[#0a2619] p-5 text-white">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e4c784]">
              MyLENS entry
            </p>
            <Clapperboard className="mt-5 h-6 w-6 text-white/75" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.08em] text-white/45">
            {submission.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={submission.status} />
            <CategoryPill category={submission.category as VideoCategory} size="xs" />
          </div>
          <h3
            className="font-serif text-xl font-semibold leading-snug text-[#10271c] transition-colors group-hover:text-[#5e471d]"
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
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3 shrink-0" />
              Updated {updatedLabel}
            </span>
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
              className="inline-flex items-center rounded-xl bg-[#10271c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Edit draft
            </Link>
          ) : (
            <Link
              href={`/dashboard/creator/submissions/${submission.id}`}
              className="inline-flex items-center rounded-xl border border-[#ddd8ce] bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-[#bba978] hover:text-[#10271c]"
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
