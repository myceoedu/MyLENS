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
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-800 border border-sky-200 rounded-xl px-4 py-2.5 bg-sky-50/50 hover:bg-sky-50 transition-all disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        Regenerate Token
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
