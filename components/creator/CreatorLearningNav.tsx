import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CreatorLearningNav({
  active,
  openTaskCount = 0,
}: {
  active: "lessons" | "tasks";
  openTaskCount?: number;
}) {
  const tabs = [
    {
      href: "/dashboard/creator/learning",
      label: "Lessons",
      key: "lessons" as const,
    },
    {
      href: "/dashboard/creator/learning/tasks",
      label: "My tasks",
      key: "tasks" as const,
      count: openTaskCount,
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 px-4 py-3 sm:px-5">
      {tabs.map(({ href, label, key, count }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-[#0F3A2C] bg-[#0F3A2C] text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
            )}
          >
            {label}
            {typeof count === "number" && count > 0 ? (
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  isActive ? "bg-white/15 text-white" : "bg-[#faf5ea] text-[#8a6c26]"
                )}
              >
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
