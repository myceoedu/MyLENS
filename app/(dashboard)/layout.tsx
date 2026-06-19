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

  return (
    <div className="min-h-screen bg-[#fafaf7] text-emerald-950">
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center min-w-0">
            <p
              className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mr-5 shrink-0 hidden sm:block"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              MyLENS LMS
            </p>
            <p className="min-w-0 truncate" style={{ fontFamily: "var(--font-inter)" }}>
              <span className="text-zinc-800 font-semibold text-sm">
                {profile.full_name ?? profile.email}
              </span>
              <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ml-2 inline-block align-middle">
                {profile.role}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-emerald-800 hover:text-emerald-950 transition-colors hidden sm:inline"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Public site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
    </div>
  );
}
