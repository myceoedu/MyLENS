import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Film,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { AdminCard, adminTone, type AdminTone } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

interface AdminAttentionPanelProps {
  pendingCreators: number;
  newInquiries: number;
  pendingSubmissions?: number;
  pendingLearningTasks?: number;
}

export default function AdminAttentionPanel({
  pendingCreators,
  newInquiries,
  pendingSubmissions = 0,
  pendingLearningTasks = 0,
}: AdminAttentionPanelProps) {
  const items = [
    pendingSubmissions > 0
      ? {
          count: pendingSubmissions,
          title: `Video submission${pendingSubmissions === 1 ? "" : "s"} awaiting review`,
          description: "Watch entries, request edits, or approve them.",
          href: "/dashboard/admin/submissions",
          label: "Review submissions",
          icon: Film,
          tone: "brass" as AdminTone,
        }
      : null,
    pendingLearningTasks > 0
      ? {
          count: pendingLearningTasks,
          title: `Assignment${pendingLearningTasks === 1 ? "" : "s"} awaiting review`,
          description: "Check skill assignments and mark lessons complete.",
          href: "/dashboard/admin/learning/tasks",
          label: "Review tasks",
          icon: ClipboardList,
          tone: "forest" as AdminTone,
        }
      : null,
    pendingCreators > 0
      ? {
          count: pendingCreators,
          title: `Creator account${pendingCreators === 1 ? "" : "s"} awaiting approval`,
          description: "Activate verified creators so they can join their school workspace.",
          href: "/dashboard/admin/users/pending",
          label: "Review approvals",
          icon: UserCheck,
          tone: "amber" as AdminTone,
        }
      : null,
    newInquiries > 0
      ? {
          count: newInquiries,
          title: `New inquir${newInquiries === 1 ? "y" : "ies"}`,
          description: "Respond to school and partnership enquiries.",
          href: "/dashboard/admin/inquiries",
          label: "Open inquiries",
          icon: MessageSquare,
          tone: "sky" as AdminTone,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">Needs your attention</h2>
        {items.length > 0 && (
          <span className="text-xs text-zinc-500">
            {items.length} queue{items.length === 1 ? "" : "s"} open
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <AdminCard className="flex items-center gap-3 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-900">Everything is up to date</p>
            <p className="text-sm text-zinc-500">
              No submissions, tasks, approvals, or inquiries are waiting.
            </p>
          </div>
        </AdminCard>
      ) : (
        <AdminCard>
          <ul className="divide-y divide-zinc-100">
            {items.map(({ count, title, description, href, label, icon: Icon, tone }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50/70"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      adminTone[tone].icon
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold tabular-nums text-zinc-900">
                        {count}
                      </span>
                      <span className="text-sm font-medium text-zinc-900">{title}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-zinc-500">{description}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F3A2C]">
                    {label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </section>
  );
}
