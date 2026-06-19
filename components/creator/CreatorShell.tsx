import type { ReactNode } from "react";

export function CreatorShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-[#e8dcc8]/90 shadow-md shadow-[#2d4a3e]/8"
    >
      {/* Warm Malaysian golden-hour base */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#fef9f3] via-[#faf6ee] to-[#f3ebe0] pointer-events-none"
        aria-hidden="true"
      />
      {/* Sunset wash — top-right */}
      <div
        className="absolute top-0 right-0 w-[70%] h-[55%] bg-gradient-to-bl from-amber-200/25 via-orange-100/12 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Rainforest depth — bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-gradient-to-tr from-emerald-900/6 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Batik heritage texture */}
      <div
        className="absolute inset-0 bg-[url('/images/batik.jpg')] bg-cover bg-center opacity-[0.022] pointer-events-none filter grayscale mix-blend-multiply"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
