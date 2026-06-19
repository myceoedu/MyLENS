"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSchoolStatusAction } from "@/lib/admin/actions";
import type { SchoolStatus } from "@/types/auth";

export default function SchoolStatusSelect({
  schoolId,
  currentStatus,
}: {
  schoolId: string;
  currentStatus: SchoolStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as SchoolStatus;
        startTransition(async () => {
          await updateSchoolStatusAction(schoolId, status);
          router.refresh();
        });
      }}
      className="bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 py-2 px-3 outline-none focus:border-emerald-600"
    >
      <option value="active">Active</option>
      <option value="pending">Pending</option>
      <option value="archived">Archived</option>
    </select>
  );
}
