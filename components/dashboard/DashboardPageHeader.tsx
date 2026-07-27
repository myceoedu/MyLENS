import type { ReactNode } from "react";

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a722a]"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {eyebrow}
        </p>
        <h1
          className="font-serif text-3xl font-semibold tracking-tight text-[#10271c] sm:text-[2rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-2 text-sm leading-6 text-zinc-600"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function DashboardEmptyState({
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
    <div className="rounded-[1.5rem] border border-dashed border-[#d9d4c9] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5efe4] text-[#9a722a]">
        {icon}
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-[#10271c]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
