import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#fafaf7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p
            className="text-emerald-800 tracking-widest font-semibold text-xs uppercase mb-2 block"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            MyLENS LMS
          </p>
          <h1
            className="text-3xl font-bold text-emerald-950 mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-md">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
            {footer}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
          <Link href="/" className="text-emerald-800 hover:text-emerald-950 transition-colors">
            ← Back to MyLENS public site
          </Link>
        </p>
      </div>
    </main>
  );
}
