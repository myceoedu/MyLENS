"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  FileText,
  List,
  PlayCircle,
  Video,
} from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";
import {
  LEARNING_CONTENT_LABELS,
  type LearningContentType,
  type LearningItem,
  type LearningModule,
} from "@/types/learning";
import { cn } from "@/lib/utils";
import { setLearningItemCompletionAction } from "@/lib/learning/actions";

type BrowseFilter = "all" | LearningContentType;

const TYPE_ORDER: LearningContentType[] = [
  "live_class",
  "recorded_video",
  "document",
  "external_link",
];

const TYPE_META: Record<
  LearningContentType,
  {
    short: string;
    Icon: typeof Video;
    badge: string;
    bar: string;
    soft: string;
  }
> = {
  live_class: {
    short: "Live",
    Icon: CalendarDays,
    badge: "bg-emerald-600 text-white",
    bar: "bg-emerald-600",
    soft: "bg-emerald-50 border-emerald-200",
  },
  recorded_video: {
    short: "Video",
    Icon: Video,
    badge: "bg-slate-800 text-white",
    bar: "bg-slate-800",
    soft: "bg-slate-50 border-slate-200",
  },
  document: {
    short: "Document",
    Icon: FileText,
    badge: "bg-amber-600 text-white",
    bar: "bg-amber-600",
    soft: "bg-amber-50 border-amber-200",
  },
  external_link: {
    short: "Link",
    Icon: ExternalLink,
    badge: "bg-sky-600 text-white",
    bar: "bg-sky-600",
    soft: "bg-sky-50 border-sky-200",
  },
};

function malaysiaDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function malaysiaShortDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function extractVimeoId(url: string) {
  return url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null;
}

function safeExternalHref(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function itemHref(item: LearningItem): string | null {
  return safeExternalHref(item.resolved_url ?? item.content_url);
}

function pickDefaultItem(items: LearningItem[]): string | null {
  const now = Date.now();
  const upcomingLive = items
    .filter(
      (item) =>
        item.content_type === "live_class" &&
        item.starts_at &&
        !Number.isNaN(new Date(item.starts_at).getTime()) &&
        new Date(item.starts_at).getTime() >= now - 2 * 60 * 60 * 1000
    )
    .sort(
      (a, b) =>
        new Date(a.starts_at!).getTime() - new Date(b.starts_at!).getTime()
    )[0];
  return upcomingLive?.id ?? items[0]?.id ?? null;
}

function TypeBadge({ type }: { type: LearningContentType }) {
  const meta = TYPE_META[type];
  const Icon = meta.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        meta.badge
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.short}
    </span>
  );
}

function ContentViewer({ item }: { item: LearningItem }) {
  const resolvedUrl = itemHref(item);
  const youtubeId = item.content_url ? extractYouTubeId(item.content_url) : null;
  const vimeoId = item.content_url ? extractVimeoId(item.content_url) : null;
  const meta = TYPE_META[item.content_type];

  if (item.content_type === "recorded_video") {
    if (!resolvedUrl && !youtubeId && !vimeoId) {
      return (
        <p className="border border-dashed border-zinc-200 bg-white px-5 py-10 text-center text-sm text-zinc-500">
          This recording is temporarily unavailable.
        </p>
      );
    }

    return (
      <div className="overflow-hidden border border-zinc-200 bg-black">
        <div className="aspect-video">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
            />
          ) : vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title={item.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
            />
          ) : (
            <video
              src={resolvedUrl!}
              controls
              preload="metadata"
              className="h-full w-full bg-black"
            />
          )}
        </div>
      </div>
    );
  }

  if (item.content_type === "live_class") {
    const upcoming =
      !item.starts_at ||
      new Date(item.starts_at).getTime() >= Date.now() - 2 * 60 * 60 * 1000;

    return (
      <div className={cn("border p-6", meta.soft)}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-emerald-700 border border-emerald-200">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {upcoming ? "Scheduled live class" : "Past live class"}
            </p>
            {item.starts_at ? (
              <p className="mt-2 text-base font-semibold text-zinc-900">
                {malaysiaDate(item.starts_at)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-600">Schedule will be announced soon.</p>
            )}
            <p className="mt-1 text-xs text-zinc-500">Malaysia time (MYT)</p>
          </div>
        </div>
        {resolvedUrl ? (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Join class
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-5 text-sm text-zinc-600">Join link will appear when ready.</p>
        )}
      </div>
    );
  }

  if (item.content_type === "document") {
    return (
      <div className={cn("border p-6", meta.soft)}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-amber-700 border border-amber-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Document material
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              Open this file in a new tab to read or download.
            </p>
          </div>
        </div>
        {resolvedUrl ? (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-amber-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
          >
            Open document
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-5 text-sm text-zinc-600">Document is not available yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("border p-6", meta.soft)}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-sky-700 border border-sky-200">
          <ExternalLink className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
            External resource
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            Opens an official learning resource outside this page.
          </p>
        </div>
      </div>
      {resolvedUrl ? (
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 bg-sky-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-800"
        >
          Open resource
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : (
        <p className="mt-5 text-sm text-zinc-600">This resource is temporarily unavailable.</p>
      )}
    </div>
  );
}

export default function LearningHub({
  modules,
  completedItemIds,
}: {
  modules: LearningModule[];
  completedItemIds: string[];
}) {
  const allItems = useMemo(() => modules.flatMap((m) => m.items), [modules]);

  const itemById = useMemo(() => {
    const map = new Map<string, LearningItem>();
    for (const item of allItems) map.set(item.id, item);
    return map;
  }, [allItems]);

  const moduleTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const module of modules) map.set(module.id, module.title);
    return map;
  }, [modules]);

  const typeCounts = useMemo(() => {
    const counts: Record<LearningContentType, number> = {
      live_class: 0,
      recorded_video: 0,
      document: 0,
      external_link: 0,
    };
    for (const item of allItems) {
      if (item.content_type in counts) counts[item.content_type] += 1;
    }
    return counts;
  }, [allItems]);

  const availableFilters = useMemo(() => {
    const filters: BrowseFilter[] = ["all"];
    for (const type of TYPE_ORDER) {
      if (typeCounts[type] > 0) filters.push(type);
    }
    return filters;
  }, [typeCounts]);

  const [filter, setFilter] = useState<BrowseFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    pickDefaultItem(allItems)
  );
  const [completedIds, setCompletedIds] = useState(() => new Set(completedItemIds));
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!availableFilters.includes(filter)) setFilter("all");
  }, [availableFilters, filter]);

  useEffect(() => {
    if (selectedId && !itemById.has(selectedId)) {
      setSelectedId(pickDefaultItem(allItems));
    }
  }, [selectedId, itemById, allItems]);

  const filteredModules = useMemo(() => {
    return modules
      .map((module) => ({
        module,
        items: module.items.filter((item) =>
          filter === "all" ? true : item.content_type === filter
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [modules, filter]);

  const filteredItems = useMemo(
    () => filteredModules.flatMap((group) => group.items),
    [filteredModules]
  );

  // Keep selection inside current filter
  useEffect(() => {
    if (!selectedId) return;
    const stillVisible = filteredItems.some((item) => item.id === selectedId);
    if (!stillVisible) {
      setSelectedId(filteredItems[0]?.id ?? null);
    }
  }, [filter, filteredItems, selectedId]);

  const selectedItem = selectedId ? itemById.get(selectedId) ?? null : null;
  const selectedModuleTitle = selectedItem
    ? moduleTitleById.get(selectedItem.module_id) ?? "Module"
    : null;
  const selectedIndex = selectedItem
    ? filteredItems.findIndex((item) => item.id === selectedItem.id)
    : -1;
  const previousItem = selectedIndex > 0 ? filteredItems[selectedIndex - 1] : null;
  const nextItem =
    selectedIndex >= 0 && selectedIndex < filteredItems.length - 1
      ? filteredItems[selectedIndex + 1]
      : null;

  const completedCount = allItems.filter((item) => completedIds.has(item.id)).length;
  const completionPercent =
    allItems.length === 0 ? 0 : Math.round((completedCount / allItems.length) * 100);

  function selectLesson(id: string) {
    if (!itemById.has(id)) return;
    setSelectedId(id);
    setCompletionError(null);
  }

  function toggleCompletion(itemId: string) {
    if (!itemById.has(itemId)) return;
    if (isPending && pendingItemId === itemId) return;

    const wasCompleted = completedIds.has(itemId);
    setCompletionError(null);
    setPendingItemId(itemId);
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
      setPendingItemId(null);
    });
  }

  if (modules.length === 0 || allItems.length === 0) {
    return (
      <div className="border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-zinc-400" />
        <h2 className="mt-4 text-lg font-semibold text-zinc-900">No lessons published yet</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Your administrator has not published training material.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* LMS toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-4 py-4 sm:px-5">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Learning</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {modules.length} modules · {allItems.length} lessons
          </p>
        </div>
        <div className="min-w-[10rem]">
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
            <span>Progress</span>
            <span className="font-medium text-zinc-900">
              {completedCount}/{allItems.length} ({completionPercent}%)
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden bg-zinc-100">
            <div
              className="h-full bg-emerald-600 transition-[width] duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Type filters — primary navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 bg-white px-4 py-3 sm:px-5">
        {availableFilters.map((tab) => {
          const active = filter === tab;
          const count = tab === "all" ? allItems.length : typeCounts[tab];
          const Icon = tab === "all" ? BookOpen : TYPE_META[tab].Icon;
          const label = tab === "all" ? "All lessons" : TYPE_META[tab].short;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setFilter(tab);
                setCompletionError(null);
              }}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              <span
                className={cn(
                  "min-w-5 px-1 text-center text-[11px]",
                  active ? "text-white/80" : "text-zinc-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:min-h-[34rem] lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Curriculum sidebar */}
        <aside className="hidden border-b border-zinc-200 bg-white lg:block lg:border-b-0 lg:border-r">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Course outline
            </p>
          </div>
          <nav
            aria-label="Course outline"
            className="max-h-[28rem] overflow-y-auto lg:max-h-[40rem]"
          >
            {filteredModules.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                No lessons in this filter.
              </p>
            ) : (
              filteredModules.map(({ module, items }, moduleIndex) => (
                <div key={module.id} className="border-b border-zinc-100 last:border-b-0">
                  <div className="flex items-center gap-2 px-4 pb-1 pt-4">
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {String(moduleIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-sm font-semibold text-zinc-900">{module.title}</h2>
                  </div>
                  <ul className="pb-2">
                    {items.map((item) => {
                      const active = selectedItem?.id === item.id;
                      const complete = completedIds.has(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => selectLesson(item.id)}
                            className={cn(
                              "relative flex w-full items-start gap-3 border-l-2 px-4 py-2.5 text-left transition-colors",
                              active
                                ? "border-l-emerald-600 bg-emerald-50/70"
                                : "border-l-transparent hover:bg-zinc-50"
                            )}
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                TYPE_META[item.content_type].bar
                              )}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-2">
                                <span
                                  className={cn(
                                    "text-sm leading-snug",
                                    active
                                      ? "font-semibold text-zinc-900"
                                      : "font-medium text-zinc-700"
                                  )}
                                >
                                  {item.title}
                                </span>
                                {complete ? (
                                  <CheckCircle2
                                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                                    aria-label="Completed"
                                  />
                                ) : null}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-2">
                                <TypeBadge type={item.content_type} />
                                {item.content_type === "live_class" && item.starts_at ? (
                                  <span className="text-[11px] text-zinc-500">
                                    {malaysiaShortDate(item.starts_at)}
                                  </span>
                                ) : null}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </nav>
        </aside>

        {/* Lesson detail */}
        <main className="min-w-0 bg-white">
          {selectedItem ? (
            <div>
              <div
                className={cn("h-1 w-full", TYPE_META[selectedItem.content_type].bar)}
                aria-hidden
              />
              <div className="px-5 py-6 sm:px-7 sm:py-7">
                <div className="mb-4 lg:hidden">
                  <label htmlFor="lesson-picker" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <List className="h-3.5 w-3.5" />
                    Course outline
                  </label>
                  <select
                    id="lesson-picker"
                    value={selectedItem.id}
                    onChange={(event) => selectLesson(event.target.value)}
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
                  >
                    {filteredModules.map(({ module, items }) => (
                      <optgroup key={module.id} label={module.title}>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={selectedItem.content_type} />
                  <span className="text-xs text-zinc-400">{selectedModuleTitle}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                      {selectedItem.title}
                    </h2>
                    {selectedItem.description ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {selectedItem.description}
                      </p>
                    ) : null}
                  </div>
                  {selectedItem.duration_minutes ? (
                    <span className="inline-flex items-center gap-1.5 border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {selectedItem.duration_minutes} min
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCompletion(selectedItem.id)}
                    disabled={isPending && pendingItemId === selectedItem.id}
                    className={cn(
                      "inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60",
                      completedIds.has(selectedItem.id)
                        ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500"
                    )}
                  >
                    {completedIds.has(selectedItem.id) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    {completedIds.has(selectedItem.id)
                      ? "Completed"
                      : "Mark as complete"}
                  </button>
                  {completionError ? (
                    <p className="text-xs text-red-600" role="alert">
                      Could not update progress. Try again.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-zinc-200 px-5 py-6 sm:px-7">
                <ContentViewer key={selectedItem.id} item={selectedItem} />
              </div>

              <nav
                aria-label="Lesson navigation"
                className="flex items-center justify-between gap-3 border-t border-zinc-200 px-5 py-4 sm:px-7"
              >
                {previousItem ? (
                  <button
                    type="button"
                    onClick={() => selectLesson(previousItem.id)}
                    className="inline-flex min-w-0 items-center gap-1.5 text-left text-sm font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{previousItem.title}</span>
                  </button>
                ) : (
                  <span />
                )}
                {nextItem ? (
                  <button
                    type="button"
                    onClick={() => selectLesson(nextItem.id)}
                    className="inline-flex min-w-0 items-center gap-1.5 text-right text-sm font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    <span className="line-clamp-1">{nextItem.title}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                ) : (
                  <span />
                )}
              </nav>

              {selectedItem.content_type === "recorded_video" ? (
                <div className="border-t border-zinc-100 px-5 py-3 sm:px-7">
                  <p className="flex items-center gap-2 text-xs text-zinc-500">
                    <PlayCircle className="h-3.5 w-3.5" />
                    Use the player controls for fullscreen
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-full min-h-[20rem] items-center justify-center px-6 text-center">
              <div>
                <BookOpen className="mx-auto h-8 w-8 text-zinc-300" />
                <p className="mt-3 text-sm font-medium text-zinc-700">
                  Select a lesson from the outline
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
