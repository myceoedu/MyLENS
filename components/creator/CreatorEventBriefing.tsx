import { MapPin, Users } from "lucide-react";
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
    <section className="border-b border-zinc-200 px-4 py-5 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Creator workspace
          </p>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl">
            Welcome, {creatorName ?? "Creator"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Manage your academy lessons, team, and tourism video submissions.
          </p>
        </div>

        <aside className="min-w-[14rem] border border-zinc-200 bg-white p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Assignment
          </p>
          <div className="mt-3 space-y-3 text-zinc-600">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <span>
                {schoolName ?? "School pending"}
                {stateLabel ? ` · ${stateLabel}` : ""}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <span>
                {teamCount}/{MAX_CREATORS_PER_SCHOOL} creator places
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
