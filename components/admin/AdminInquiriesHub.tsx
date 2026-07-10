"use client";

import { useState } from "react";
import InquiriesPanel from "@/components/admin/InquiriesPanel";
import PartnershipInquiriesPanel from "@/components/admin/PartnershipInquiriesPanel";
import type { ContactInquiry } from "@/types/contact-inquiry";
import type { PartnershipInquiry } from "@/types/partnership-inquiry";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-emerald-950"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Inquiries
        </h1>
        <p className="text-zinc-600 text-sm mt-1" style={{ fontFamily: "var(--font-inter)" }}>
          Review school registration messages and corporate partnership requests — reply by email,
          then update status here.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const newCount = t.id === "school" ? schoolNew : partnershipNew;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex flex-col items-start gap-0.5 rounded-2xl border px-5 py-3 text-left transition-all",
                tab === t.id
                  ? "border-emerald-900 bg-emerald-900 text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200"
              )}
            >
              <span className="text-sm font-semibold">{t.label}</span>
              <span
                className={cn(
                  "text-xs",
                  tab === t.id ? "text-white/75" : "text-zinc-500"
                )}
              >
                {t.hint}
                {newCount > 0 && (
                  <span className={cn("ml-2 font-medium", tab === t.id ? "text-amber-200" : "text-amber-700")}>
                    · {newCount} new
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "school" ? (
        <InquiriesPanel inquiries={schoolInquiries} />
      ) : partnershipLoadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-red-800 font-medium mb-2">Could not load partnership inquiries</p>
          <p className="text-sm text-red-600">{partnershipLoadError}</p>
        </div>
      ) : (
        <PartnershipInquiriesPanel inquiries={partnershipInquiries} />
      )}
    </div>
  );
}
