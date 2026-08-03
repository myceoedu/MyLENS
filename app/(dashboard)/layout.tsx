import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCurrentProfile } from "@/lib/auth/session";
import { MYLENS_LOGO_SRC } from "@/lib/data/campaign-images";

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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A2332]">
      <header className="sticky top-0 z-40 border-b border-[#e2ded5] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center">
            <Link
              href="/dashboard"
              className="mr-5 hidden shrink-0 items-center gap-3 border-r border-[#e2ded5] pr-5 sm:flex"
              aria-label="MyLENS dashboard home"
            >
              <Image
                src={MYLENS_LOGO_SRC}
                alt="MyLENS"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
                priority
              />
              <span>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B68A35]"
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
              </span>
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
