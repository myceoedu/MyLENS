"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { moderateLearningTaskAction } from "@/lib/learning/task-actions";
import {
  allowedNextTaskStatuses,
  notesRequiredForTask,
} from "@/lib/learning/tasks";
import {
  LEARNING_TASK_STATUS_LABELS,
  type LearningTaskStatus,
} from "@/types/learning";
import { cn } from "@/lib/utils";

export default function LearningTaskModerationForm({
  submissionId,
  currentStatus,
  initialNotes,
}: {
  submissionId: string;
  currentStatus: LearningTaskStatus;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const options = allowedNextTaskStatuses(currentStatus);
  const [pending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<LearningTaskStatus | "">(
    options[0] ?? ""
  );
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
        This draft has not been submitted yet. Moderation opens after the creator submits.
      </div>
    );
  }

  const needsNotes = nextStatus ? notesRequiredForTask(nextStatus) : false;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nextStatus) return;
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await moderateLearningTaskAction({
        submissionId,
        expectedStatus: currentStatus,
        nextStatus,
        adminNotes: notes,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(`Updated to “${LEARNING_TASK_STATUS_LABELS[nextStatus]}”.`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B08D3F]">
          Moderate task
        </p>
        <h3 className="mt-1 text-base font-semibold text-zinc-900">Update status</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Current:{" "}
          <span className="font-medium text-zinc-700">
            {LEARNING_TASK_STATUS_LABELS[currentStatus]}
          </span>
        </p>
      </div>

      <fieldset disabled={pending} className="space-y-3">
        <legend className="sr-only">Next status</legend>
        <div className="grid gap-2">
          {options.map((status) => {
            const selected = nextStatus === status;
            return (
              <label
                key={status}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
                  selected
                    ? "border-[#0F3A2C] bg-[#eef5f1]"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                )}
              >
                <input
                  type="radio"
                  name="nextStatus"
                  value={status}
                  checked={selected}
                  onChange={() => setNextStatus(status)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">
                    {LEARNING_TASK_STATUS_LABELS[status]}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {status === "in_review" && "Mark as actively reviewing"}
                    {status === "approved" && "Complete the lesson for this creator"}
                    {status === "revision" && "Ask the creator to improve and resubmit"}
                    {status === "rejected" && "Decline this attempt"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div>
          <label
            htmlFor="task-admin-notes"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
          >
            Mentor notes{needsNotes ? " (required)" : " (optional)"}
          </label>
          <textarea
            id="task-admin-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={
              needsNotes
                ? "Explain what to improve or why it was rejected…"
                : "Optional feedback for the creator"
            }
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10"
          />
        </div>
      </fieldset>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !nextStatus}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F3A2C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#175a44] disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save decision"
        )}
      </button>
    </form>
  );
}
