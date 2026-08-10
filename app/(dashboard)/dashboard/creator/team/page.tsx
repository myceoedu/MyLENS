import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import TeamMemberCard from "@/components/creator/TeamMemberCard";
import TeamInviteToken from "@/components/creator/TeamInviteToken";
import {
  CreatorEmptyState,
  CreatorPageHeader,
  CreatorShell,
} from "@/components/creator/CreatorShell";
import { Users } from "lucide-react";

export default async function CreatorTeamPage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile, { includeTeammates: true });

  return (
    <CreatorShell>
      <CreatorPageHeader
        title="Team"
        description={`${ctx.school?.name ?? "No school assigned"}${ctx.stateLabel ? ` · ${ctx.stateLabel}` : ""} · ${ctx.teamCount}/${MAX_CREATORS_PER_SCHOOL} places`}
      />

      <div className="p-4 sm:p-5">
        <div className="mb-5">
          <TeamInviteToken
            token={ctx.school?.access_token ?? null}
            schoolName={ctx.school?.name ?? null}
          />
        </div>
        {ctx.teammates.length === 0 ? (
          <CreatorEmptyState
            icon={<Users className="h-5 w-5" />}
            title="Your team is still forming"
            description="Approved creators who register with your school access token will appear here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
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
