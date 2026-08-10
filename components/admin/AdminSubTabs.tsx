import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AdminSubTab {
  href: string;
  label: string;
  count?: number;
  active: boolean;
}

export default function AdminSubTabs({ tabs }: { tabs: AdminSubTab[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tabs.map(({ href, label, count, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "border-[#0F3A2C] bg-[#0F3A2C] text-white"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
          )}
        >
          {label}
          {typeof count === "number" && count > 0 && (
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                active ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-600"
              )}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
