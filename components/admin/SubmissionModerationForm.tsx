"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { moderateSubmissionAction } from "@/lib/admin/submission-actions";
import {
  allowedNextStatuses,
  notesRequiredFor,
} from "@/lib/admin/submissions";
import { STATUS_CONFIG } from "@/types/submission";
import type { SubmissionStatus } from "@/types/auth";
import { cn } from "@/lib/utils";

export default function SubmissionModerationForm({
  submissionId,
  currentStatus,
  initialNotes,
}: {
  submissionId: string;
  currentStatus: SubmissionStatus;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<SubmissionStatus | "">(
    allowedNextStatuses(currentStatus)[0] ?? ""
  );
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const options = allowedNextStatuses(currentStatus);
  const needsNotes = nextStatus ? notesRequiredFor(nextStatus) : false;

  if (options.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e2ded5] bg-[#fbfbf8] p-5 text-sm text-zinc-600">
        This draft has not been submitted yet. Moderation opens after the creator
        submits for review.
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nextStatus) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await moderateSubmissionAction({
        submissionId,
        expectedStatus: currentStatus,
        nextStatus,
        adminNotes: notes,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess(`Updated to “${STATUS_CONFIG[nextStatus].label}”.`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#e2ded5] bg-white p-5 shadow-sm">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a722a]">
          Moderate entry
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-[#10271c]">
          Update status
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Current:{" "}
          <span className="font-medium text-zinc-700">
            {STATUS_CONFIG[currentStatus].label}
          </span>
        </p>
      </div>

      <fieldset disabled={pending} className="space-y-3">
        <legend className="sr-only">Next status</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const selected = nextStatus === status;
            return (
              <label
                key={status}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
                  selected
                    ? "border-[#10271c] bg-[#f5efe4]"
                    : "border-[#e2ded5] bg-white hover:border-[#c8b077]"
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
                  <span className={cn("block text-sm font-semibold", cfg.color)}>
                    {cfg.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {status === "in_review" && "Mark as actively reviewing"}
                    {status === "approved" && "Send to judging queue"}
                    {status === "revision" && "Ask creator to edit"}
                    {status === "rejected" && "Decline this entry"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div>
          <label
            htmlFor="admin-notes"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500"
          >
            Admin notes{needsNotes ? " (required)" : " (optional)"}
          </label>
          <textarea
            id="admin-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={
              needsNotes
                ? "Explain what the creator should fix or why it was rejected…"
                : "Optional internal / creator-facing note"
            }
            className="w-full rounded-xl border border-[#ddd8ce] bg-[#fbfbf8] px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-[#bba978] focus:bg-white"
          />
          <p className="mt-1 text-right text-[11px] text-zinc-400">{notes.length}/2000</p>
        </div>
      </fieldset>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !nextStatus}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10271c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
