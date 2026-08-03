import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Film, GraduationCap, MapPin, Users } from "lucide-react";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { MYLENS_LOGO_SRC } from "@/lib/data/campaign-images";

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
    <section className="border border-[#e2ded5] bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:items-end">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src={MYLENS_LOGO_SRC}
              alt="MyLENS"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#B68A35]">
              MyLENS 2026 · Creator workspace
            </p>
          </div>

          <h1 className="max-w-2xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-[#1A2332] sm:text-4xl">
            Welcome, {creatorName ?? "Creator"}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#5A6A7E]">
            Your private workspace for developing and submitting a Malaysian tourism story to the
            national MyLENS programme.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard/creator/submissions"
              className="inline-flex items-center gap-2 bg-[#10271c] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
            >
              <Film className="h-4 w-4" />
              View entries
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/creator/learning"
              className="inline-flex items-center gap-2 border border-[#ddd8ce] bg-[#FAF9F5] px-4 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:border-[#B68A35] hover:text-[#5e471d]"
            >
              <GraduationCap className="h-4 w-4" />
              Creator Academy
            </Link>
          </div>
        </div>

        <aside className="border border-[#e8e2d6] bg-[#FAF9F5] p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#B68A35]">
            Delegate record
          </p>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A35]" />
              <span className="leading-5 text-[#5A6A7E]">
                {schoolName ?? "School assignment pending"}
                {stateLabel ? ` · ${stateLabel}` : ""}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A35]" />
              <span className="leading-5 text-[#5A6A7E]">
                {teamCount}/{MAX_CREATORS_PER_SCHOOL} creator places confirmed
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
