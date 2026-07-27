import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import TeamMemberCard from "@/components/creator/TeamMemberCard";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { DashboardEmptyState, DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Users } from "lucide-react";

export default async function CreatorTeamPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile, { includeTeammates: true });

  return (
    <CreatorShell>
      <div className="space-y-8 p-6 sm:p-8 md:p-10">
        <DashboardPageHeader
          eyebrow="School team"
          title={ctx.school?.name ?? "No school assigned"}
          description={`${ctx.stateLabel ? `${ctx.stateLabel} · ` : ""}${ctx.teamCount} of ${MAX_CREATORS_PER_SCHOOL} creator places filled${ctx.teamCount < MAX_CREATORS_PER_SCHOOL ? ". Share your school access token to invite teammates." : "."}`}
        />

        {ctx.teammates.length === 0 ? (
          <DashboardEmptyState
            icon={<Users className="h-5 w-5" />}
            title="Your team is still forming"
            description="Approved creators who register with your school access token will appear here."
          />
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
