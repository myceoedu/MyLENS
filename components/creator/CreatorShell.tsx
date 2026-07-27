import type { ReactNode } from "react";

export function CreatorShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#dfd9cd] bg-[#fbfbf8] shadow-[0_18px_45px_-36px_rgba(16,39,28,0.42)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(247,247,243,0.96))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[34%] w-[46%] bg-[radial-gradient(circle_at_top_right,rgba(182,138,53,0.1),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[30%] w-[35%] bg-[radial-gradient(circle_at_bottom_left,rgba(16,39,28,0.05),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
