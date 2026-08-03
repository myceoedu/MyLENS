import type { ReactNode } from "react";

export function CreatorShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e2ded5] bg-[#FAF9F5] shadow-[0_16px_40px_-34px_rgba(26,35,50,0.28)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B68A35]/45 to-transparent"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
