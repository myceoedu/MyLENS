"use client";

import { useMemo, useState, useTransition } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Circle,
  ExternalLink,
  FileText,
  PlayCircle,
  Video,
} from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";
import {
  LEARNING_CONTENT_LABELS,
  type LearningItem,
  type LearningModule,
} from "@/types/learning";
import { cn } from "@/lib/utils";
import { setLearningItemCompletionAction } from "@/lib/learning/actions";

const contentIcons = {
  live_class: CalendarDays,
  recorded_video: Video,
  document: FileText,
  external_link: ExternalLink,
};

function malaysiaDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

function extractVimeoId(url: string) {
  return url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null;
}

function ContentViewer({ item }: { item: LearningItem }) {
  const resolvedUrl = item.resolved_url ?? item.content_url;
  const youtubeId = item.content_url ? extractYouTubeId(item.content_url) : null;
  const vimeoId = item.content_url ? extractVimeoId(item.content_url) : null;

  if (item.content_type === "recorded_video") {
    if (!resolvedUrl) {
      return <p className="text-sm text-zinc-500">This recording is temporarily unavailable.</p>;
    }

    return (
      <div className="space-y-5">
        <div className="aspect-video overflow-hidden rounded-2xl bg-[#071a10]">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          ) : vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title={item.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <video src={resolvedUrl} controls preload="metadata" className="h-full w-full bg-black" />
          )}
        </div>
      </div>
    );
  }

  if (item.content_type === "live_class") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Scheduled online class
            </p>
            {item.starts_at && (
              <p className="mt-2 font-semibold text-emerald-950">
                {malaysiaDate(item.starts_at)}
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-500">Malaysia time (MYT)</p>
          </div>
        </div>
        {resolvedUrl && (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Join online class
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  if (item.content_type === "document") {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
        <FileText className="mx-auto h-10 w-10 text-emerald-800" />
        <p className="mt-3 text-sm text-zinc-600">
          Open this learning material in a new tab to read or download it.
        </p>
        {resolvedUrl && (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Open document
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  return resolvedUrl ? (
    <a
      href={resolvedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800"
    >
      Open learning resource
      <ExternalLink className="h-4 w-4" />
    </a>
  ) : (
    <p className="text-sm text-zinc-500">This resource is temporarily unavailable.</p>
  );
}

export default function LearningHub({
  modules,
  completedItemIds,
}: {
  modules: LearningModule[];
  completedItemIds: string[];
}) {
  const allItems = useMemo(() => modules.flatMap((module) => module.items), [modules]);
  const [selectedId, setSelectedId] = useState<string | null>(allItems[0]?.id ?? null);
  const [completedIds, setCompletedIds] = useState(() => new Set(completedItemIds));
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedItem = allItems.find((item) => item.id === selectedId) ?? allItems[0] ?? null;
  const selectedModule = modules.find((module) =>
    module.items.some((item) => item.id === selectedItem?.id)
  );
  const completedCount = allItems.filter((item) => completedIds.has(item.id)).length;
  const completionPercent = Math.round((completedCount / allItems.length) * 100);

  function toggleCompletion(itemId: string) {
    const wasCompleted = completedIds.has(itemId);
    setCompletionError(null);
    setCompletedIds((current) => {
      const next = new Set(current);
      if (wasCompleted) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

    startTransition(async () => {
      const result = await setLearningItemCompletionAction(itemId, !wasCompleted);
      if (!result.ok) {
        setCompletedIds((current) => {
          const next = new Set(current);
          if (wasCompleted) next.add(itemId);
          else next.delete(itemId);
          return next;
        });
        setCompletionError(result.error);
      }
    });
  }

  if (modules.length === 0 || allItems.length === 0) {
    return (
      <div className="border border-dashed border-[#ddd8ce] bg-white px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#e8dfc4] bg-[#FAF9F5]">
          <BookOpen className="h-6 w-6 text-[#B68A35]" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-[#1A2332]">
          The academy opens soon
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5A6A7E]">
          Your administrator has not published any creator training yet.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden border border-[#e2ded5] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2ded5] px-6 py-5 md:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B68A35]">
            Academy curriculum
          </p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-[#1A2332]">
            Learning workspace
          </h2>
        </div>
        <div className="min-w-36">
          <p className="text-right text-xs font-medium text-[#5A6A7E]">
            {completionPercent}% complete
          </p>
          <div className="mt-2 h-1 overflow-hidden bg-[#f0ebe1]">
            <div
              className="h-full bg-[#B68A35] transition-[width] duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:min-h-[620px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-[#e2ded5] bg-[#FAF9F5] lg:border-r lg:border-b-0">
          <div className="space-y-1 p-3 sm:p-4 lg:max-h-[620px] lg:overflow-y-auto">
            {modules.map((module, moduleIndex) => (
              <section key={module.id} className="overflow-hidden">
                <div className="flex items-start gap-3 px-3 pb-2 pt-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#e8dfc4] bg-white font-serif text-xs font-semibold text-[#B68A35]">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-sm font-semibold leading-snug text-[#1A2332]">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8A98B0]">
                      {module.items.length} {module.items.length === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 pb-3 pl-5">
                  {module.items.map((item, itemIndex) => {
                    const Icon = contentIcons[item.content_type];
                    const active = selectedItem?.id === item.id;
                    const complete = completedIds.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={cn(
                          "relative flex w-full items-start gap-3 py-3 pr-3 pl-7 text-left transition-colors duration-200",
                          active
                            ? "bg-white text-[#1A2332] ring-1 ring-[#B68A35]/40"
                            : "text-[#5A6A7E] hover:bg-white hover:text-[#1A2332]"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute left-2.5 top-4 font-mono text-[9px]",
                            active ? "text-[#B68A35]" : "text-zinc-300"
                          )}
                        >
                          {itemIndex + 1}
                        </span>
                        <Icon
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            active ? "text-[#B68A35]" : "text-zinc-400"
                          )}
                        />
                        <span className="min-w-0">
                          <span className="flex items-start gap-2 text-[13px] font-medium leading-snug">
                            <span>{item.title}</span>
                            {complete && (
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                                aria-label="Completed"
                              />
                            )}
                          </span>
                          <span
                            className={cn(
                              "mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em]",
                              active ? "text-[#B68A35]" : "text-zinc-400"
                            )}
                          >
                            {LEARNING_CONTENT_LABELS[item.content_type]}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        {selectedItem && (
          <article className="min-w-0 bg-white">
            <div className="px-6 py-7 md:px-9 md:py-8">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A98B0]">
                <span>{selectedModule?.title}</span>
                <span className="text-[#e2ded5]">/</span>
                <span className="text-[#B68A35]">
                  {LEARNING_CONTENT_LABELS[selectedItem.content_type]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-3xl">
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-[#1A2332] sm:text-3xl">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.description && (
                    <p className="mt-3 text-sm leading-7 text-[#5A6A7E]">
                      {selectedItem.description}
                    </p>
                  )}
                </div>
                {selectedItem.duration_minutes && (
                  <span className="inline-flex shrink-0 items-center gap-2 border border-[#e2ded5] bg-[#FAF9F5] px-3 py-1.5 text-[11px] text-[#5A6A7E]">
                    <Clock3 className="h-3.5 w-3.5 text-[#B68A35]" />
                    {selectedItem.duration_minutes} min
                  </span>
                )}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleCompletion(selectedItem.id)}
                  disabled={isPending}
                  className={cn(
                    "inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60",
                    completedIds.has(selectedItem.id)
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-[#ddd8ce] bg-white text-[#1A2332] hover:border-[#B68A35]"
                  )}
                >
                  {completedIds.has(selectedItem.id) ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  {completedIds.has(selectedItem.id) ? "Lesson completed" : "Mark lesson complete"}
                </button>
                {completionError && (
                  <p className="text-xs text-red-700" role="alert">
                    Could not update progress. Please try again.
                  </p>
                )}
              </div>
            </div>

            <div className="border-y border-[#e2ded5] bg-[#FAF9F5] px-6 py-6 md:px-9 md:py-8">
              <ContentViewer key={selectedItem.id} item={selectedItem} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-9">
              <p className="text-xs leading-5 text-[#8A98B0]">
                Official MyLENS creator learning material
              </p>
              {selectedItem.content_type === "recorded_video" && (
                <p className="flex items-center gap-2 text-xs text-[#8A98B0]">
                  <PlayCircle className="h-4 w-4 text-[#B68A35]" />
                  Full-screen playback available
                </p>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
