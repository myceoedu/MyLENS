"use client";

import { useState } from "react";
import InquiriesPanel from "@/components/admin/InquiriesPanel";
import PartnershipInquiriesPanel from "@/components/admin/PartnershipInquiriesPanel";
import type { ContactInquiry } from "@/types/contact-inquiry";
import type { PartnershipInquiry } from "@/types/partnership-inquiry";
import { cn } from "@/lib/utils";
import { AdminPage, AdminPageHeader } from "@/components/admin/AdminUI";

type InquiryTab = "school" | "partnership";

type AdminInquiriesHubProps = {
  schoolInquiries: ContactInquiry[];
  partnershipInquiries: PartnershipInquiry[];
  partnershipLoadError: string | null;
};

export default function AdminInquiriesHub({
  schoolInquiries,
  partnershipInquiries,
  partnershipLoadError,
}: AdminInquiriesHubProps) {
  const [tab, setTab] = useState<InquiryTab>("school");

  const schoolNew = schoolInquiries.filter((i) => i.status === "new").length;
  const partnershipNew = partnershipInquiries.filter((i) => i.status === "new").length;

  const tabs: { id: InquiryTab; label: string; count: number; hint: string }[] = [
    {
      id: "school",
      label: "School Inquiries",
      count: schoolInquiries.length,
      hint: "Join The Journey contact form",
    },
    {
      id: "partnership",
      label: "Partnership Inquiries",
      count: partnershipInquiries.length,
      hint: "Discuss Partnership modal",
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Communications"
        title="Inquiries"
        description="Review school registration messages and partnership requests, then record the follow-up status."
      />

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const newCount = t.id === "school" ? schoolNew : partnershipNew;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-[#0F3A2C] bg-[#0F3A2C] text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              )}
              title={t.hint}
            >
              {t.label}
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  active
                    ? "bg-white/15 text-white"
                    : newCount > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-zinc-100 text-zinc-600"
                )}
              >
                {newCount > 0 ? newCount : t.count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "school" ? (
        <InquiriesPanel inquiries={schoolInquiries} />
      ) : partnershipLoadError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
          <p className="mb-2 font-medium text-rose-800">Could not load partnership inquiries</p>
          <p className="text-sm text-rose-600">{partnershipLoadError}</p>
        </div>
      ) : (
        <PartnershipInquiriesPanel inquiries={partnershipInquiries} />
      )}
    </AdminPage>
  );
}
