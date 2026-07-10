import type { ContactInquiry, InquiryStatus } from "@/types/contact-inquiry";

export function formatInquiryDate(iso: string): string {
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function getInquiryStats(inquiries: ContactInquiry[]) {
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

export function inquiriesToCsv(inquiries: ContactInquiry[]): string {
  const header = ["Name", "Email", "School", "Message", "Status", "Submitted"];
  const rows = inquiries.map((i) => [
    i.full_name,
    i.email,
    i.school_name,
    i.message.replace(/"/g, '""'),
    i.status,
    formatInquiryDate(i.created_at),
  ]);

  const escape = (cell: string) => `"${cell}"`;
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export const INQUIRY_STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  contacted: "bg-sky-50 text-sky-800 border-sky-200",
  closed: "bg-zinc-100 text-zinc-600 border-zinc-200",
};
