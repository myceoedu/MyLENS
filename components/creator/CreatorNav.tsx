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
      className="sticky top-3 z-20 mb-6 overflow-x-auto border border-zinc-200 bg-white px-2 py-2 shadow-sm"
    >
      <div className="flex min-w-max items-center gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
