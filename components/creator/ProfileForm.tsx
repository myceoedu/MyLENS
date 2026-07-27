"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateCreatorProfileAction } from "@/lib/creator/actions";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  schoolName: string | null;
  stateLabel: string | null;
}

export default function ProfileForm({ profile, schoolName, stateLabel }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateCreatorProfileAction, null);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [saved, setSaved] = useState(false);

  // Derive `saved` from the action result as it changes, per React's
  // "adjusting state during render" pattern — avoids the extra render pass
  // (and lint warning) that comes from calling setState inside an effect.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setSaved(state?.ok ?? false);
  }

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  return (
    <form action={action} className="space-y-6 max-w-xl">
      {state && !state.ok && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </div>
      )}

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile saved successfully.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={AUTH_LABEL_CLASS}>School</label>
          <input
            type="text"
            readOnly
            value={schoolName ?? "Not assigned"}
            className={AUTH_INPUT_CLASS + " bg-zinc-100/80 cursor-not-allowed"}
          />
        </div>
        <div>
          <label className={AUTH_LABEL_CLASS}>State</label>
          <input
            type="text"
            readOnly
            value={stateLabel ?? "—"}
            className={AUTH_INPUT_CLASS + " bg-zinc-100/80 cursor-not-allowed"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <input
          id="email"
          type="email"
          readOnly
          value={profile.email}
          className={AUTH_INPUT_CLASS + " bg-zinc-100/80 cursor-not-allowed"}
        />
      </div>

      <div>
        <label htmlFor="full_name" className={AUTH_LABEL_CLASS}>
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={AUTH_INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="avatar_url" className={AUTH_LABEL_CLASS}>
          Profile Photo URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          className={AUTH_INPUT_CLASS}
        />
        <p className="text-xs text-zinc-500 mt-1.5">Paste a link to your profile image (optional).</p>
      </div>

      <div>
        <label htmlFor="bio" className={AUTH_LABEL_CLASS}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short intro about you and your passion for Malaysian tourism storytelling…"
          className={AUTH_INPUT_CLASS + " resize-y min-h-[100px]"}
        />
        <p className="text-xs text-zinc-500 mt-1.5 text-right">{bio.length}/500</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Profile
          </>
        )}
      </button>
    </form>
  );
}
