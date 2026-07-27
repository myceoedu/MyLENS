"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Save, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import { VIDEO_CATEGORIES, CATEGORY_CONFIG } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";
import type { Submission } from "@/types/submission";
import type { SubmissionActionResult } from "@/lib/creator/submission-actions";
import type { StateData } from "@/lib/data/states";

interface SubmissionFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Submission>;
  defaultStateId?: string;
  states: Pick<StateData, "id" | "name">[];
  saveAction: (prev: SubmissionActionResult | null, fd: FormData) => Promise<SubmissionActionResult>;
  onSubmitForReview?: () => void;
  submittingForReview?: boolean;
  isWindowClosed?: boolean;
}

export default function SubmissionForm({
  defaultValues,
  defaultStateId,
  states,
  saveAction,
  onSubmitForReview,
  submittingForReview,
  isWindowClosed,
}: SubmissionFormProps) {
  const [state, formAction, saving] = useActionState(saveAction, null);
  const [saved, setSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>(
    (defaultValues?.category as VideoCategory) ?? "Nature"
  );

  const formRef = useRef<HTMLFormElement>(null);

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
    const t = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
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
          Draft saved successfully.
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={AUTH_LABEL_CLASS}>
          Story Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={defaultValues?.title ?? ""}
          placeholder='e.g. "Sunrise over Cameron Highlands Tea Hills"'
          className={AUTH_INPUT_CLASS}
        />
      </div>

      {/* Category pills */}
      <div>
        <p className={AUTH_LABEL_CLASS}>Tourism Category</p>
        <div className="flex flex-wrap gap-2">
          {VIDEO_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const active = selectedCategory === cat;
            return (
              <label
                key={cat}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all select-none",
                  active
                    ? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-700 hover:border-emerald-200"
                )}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={active}
                  onChange={() => setSelectedCategory(cat)}
                  className="sr-only"
                />
                <span className="font-mono text-[9px] font-semibold tracking-[0.08em]">
                  {cfg.code}
                </span>
                {cat}
              </label>
            );
          })}
        </div>
      </div>

      {/* Location + State row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className={AUTH_LABEL_CLASS}>
            Filming Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={defaultValues?.location ?? ""}
            placeholder='e.g. "Batu Caves, Selangor"'
            className={AUTH_INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="state_id" className={AUTH_LABEL_CLASS}>
            State
          </label>
          <select
            id="state_id"
            name="state_id"
            required
            defaultValue={defaultValues?.state_id ?? defaultStateId ?? ""}
            className={AUTH_INPUT_CLASS}
          >
            <option value="">Select state…</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={AUTH_LABEL_CLASS}>
          Story Description{" "}
          <span className="text-zinc-400 normal-case font-normal tracking-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Describe your tourism story — what makes this destination special, who or what your video features…"
          className={cn(AUTH_INPUT_CLASS, "resize-y min-h-[100px]")}
        />
      </div>

      {/* Video URL */}
      <div>
        <label htmlFor="video_url" className={AUTH_LABEL_CLASS}>
          Video Link{" "}
          <span className="text-zinc-400 normal-case font-normal tracking-normal">(optional)</span>
        </label>
        <input
          id="video_url"
          name="video_url"
          type="url"
          defaultValue={defaultValues?.video_url ?? ""}
          placeholder="https://drive.google.com/…  or  https://youtu.be/…"
          className={AUTH_INPUT_CLASS}
        />
        <p className="text-xs text-zinc-500 mt-1.5" style={{ fontFamily: "var(--font-inter)" }}>
          Paste a shareable link to your 45-second video (Google Drive, YouTube, OneDrive). File
          upload arrives in a later update.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Draft
            </>
          )}
        </button>

        {onSubmitForReview && (
          <button
            type="button"
            disabled={submittingForReview || isWindowClosed}
            onClick={onSubmitForReview}
            className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {submittingForReview ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <SendHorizonal className="w-4 h-4" />
                Submit for Review
              </>
            )}
          </button>
        )}

        {isWindowClosed && (
          <p className="text-xs text-red-600" style={{ fontFamily: "var(--font-inter)" }}>
            Submission window is closed.
          </p>
        )}
      </div>
    </form>
  );
}
