import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import TeamMemberCard from "@/components/creator/TeamMemberCard";
import { CreatorShell } from "@/components/creator/CreatorShell";

export default async function CreatorTeamPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  return (
    <CreatorShell>
      <div className="p-8 md:p-10 space-y-8">
        <section>
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            School Team
          </p>
          <h1
            className="text-2xl font-bold text-emerald-950 mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {ctx.school?.name ?? "No school assigned"}
          </h1>
          <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            {ctx.stateLabel && <span>{ctx.stateLabel} · </span>}
            <span>
              {ctx.teamCount} of {MAX_CREATORS_PER_SCHOOL} creator slots filled
              {ctx.teamCount < MAX_CREATORS_PER_SCHOOL ? " — invite teammates via your school access token." : "."}
            </span>
          </p>
        </section>

        {ctx.teammates.length === 0 ? (
          <p className="text-sm text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
            No teammates visible yet. Once other creators register with your school token and are
            approved, they will appear here.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {ctx.teammates.map((member) => (
              <TeamMemberCard
                key={member.id}
                id={member.id}
                fullName={member.full_name}
                email={member.email}
                avatarUrl={member.avatar_url}
                bio={member.bio}
                isCurrentUser={member.id === profile.id}
              />
            ))}
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
