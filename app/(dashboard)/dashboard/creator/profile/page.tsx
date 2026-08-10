import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import ProfileForm from "@/components/creator/ProfileForm";
import { CreatorPageHeader, CreatorShell } from "@/components/creator/CreatorShell";

export default async function CreatorProfilePage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  return (
    <CreatorShell>
      <CreatorPageHeader
        title="Profile"
        description="Update your display name, portrait, and bio. School assignment is managed by MyLENS."
      />
      <div className="p-4 sm:p-5">
        <ProfileForm
          profile={profile}
          schoolName={ctx.school?.name ?? null}
          stateLabel={ctx.stateLabel}
        />
      </div>
    </CreatorShell>
  );
}
