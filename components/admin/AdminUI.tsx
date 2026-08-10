import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin design tokens.
 *
 * Palette   ink #111827 · body #4B5563 · muted #9CA3AF · hairline #E8E6E1
 *           canvas #F7F7F5 · surface #FFFFFF
 *           forest #0F3A2C (primary action) · brass #B08D3F (accent)
 * Type      Cormorant Garamond for page titles only, Inter for all UI text,
 *           tabular numerals for every metric so columns stay aligned.
 */
export const adminTone = {
  neutral: {
    chip: "border-zinc-200 bg-zinc-50 text-zinc-600",
    icon: "bg-zinc-100 text-zinc-500",
    value: "text-zinc-900",
  },
  forest: {
    chip: "border-[#c9dbd2] bg-[#eef5f1] text-[#0F3A2C]",
    icon: "bg-[#eef5f1] text-[#0F3A2C]",
    value: "text-[#0F3A2C]",
  },
  brass: {
    chip: "border-[#e8dcc0] bg-[#faf5ea] text-[#8a6c26]",
    icon: "bg-[#faf5ea] text-[#B08D3F]",
    value: "text-[#8a6c26]",
  },
  amber: {
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    icon: "bg-amber-50 text-amber-600",
    value: "text-amber-600",
  },
  emerald: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-700",
  },
  rose: {
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    icon: "bg-rose-50 text-rose-600",
    value: "text-rose-700",
  },
  sky: {
    chip: "border-sky-200 bg-sky-50 text-sky-700",
    icon: "bg-sky-50 text-sky-600",
    value: "text-sky-700",
  },
} as const;

export type AdminTone = keyof typeof adminTone;

export const adminButton = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F3A2C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#175a44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3A2C]/30 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60",
} as const;

export const adminField =
  "w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10";

export const adminTable = {
  wrapper: "overflow-x-auto",
  table: "w-full text-sm tabular-nums",
  head: "border-b border-zinc-200 bg-zinc-50/70 text-left",
  th: "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500",
  row: "border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/60",
  td: "px-5 py-4 align-middle text-zinc-600",
  tdStrong: "px-5 py-4 align-middle font-medium text-zinc-900",
} as const;

export function AdminPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B08D3F]">
            {eyebrow}
          </p>
        )}
        <h1
          className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-zinc-900 sm:text-[2rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function AdminCard({
  children,
  className,
  padded = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white",
        padded && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: AdminTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        adminTone[tone].chip,
        className
      )}
    >
      {children}
    </span>
  );
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      {icon && (
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
          {icon}
        </div>
      )}
      <p className="mt-4 text-sm font-semibold text-zinc-900">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function AdminBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-zinc-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-zinc-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
