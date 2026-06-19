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
          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Yes, delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 bg-white"
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
      className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-red-600 border border-zinc-200 hover:border-red-200 bg-white px-4 py-2 rounded-xl transition-all"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete draft
    </button>
  );
}
