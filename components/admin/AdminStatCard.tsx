import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, School, Users } from "lucide-react";
import { adminTone, type AdminTone } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

type StatVariant = "schools" | "active" | "pending" | "creators";

const VARIANTS: Record<StatVariant, { icon: typeof School; tone: AdminTone }> = {
  schools: { icon: School, tone: "neutral" },
  active: { icon: CheckCircle2, tone: "emerald" },
  pending: { icon: Clock3, tone: "amber" },
  creators: { icon: Users, tone: "forest" },
};

export default function AdminStatCard({
  label,
  value,
  hint,
  href,
  variant = "schools",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  variant?: StatVariant;
}) {
  const { icon: Icon, tone } = VARIANTS[variant];
  const numeric = typeof value === "number" ? value : Number.parseInt(String(value), 10) || 0;
  const muted = variant === "pending" && numeric === 0;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            muted ? adminTone.neutral.icon : adminTone[tone].icon
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className={cn(
          "mt-4 text-4xl font-semibold tabular-nums tracking-tight",
          muted ? "text-zinc-300" : adminTone[tone].value
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors group-hover:text-[#0F3A2C]">
          View
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      )}
    </>
  );

  const className =
    "group block rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300";

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
