/*import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, UserCheck } from "lucide-react";

interface AdminAttentionPanelProps {
  pendingCreators: number;
  newInquiries: number;
}

export default function AdminAttentionPanel({
  pendingCreators,
  newInquiries,
}: AdminAttentionPanelProps) {
  const items = [
    pendingCreators > 0
      ? {
          title: `${pendingCreators} creator${pendingCreators === 1 ? "" : "s"} awaiting approval`,
          description: "Review account access so approved creators can join their school workspace.",
          href: "/dashboard/admin/users/pending",
          label: "Review creators",
          icon: UserCheck,
        }
      : null,
    newInquiries > 0
      ? {
          title: `${newInquiries} new inquir${newInquiries === 1 ? "y" : "ies"}`,
          description: "Read and respond to school or partnership enquiries.",
          href: "/dashboard/admin/inquiries",
          label: "Open inquiries",
          icon: MessageSquare,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="border-t border-[#dfd9cd] pt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a722a]">
            Attention required
          </p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-[#10271c]">Keep the campaign moving</h2>
        </div>
        {items.length === 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            You are up to date
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map(({ title, description, href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 border border-[#e2ded5] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(16,39,28,0.4)] transition-colors hover:border-[#c8b077]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5efe4] text-[#8d6928]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#10271c]">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-zinc-600">{description}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#10271c]">
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
} */ //original code

import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, UserCheck } from "lucide-react";

interface AdminAttentionPanelProps {
  pendingCreators: number;
  newInquiries: number;
}

export default function AdminAttentionPanel({
  pendingCreators,
  newInquiries,
}: AdminAttentionPanelProps) {
  const items = [
    pendingCreators > 0
      ? {
          title: `${pendingCreators} creator${pendingCreators === 1 ? "" : "s"} awaiting approval`,
          description: "Review account access so approved creators can join their school workspace.",
          href: "/dashboard/admin/users/pending",
          label: "Review creators",
          icon: UserCheck,
        }
      : null,
    newInquiries > 0
      ? {
          title: `${newInquiries} new inquir${newInquiries === 1 ? "y" : "ies"}`,
          description: "Read and respond to school or partnership enquiries.",
          href: "/dashboard/admin/inquiries",
          label: "Open inquiries",
          icon: MessageSquare,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="border-t border-[#dfd9cd] pt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a722a]">
            Attention required
          </p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-[#10271c]">Keep the campaign moving</h2>
        </div>
        {items.length === 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            You are up to date
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map(({ title, description, href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 border border-[#e2ded5] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(16,39,28,0.4)] transition-colors hover:border-[#c8b077]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5efe4] text-[#8d6928]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#10271c]">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-zinc-600">{description}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#10271c]">
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}


