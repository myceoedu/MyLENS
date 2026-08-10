"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteSubmissionAction } from "@/lib/creator/submission-actions";

export default function DeleteSubmissionButton({ submissionId }: { submissionId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteSubmissionAction(submissionId);
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
          Delete this draft?
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="inline-flex items-center gap-1.5 bg-red-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Yes, delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          Cancel
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-500 transition-colors hover:border-red-200 hover:text-red-600"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete draft
    </button>
  );
}
