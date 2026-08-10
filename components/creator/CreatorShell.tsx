import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, ChevronRight, Home } from "lucide-react";

/** Shared white frame for all creator workspace pages. */
export function CreatorShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      {children}
    </div>
  );
}

export function CreatorBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 px-4 py-3 text-xs text-zinc-500 sm:px-5">
      <Link href="/dashboard/creator" className="inline-flex shrink-0 items-center gap-1 hover:text-zinc-900">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
          {item.href ? (
            <Link href={item.href} className="truncate hover:text-zinc-900">
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-zinc-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function CreatorNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  children: ReactNode;
}) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-800",
  };

  return <div className={`border px-4 py-3 text-sm ${styles[tone]}`}>{children}</div>;
}

/** Compact LMS-style page header used across creator routes. */
export function CreatorPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-4 py-4 sm:px-5">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        {description ? <p className="mt-0.5 text-sm text-zinc-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function CreatorEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-zinc-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-400">
        {icon}
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
