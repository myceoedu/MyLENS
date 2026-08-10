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
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total inquiries" value={stats.total} hint="All time" />
        <AdminStatCard
          label="New"
          value={stats.new}
          hint="Awaiting your response"
          variant="pending"
        />
        <AdminStatCard label="This week" value={stats.thisWeek} hint="Last 7 days" />
        <AdminStatCard label="Contacted" value={stats.contacted} hint="Follow-up in progress" />
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                    filter === tab.id
                                          ? "bg-sky-900 text-white border-sky-900"
                                          : "bg-white text-zinc-600 border-zinc-200 hover:border-sky-200 hover:text-sky-900"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-md",
                      filter === tab.id ? "bg-white/15" : "bg-zinc-100"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-700 hover:border-zinc-300 disabled:opacity-60"
              >
                <RefreshCw className={cn("w-4 h-4", pending && "animate-spin")} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={inquiries.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-sky-900 text-white hover:bg-sky-800 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, school, or message…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-sky-300 focus:ring-1 focus:ring-sky-200 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-800 font-medium mb-1">
              {inquiries.length === 0 ? "No inquiries yet" : "No matches for this filter"}
            </p>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              {inquiries.length === 0
                ? "When someone fills in Join The Journey on the homepage, their message will appear here."
                : "Try a different filter or search term."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left">
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    School
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    Message
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-sky-700 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/40 align-top">
                    <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
                      {row.full_name}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-sky-800 hover:underline inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {row.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 max-w-[10rem]">{row.school_name}</td>
                    <td className="px-6 py-4 text-zinc-600 max-w-xs">
                      <p className="line-clamp-2">{row.message}</p>
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="mt-1 text-xs font-medium text-sky-800 hover:underline"
                      >
                        Read full message
                      </button>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap text-xs">
                      {formatInquiryDate(row.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border",
                          INQUIRY_STATUS_STYLES[row.status]
                        )}
                      >
                        {INQUIRY_STATUS_LABELS[row.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end gap-2 min-w-[9rem]">
                        {row.status === "new" && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              runAction(() => updateInquiryStatusAction(row.id, "contacted"))
                            }
                            className="text-xs font-medium text-sky-800 border border-sky-200 rounded-lg px-3 py-1.5 hover:bg-sky-50 disabled:opacity-60"
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
                            className="text-xs font-medium text-zinc-700 border border-zinc-200 rounded-lg px-3 py-1.5 hover:bg-zinc-50 disabled:opacity-60"
                          >
                            Mark closed
                          </button>
                        )}
                        {row.status === "closed" && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              runAction(() => updateInquiryStatusAction(row.id, "new"))
                            }
                            className="text-xs font-medium text-amber-800 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-50 disabled:opacity-60"
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
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 disabled:opacity-60"
                        >
                          {pending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
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
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8"
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
              className="inline-flex items-center gap-2 text-sm text-emerald-800 font-medium mb-4 hover:underline"
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
