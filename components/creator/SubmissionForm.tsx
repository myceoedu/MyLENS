"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, ExternalLink, Loader2, Save, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import { VIDEO_CATEGORIES, CATEGORY_CONFIG } from "@/types/submission";
import { extractYouTubeId, getYouTubeThumbnailUrl } from "@/lib/youtube";
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
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [location, setLocation] = useState(defaultValues?.location ?? "");
  const [stateId, setStateId] = useState(defaultValues?.state_id ?? defaultStateId ?? "");
  const [videoUrl, setVideoUrl] = useState(defaultValues?.video_url ?? "");

  const formRef = useRef<HTMLFormElement>(null);
  const cleanVideoUrl = videoUrl.trim();
  const validVideoUrl = !cleanVideoUrl || /^https?:\/\//i.test(cleanVideoUrl);
  const youtubeId = validVideoUrl && cleanVideoUrl ? extractYouTubeId(cleanVideoUrl) : null;
  const checklist = [
    { label: "Story title", complete: Boolean(title.trim()) },
    { label: "Category", complete: Boolean(selectedCategory) },
    { label: "Filming location", complete: Boolean(location.trim()) },
    { label: "State", complete: Boolean(stateId) },
    { label: "Video link", complete: Boolean(cleanVideoUrl) && validVideoUrl },
  ];

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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
            value={location}
            onChange={(event) => setLocation(event.target.value)}
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
            value={stateId}
            onChange={(event) => setStateId(event.target.value)}
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
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://drive.google.com/…  or  https://youtu.be/…"
          className={AUTH_INPUT_CLASS}
        />
        <p className="text-xs text-zinc-500 mt-1.5" style={{ fontFamily: "var(--font-inter)" }}>
          Paste a shareable link to your 45-second video (Google Drive, YouTube, OneDrive). File
          upload arrives in a later update.
        </p>
        {!validVideoUrl ? (
          <p className="mt-1.5 text-xs text-red-600">Video link must start with http:// or https://.</p>
        ) : null}
        {youtubeId ? (
          <div className="mt-3 max-w-sm overflow-hidden border border-zinc-200 bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getYouTubeThumbnailUrl(youtubeId)}
              alt="Video link preview"
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
            <p className="border-t border-white/10 px-3 py-2 text-xs text-white">YouTube preview ready</p>
          </div>
        ) : cleanVideoUrl && validVideoUrl ? (
          <a
            href={cleanVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline"
          >
            Test video link <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>

      <section className="border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
          Ready-to-submit checklist
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-xs text-zinc-600">
              {item.complete ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-zinc-300" />
              )}
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
        className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:opacity-60"
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
            className="inline-flex items-center gap-2 bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
