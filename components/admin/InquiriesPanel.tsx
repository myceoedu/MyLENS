"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteInquiryAction,
  updateInquiryStatusAction,
} from "@/lib/admin/inquiry-actions";
import {
  formatInquiryDate,
  getInquiryStats,
  inquiriesToCsv,
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_STYLES,
} from "@/lib/admin/inquiries";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  AdminCard,
  AdminEmptyState,
  adminButton,
  adminTable,
} from "@/components/admin/AdminUI";
import type { ContactInquiry, InquiryStatus } from "@/types/contact-inquiry";
import { cn } from "@/lib/utils";

type FilterStatus = InquiryStatus | "all";

export default function InquiriesPanel({ inquiries }: { inquiries: ContactInquiry[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = getInquiryStats(inquiries);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!q) return true;
      return (
        row.full_name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.school_name.toLowerCase().includes(q) ||
        row.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, filter, search]);

  const runAction = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  };

  const handleExport = () => {
    const csv = inquiriesToCsv(filtered.length > 0 ? filtered : inquiries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mylens-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterTabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "new", label: "New", count: stats.new },
    { id: "contacted", label: "Contacted", count: stats.contacted },
    { id: "closed", label: "Closed", count: stats.closed },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total inquiries" value={stats.total} hint="All time" />
        <AdminStatCard
          label="New"
          value={stats.new}
          hint="Awaiting your response"
          variant="pending"
        />
        <AdminStatCard label="This week" value={stats.thisWeek} hint="Last 7 days" />
        <AdminStatCard
          label="Contacted"
          value={stats.contacted}
          hint="Follow-up in progress"
          variant="active"
        />
      </div>

      <AdminCard>
        <div className="space-y-4 border-b border-zinc-100 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={filter === tab.id}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    filter === tab.id
                      ? "border-[#0F3A2C] bg-[#0F3A2C] text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                      filter === tab.id ? "bg-white/15" : "bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => router.refresh()}
                disabled={pending}
                className={adminButton.secondary}
              >
                <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={inquiries.length === 0}
                className={adminButton.primary}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, school, or message…"
              className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <AdminEmptyState
            icon={<MessageSquare className="h-5 w-5" />}
            title={inquiries.length === 0 ? "No inquiries yet" : "No matches for this filter"}
            description={
              inquiries.length === 0
                ? "When someone fills in Join The Journey on the homepage, their message will appear here."
                : "Try a different filter or search term."
            }
          />
        ) : (
          <div className={adminTable.wrapper}>
            <table className={adminTable.table}>
              <thead>
                <tr className={adminTable.head}>
                  <th className={adminTable.th}>Name</th>
                  <th className={adminTable.th}>Email</th>
                  <th className={adminTable.th}>School</th>
                  <th className={adminTable.th}>Message</th>
                  <th className={adminTable.th}>Date</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={cn(adminTable.row, "align-top")}>
                    <td className={cn(adminTable.tdStrong, "whitespace-nowrap")}>
                      {row.full_name}
                    </td>
                    <td className={adminTable.td}>
                      <a
                        href={`mailto:${row.email}`}
                        className="inline-flex items-center gap-1.5 text-[#0F3A2C] hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {row.email}
                      </a>
                    </td>
                    <td className={cn(adminTable.td, "max-w-[10rem]")}>{row.school_name}</td>
                    <td className={cn(adminTable.td, "max-w-xs")}>
                      <p className="line-clamp-2">{row.message}</p>
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="mt-1 text-xs font-medium text-[#0F3A2C] hover:underline"
                      >
                        Read full message
                      </button>
                    </td>
                    <td className={cn(adminTable.td, "whitespace-nowrap text-xs text-zinc-500")}>
                      {formatInquiryDate(row.created_at)}
                    </td>
                    <td className={adminTable.td}>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                          INQUIRY_STATUS_STYLES[row.status]
                        )}
                      >
                        {INQUIRY_STATUS_LABELS[row.status]}
                      </span>
                    </td>
                    <td className={adminTable.td}>
                      <div className="flex min-w-[9rem] flex-col items-end gap-2">
                        {row.status === "new" && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              runAction(() => updateInquiryStatusAction(row.id, "contacted"))
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-60"
                          >
                            Mark contacted
                          </button>
                        )}
                        {row.status === "contacted" && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              runAction(() => updateInquiryStatusAction(row.id, "closed"))
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-60"
                          >
                            Mark closed
                          </button>
                        )}
                        {row.status === "closed" && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => runAction(() => updateInquiryStatusAction(row.id, "new"))}
                            className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-60"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => {
                            if (window.confirm("Delete this inquiry permanently?")) {
                              runAction(() => deleteInquiryAction(row.id));
                            }
                          }}
                          className={adminButton.danger}
                        >
                          {pending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{selected.full_name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{selected.school_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <a
              href={`mailto:${selected.email}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#0F3A2C] hover:underline"
            >
              <Mail className="w-4 h-4" />
              {selected.email}
            </a>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Message</p>
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </p>
            <p className="text-xs text-zinc-400 mt-6">{formatInquiryDate(selected.created_at)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
