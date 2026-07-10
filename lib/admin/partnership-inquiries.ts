import type { PartnershipInquiry, InquiryStatus } from "@/types/partnership-inquiry";
import { formatInquiryDate } from "@/lib/admin/inquiries";

export function getPartnershipInquiryStats(inquiries: PartnershipInquiry[]) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  return {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
    thisWeek: inquiries.filter((i) => new Date(i.created_at).getTime() >= weekAgo).length,
  };
}

export function partnershipInquiriesToCsv(inquiries: PartnershipInquiry[]): string {
  const header = [
    "Company",
    "Name",
    "Job Title",
    "Email",
    "Phone",
    "Website",
    "Message",
    "Status",
    "Submitted",
  ];
  const rows = inquiries.map((i) => [
    i.company_name,
    i.full_name,
    i.job_title,
    i.email,
    i.phone,
    i.website ?? "",
    i.message.replace(/"/g, '""'),
    i.status,
    formatInquiryDate(i.created_at),
  ]);

  const escape = (cell: string) => `"${cell}"`;
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

export type { InquiryStatus };
