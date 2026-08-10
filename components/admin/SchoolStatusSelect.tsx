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
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10 disabled:opacity-60"
    >
      <option value="active">Active</option>
      <option value="pending">Pending</option>
      <option value="archived">Archived</option>
    </select>
  );
}
