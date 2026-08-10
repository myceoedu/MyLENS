"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { regenerateSchoolTokenAction } from "@/lib/admin/actions";

export default function RegenerateTokenButton({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await regenerateSchoolTokenAction(schoolId);
            if (!result.ok) setError(result.error);
            else router.refresh();
          });
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        Regenerate token
      </button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
