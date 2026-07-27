import Link from "next/link";
import { ArrowUpRight, Film, GraduationCap, MapPin, Users } from "lucide-react";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";

interface CreatorEventBriefingProps {
  creatorName: string | null;
  schoolName: string | null;
  stateLabel: string | null;
  teamCount: number;
}

export default function CreatorEventBriefing({
  creatorName,
  schoolName,
  stateLabel,
  teamCount,
}: CreatorEventBriefingProps) {
  return (
    <section className="relative overflow-hidden border border-[#1f4733] bg-[#0a2619] px-6 py-8 text-white shadow-[0_24px_60px_-34px_rgba(6,36,25,0.8)] sm:px-8 sm:py-10 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(188,148,68,0.34),transparent_29%),linear-gradient(120deg,rgba(255,255,255,0.05),transparent_44%)]"
        aria-hidden
      />
      <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#e4c784]">
            MyLENS 2026 · Creator delegate
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-[1.06] tracking-tight sm:text-4xl">
            Welcome, {creatorName ?? "Creator"}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
            Your private workspace for developing and submitting a Malaysian tourism story to the
            national MyLENS programme.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard/creator/submissions"
              className="inline-flex items-center gap-2 bg-[#e4c784] px-4 py-2.5 text-sm font-semibold text-[#0a2619] transition-colors hover:bg-[#f4ddb0]"
            >
              <Film className="h-4 w-4" />
              View entries
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/creator/learning"
              className="inline-flex items-center gap-2 border border-white/25 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#0a2619]"
            >
              <GraduationCap className="h-4 w-4" />
              Creator Academy
            </Link>
          </div>
        </div>

        <aside className="border border-white/15 bg-black/10 p-5 backdrop-blur-sm">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#e4c784]">
            Delegate record
          </p>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e4c784]" />
              <span className="leading-5 text-white/75">
                {schoolName ?? "School assignment pending"}
                {stateLabel ? ` · ${stateLabel}` : ""}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#e4c784]" />
              <span className="leading-5 text-white/75">
                {teamCount}/{MAX_CREATORS_PER_SCHOOL} creator places confirmed
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
