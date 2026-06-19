import { requireRole } from "@/lib/auth/session";
import { getCreatorContext } from "@/lib/creator/queries";
import ProfileForm from "@/components/creator/ProfileForm";
import { CreatorShell } from "@/components/creator/CreatorShell";

export default async function CreatorProfilePage() {
  const profile = await requireRole(["creator"]);
  const ctx = await getCreatorContext(profile);

  return (
    <CreatorShell>
      <div className="p-8 md:p-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-2"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Your Profile
        </p>
        <h1
          className="text-2xl font-bold text-emerald-950 mb-2"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Account Settings
        </h1>
        <p className="text-zinc-600 text-sm mb-8" style={{ fontFamily: "var(--font-inter)" }}>
          Update your display name, photo, and bio. School and state are managed by MyLENS admin.
        </p>
        <ProfileForm
          profile={profile}
          schoolName={ctx.school?.name ?? null}
          stateLabel={ctx.stateLabel}
        />
      </div>
    </CreatorShell>
  );
}
