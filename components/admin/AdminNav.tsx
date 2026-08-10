"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Film,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  School,
  Users,
} from "lucide-react";

export interface AdminNavCounts {
  submissions?: number;
  inquiries?: number;
  people?: number;
  learning?: number;
}

interface AdminNavLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: keyof AdminNavCounts;
}

const links: AdminNavLink[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/submissions", label: "Submissions", icon: Film, badge: "submissions" },
  { href: "/dashboard/admin/inquiries", label: "Inquiries", icon: MessageSquare, badge: "inquiries" },
  { href: "/dashboard/admin/users", label: "People", icon: Users, badge: "people" },
  { href: "/dashboard/admin/schools", label: "Schools", icon: School },
  { href: "/dashboard/admin/learning", label: "Learning", icon: GraduationCap, badge: "learning" },
];

export default function AdminNav({ counts = {} }: { counts?: AdminNavCounts }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin workspace navigation"
      className="mb-7 -mx-4 overflow-x-auto border-b border-zinc-200 bg-white px-4 sm:mx-0 sm:rounded-xl sm:border sm:px-2 sm:py-1.5"
    >
      <div className="flex min-w-max items-center gap-0.5">
        {links.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          const count = badge ? (counts[badge] ?? 0) : 0;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#0F3A2C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-white" : "text-zinc-400")} />
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                    active ? "bg-white/15 text-white" : "bg-amber-100 text-amber-700"
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
