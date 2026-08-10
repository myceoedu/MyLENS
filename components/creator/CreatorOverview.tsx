"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Film, GraduationCap } from "lucide-react";

type OverviewSubmission = {
  id: string;
  status: "draft" | "submitted" | "in_review" | "approved" | "revision" | "rejected";
};

type NextClass = {
  id: string;
  title: string;
  startsAt: string | null;
};

function formatCountdown(target: string) {
  const difference = new Date(target).getTime() - Date.now();
  if (Number.isNaN(difference)) return null;
  if (difference <= 0) return "Open now";

  const totalMinutes = Math.floor(difference / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function malaysiaDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

export default function CreatorOverview({
  submissions,
  completedLessons,
  lessonCount,
  nextClass,
  submissionOpensAt,
  submissionClosesAt,
}: {
  submissions: OverviewSubmission[];
  completedLessons: number;
  lessonCount: number;
  nextClass: NextClass | null;
  submissionOpensAt: string | null;
  submissionClosesAt: string | null;
}) {
  const targetDate = submissionClosesAt ?? submissionOpensAt;
  const [countdown, setCountdown] = useState(() =>
    targetDate ? formatCountdown(targetDate) : null
  );

  useEffect(() => {
    if (!targetDate) return;
    const update = () => setCountdown(formatCountdown(targetDate));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  const stats = useMemo(
    () => ({
      drafts: submissions.filter((item) => item.status === "draft" || item.status === "revision")
        .length,
      underReview: submissions.filter(
        (item) => item.status === "submitted" || item.status === "in_review"
      ).length,
      approved: submissions.filter((item) => item.status === "approved").length,
    }),
    [submissions]
  );

  const lessonPercent = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0;
  const deadlineLabel = submissionClosesAt ? "Submission closes in" : "Submission opens in";

  return (
    <section className="border-b border-zinc-200 px-4 py-5 sm:px-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          At a glance
        </h2>
        {targetDate && countdown && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
            <Clock3 className="h-3.5 w-3.5" />
            {deadlineLabel}: {countdown}
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/dashboard/creator/submissions"
          className="border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
        >
          <Film className="h-4 w-4 text-zinc-500" />
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{stats.drafts}</p>
          <p className="text-xs text-zinc-500">Drafts / needs edits</p>
        </Link>
        <Link
          href="/dashboard/creator/submissions"
          className="border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
        >
          <Clock3 className="h-4 w-4 text-amber-600" />
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{stats.underReview}</p>
          <p className="text-xs text-zinc-500">Awaiting decision</p>
        </Link>
        <Link
          href="/dashboard/creator/learning"
          className="border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
        >
          <GraduationCap className="h-4 w-4 text-emerald-700" />
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{lessonPercent}%</p>
          <p className="text-xs text-zinc-500">
            Lessons · {completedLessons}/{lessonCount}
          </p>
        </Link>
        {nextClass ? (
          <Link
            href="/dashboard/creator/learning"
            className="border border-emerald-200 bg-emerald-50 p-4 transition-colors hover:border-emerald-400"
          >
            <CalendarDays className="h-4 w-4 text-emerald-700" />
            <p className="mt-3 truncate text-sm font-semibold text-zinc-900">{nextClass.title}</p>
            <p className="mt-1 text-xs text-emerald-800">
              {nextClass.startsAt ? malaysiaDate(nextClass.startsAt) : "Schedule coming soon"}
            </p>
          </Link>
        ) : (
          <div className="border border-zinc-200 bg-white p-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="mt-3 text-sm font-semibold text-zinc-900">{stats.approved} approved</p>
            <p className="mt-1 text-xs text-zinc-500">Your approved entries</p>
          </div>
        )}
      </div>
    </section>
  );
}
