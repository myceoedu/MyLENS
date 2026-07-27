"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Film, GraduationCap, LayoutDashboard, User, Users } from "lucide-react";

const links = [
  { href: "/dashboard/creator", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/creator/submissions", label: "Submissions", icon: Film },
  { href: "/dashboard/creator/team", label: "Team", icon: Users },
  { href: "/dashboard/creator/learning", label: "Learning", icon: GraduationCap },
  { href: "/dashboard/creator/profile", label: "Profile", icon: User },
];

export default function CreatorNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Creator workspace navigation"
      className="mb-8 -mx-4 overflow-x-auto border-y border-[#dedbd2] bg-[#fbfbf8] px-4 py-2 sm:mx-0 sm:rounded-2xl sm:border sm:px-2"
    >
      <div className="flex min-w-max items-center gap-1">
        <span className="hidden px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9a722a] lg:block">
          Creator
        </span>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[#10271c] text-white shadow-sm"
                : "text-zinc-600 hover:bg-[#f1eee7] hover:text-[#10271c]"
            )}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
