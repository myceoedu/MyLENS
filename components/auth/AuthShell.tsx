import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellVariant = "light" | "workspace";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  variant = "light",
  headlineAccent,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: AuthShellVariant;
  /** Optional italic gold segment appended to the serif headline (workspace variant). */
  headlineAccent?: string;
}) {
  if (variant === "workspace") {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#FAF9F5] px-4 py-16">
        {/* Soft corner vignette + paper grain */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,transparent_55%,rgba(5,27,16,0.04)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="mb-2 block font-mono text-[10px] tracking-[0.35em] text-[#B68A35]">
              MYLENS LMS
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0B130F] sm:text-[2rem]">
              {title}
              {headlineAccent && (
                <>
                  {" "}
                  <span className="font-normal italic text-[#B68A35]">{headlineAccent}</span>
                </>
              )}
            </h1>
            {subtitle && (
              <p className="mt-3 text-xs leading-relaxed text-[#5A655F]">{subtitle}</p>
            )}
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(5,27,16,0.08)]">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-[#5A655F]">{footer}</div>
          )}

          <p className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-[#0B130F]/70 transition-colors duration-300 hover:text-[#B68A35]"
            >
              ← Back to MyLENS public site
            </Link>
          </p>

          <p
            className="mt-10 text-center font-mono text-[10px] tracking-widest text-black/40"
            aria-hidden
          >
            SYSTEM STATUS: ONLINE // ENCRYPTED LMS COMMAND v2.6
          </p>
        </div>
      </main>
    );
  }

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
