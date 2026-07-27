import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCurrentProfile } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.status !== "active") {
    redirect("/login?error=account_inactive");
  }

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-emerald-950">
      <header className="sticky top-0 z-40 border-b border-[#dedbd2] bg-[#fbfbf8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center min-w-0">
            <Link
              href="/dashboard"
              className="mr-5 hidden shrink-0 border-r border-[#dedbd2] pr-5 sm:block"
              aria-label="MyLENS dashboard home"
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a722a]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                MyLENS
              </p>
              <p
                className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-zinc-400"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Workspace
              </p>
            </Link>
            <p className="min-w-0 truncate" style={{ fontFamily: "var(--font-inter)" }}>
              <span className="text-sm font-semibold text-[#10271c]">
                {profile.full_name ?? profile.email}
              </span>
              <span className="ml-2 inline-block rounded-full border border-[#dcd6c8] bg-[#f5f1e9] px-2 py-0.5 align-middle text-[9px] uppercase tracking-[0.13em] text-[#706452]">
                {profile.role}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-xs font-medium text-zinc-500 transition-colors hover:text-[#10271c] sm:inline"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Public site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}
