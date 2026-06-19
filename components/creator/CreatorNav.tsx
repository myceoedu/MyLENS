"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Film, LayoutDashboard, User, Users } from "lucide-react";

const links = [
  { href: "/dashboard/creator", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/creator/submissions", label: "Submissions", icon: Film },
  { href: "/dashboard/creator/team", label: "Team", icon: Users },
  { href: "/dashboard/creator/resources", label: "Resources", icon: BookOpen },
  { href: "/dashboard/creator/profile", label: "Profile", icon: User },
];

export default function CreatorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
              active
                ? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
                : "bg-white text-zinc-700 border-zinc-200/80 hover:border-emerald-200 hover:text-emerald-900"
            )}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
