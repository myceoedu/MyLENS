"use client";

import { useState, useTransition } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { submitForReviewAction } from "@/lib/creator/submission-actions";

export default function SubmitReviewButton({
  submissionId,
  isWindowClosed,
}: {
  submissionId: string;
  isWindowClosed: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await submitForReviewAction(submissionId);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || isWindowClosed}
        className="inline-flex items-center gap-2 bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <SendHorizonal className="w-4 h-4" />
            Submit for Review
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
      {isWindowClosed && (
        <p className="text-xs text-red-600" style={{ fontFamily: "var(--font-inter)" }}>
          Submission window is currently closed.
        </p>
      )}
    </div>
  );
}
