import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import ProfileForm from "@/components/creator/ProfileForm";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export default async function CreatorProfilePage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  return (
    <CreatorShell>
      <div className="p-6 sm:p-8 md:p-10">
        <DashboardPageHeader
          eyebrow="Creator profile"
          title="Account settings"
          description="Update your display name, portrait, and bio. School and state assignment are managed by MyLENS."
        />
        <div className="mt-8 border-t border-[#dfd9cd] pt-8">
        <ProfileForm
          profile={profile}
          schoolName={ctx.school?.name ?? null}
          stateLabel={ctx.stateLabel}
        />
        </div>
      </div>
    </CreatorShell>
  );
}
