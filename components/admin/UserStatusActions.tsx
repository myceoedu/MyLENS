"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Ban } from "lucide-react";
import {
  approveUserAction,
  updateUserStatusAction,
} from "@/lib/admin/actions";
import type { UserStatus } from "@/types/auth";

export default function UserStatusActions({
  profileId,
  status,
  showApprove = false,
}: {
  profileId: string;
  status: UserStatus;
  showApprove?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setError(result.error ?? "Action failed.");
      else router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {showApprove && status === "pending" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => approveUserAction(profileId))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F3A2C] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#175a44] disabled:opacity-60"
          >
            {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            Approve
          </button>
        )}
        {status === "active" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => updateUserStatusAction(profileId, "suspended"))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
          >
            <Ban className="w-3 h-3" />
            Suspend
          </button>
        )}
        {status === "suspended" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => updateUserStatusAction(profileId, "active"))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-60"
          >
            Reactivate
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
