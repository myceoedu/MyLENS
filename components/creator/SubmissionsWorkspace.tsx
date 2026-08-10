"use client";

import { useMemo, useState } from "react";
import { Film } from "lucide-react";
import SubmissionCard from "@/components/creator/SubmissionCard";
import { cn } from "@/lib/utils";
import type { Submission, SubmissionStatus } from "@/types/submission";

type Filter = "all" | "draft" | "submitted" | "in_review" | "approved" | "revision" | "rejected";

const FILTERS: { value: Filter; label: string; statuses?: SubmissionStatus[] }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts", statuses: ["draft"] },
  { value: "revision", label: "Needs edits", statuses: ["revision"] },
  { value: "submitted", label: "Submitted", statuses: ["submitted"] },
  { value: "in_review", label: "In review", statuses: ["in_review"] },
  { value: "approved", label: "Approved", statuses: ["approved"] },
  { value: "rejected", label: "Rejected", statuses: ["rejected"] },
];

export default function SubmissionsWorkspace({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => {
    const selection = FILTERS.find((item) => item.value === filter);
    if (!selection?.statuses) return submissions;
    return submissions.filter((submission) => selection.statuses?.includes(submission.status));
  }, [filter, submissions]);

  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto border-b border-zinc-200">
        {FILTERS.map((item) => {
          const count = item.statuses
            ? submissions.filter((submission) => item.statuses?.includes(submission.status)).length
            : submissions.length;
          const active = item.value === filter;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              )}
            >
              {item.label}
              <span className="ml-1.5 text-xs text-zinc-400">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-zinc-200 px-5 py-12 text-center">
          <Film className="mx-auto h-6 w-6 text-zinc-300" />
          <p className="mt-3 text-sm font-medium text-zinc-700">No entries in this status</p>
          <p className="mt-1 text-xs text-zinc-500">Choose another filter to see your submissions.</p>
        </div>
      )}
    </div>
  );
}
