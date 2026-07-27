"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteLearningItemAction,
  deleteLearningModuleAction,
  saveLearningItemAction,
  saveLearningModuleAction,
  toggleLearningItemAction,
  toggleLearningModuleAction,
} from "@/lib/learning/actions";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import {
  LEARNING_CONTENT_LABELS,
  type LearningContentType,
  type LearningItem,
  type LearningModule,
} from "@/types/learning";

const contentIcons = {
  live_class: CalendarDays,
  recorded_video: Video,
  document: FileText,
  external_link: ExternalLink,
};

function safeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function LearningAdminPanel({ modules }: { modules: LearningModule[] }) {
  const router = useRouter();
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [contentType, setContentType] = useState<LearningContentType>("live_class");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = () => {
    router.refresh();
    setSuccess(null);
  };

  const runAction = async (
    action: () => Promise<{ ok: boolean; error?: string }>,
    message: string
  ) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return false;
      }
      setSuccess(message);
      router.refresh();
      return true;
    } finally {
      setBusy(false);
    }
  };

  const handleModuleSubmit = async (formData: FormData) => {
    const saved = await runAction(
      () =>
        saveLearningModuleAction({
          id: editingModule?.id,
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          sortOrder: Number(formData.get("sort_order") ?? 0),
          published: formData.get("published") === "on",
        }),
      editingModule ? "Module updated." : "Module created."
    );
    if (saved) setEditingModule(null);
  };

  const handleItemSubmit = async (formData: FormData) => {
    const file = formData.get("file");
    const newFile = file instanceof File && file.size > 0 ? file : null;
    const removeExistingFile = formData.get("remove_existing_file") === "on";
    let storagePath = removeExistingFile ? undefined : editingItem?.storage_path ?? undefined;
    let uploadedPath: string | null = null;

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      if (newFile) {
        if (newFile.size > 100 * 1024 * 1024) {
          setError("Files must be 100 MB or smaller. Use an unlisted video URL for larger videos.");
          return;
        }

        const moduleId = String(formData.get("module_id") ?? "");
        uploadedPath = `${moduleId}/${crypto.randomUUID()}-${safeFileName(newFile.name)}`;
        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("learning-content")
          .upload(uploadedPath, newFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }
        storagePath = uploadedPath;
      }

      const startsAtValue = String(formData.get("starts_at") ?? "");
      const result = await saveLearningItemAction({
        id: editingItem?.id,
        moduleId: String(formData.get("module_id") ?? ""),
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        contentType,
        contentUrl: String(formData.get("content_url") ?? ""),
        storagePath,
        startsAt: startsAtValue ? new Date(startsAtValue).toISOString() : "",
        durationMinutes: Number(formData.get("duration_minutes") ?? 0),
        sortOrder: Number(formData.get("sort_order") ?? 0),
        published: formData.get("published") === "on",
      });

      if (!result.ok) {
        if (uploadedPath) {
          await createClient().storage.from("learning-content").remove([uploadedPath]);
        }
        setError(result.error);
        return;
      }

      if ((uploadedPath || removeExistingFile) && editingItem?.storage_path) {
        await createClient()
          .storage.from("learning-content")
          .remove([editingItem.storage_path]);
      }

      setEditingItem(null);
      setContentType("live_class");
      setSuccess(editingItem ? "Learning content updated." : "Learning content added.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const startEditingItem = (item: LearningItem) => {
    setEditingItem(item);
    setContentType(item.content_type);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-7">
      {(error || success) && (
        <div
          role={error ? "alert" : "status"}
          className={
            error
              ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          }
        >
          {error ?? success}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a77d2f]">
            Authoring studio
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-emerald-950">
            Build the learning journey
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Start with a module, then attach classes, recordings, and learning material.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <form
          key={editingModule?.id ?? "new-module"}
          action={handleModuleSubmit}
          className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-36px_rgba(6,36,25,0.45)] md:p-7"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4eee2] font-serif text-sm font-semibold text-[#9a722a]">
                01
              </span>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Curriculum structure
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-emerald-950">
                  {editingModule ? "Edit module" : "Create module"}
                </h2>
              </div>
            </div>
            {editingModule && (
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="text-sm text-zinc-500 hover:text-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="module-title" className={AUTH_LABEL_CLASS}>
                Module title
              </label>
              <input
                id="module-title"
                name="title"
                required
                maxLength={120}
                defaultValue={editingModule?.title ?? ""}
                placeholder="e.g. Mobile Filmmaking Fundamentals"
                className={AUTH_INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="module-description" className={AUTH_LABEL_CLASS}>
                Description
              </label>
              <textarea
                id="module-description"
                name="description"
                rows={3}
                defaultValue={editingModule?.description ?? ""}
                className={`${AUTH_INPUT_CLASS} resize-y`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="module-order" className={AUTH_LABEL_CLASS}>
                  Display order
                </label>
                <input
                  id="module-order"
                  name="sort_order"
                  type="number"
                  min={0}
                  defaultValue={editingModule?.sort_order ?? modules.length}
                  className={AUTH_INPUT_CLASS}
                />
              </div>
              <label className="flex items-end gap-3 pb-3 text-sm text-zinc-700">
                <input
                  name="published"
                  type="checkbox"
                  defaultChecked={editingModule?.published ?? false}
                  className="h-4 w-4 accent-emerald-800"
                />
                Publish module
              </label>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              {editingModule ? "Save module" : "Create module"}
            </button>
          </div>
        </form>

        <form
          key={editingItem?.id ?? `new-item-${contentType}`}
          action={handleItemSubmit}
          className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-36px_rgba(6,36,25,0.45)] md:p-7"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 font-serif text-sm font-semibold text-emerald-800">
                02
              </span>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Lesson material
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-emerald-950">
                  {editingItem ? "Edit learning content" : "Add learning content"}
                </h2>
              </div>
            </div>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setContentType("live_class");
                }}
                className="text-sm text-zinc-500 hover:text-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>

          {modules.length === 0 ? (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create a module before adding content.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="item-module" className={AUTH_LABEL_CLASS}>
                    Module
                  </label>
                  <select
                    id="item-module"
                    name="module_id"
                    required
                    defaultValue={editingItem?.module_id ?? modules[0]?.id}
                    className={AUTH_INPUT_CLASS}
                  >
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="content-type" className={AUTH_LABEL_CLASS}>
                    Content type
                  </label>
                  <select
                    id="content-type"
                    value={contentType}
                    onChange={(event) => setContentType(event.target.value as LearningContentType)}
                    className={AUTH_INPUT_CLASS}
                  >
                    {Object.entries(LEARNING_CONTENT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="item-title" className={AUTH_LABEL_CLASS}>
                  Title
                </label>
                <input
                  id="item-title"
                  name="title"
                  required
                  maxLength={160}
                  defaultValue={editingItem?.title ?? ""}
                  placeholder="e.g. Live class: Building a visual story"
                  className={AUTH_INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="item-description" className={AUTH_LABEL_CLASS}>
                  Description
                </label>
                <textarea
                  id="item-description"
                  name="description"
                  rows={3}
                  defaultValue={editingItem?.description ?? ""}
                  className={`${AUTH_INPUT_CLASS} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="content-url" className={AUTH_LABEL_CLASS}>
                  {contentType === "live_class"
                    ? "Meeting link"
                    : "External URL (optional when uploading a file)"}
                </label>
                <input
                  id="content-url"
                  name="content_url"
                  type="url"
                  defaultValue={editingItem?.content_url ?? ""}
                  placeholder={
                    contentType === "recorded_video"
                      ? "https://youtube.com/watch?v=..."
                      : "https://..."
                  }
                  className={AUTH_INPUT_CLASS}
                />
              </div>

              {(contentType === "recorded_video" || contentType === "document") && (
                <div>
                  <label htmlFor="content-file" className={AUTH_LABEL_CLASS}>
                    Upload file (optional)
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 hover:border-emerald-300">
                    <Upload className="h-4 w-4 text-emerald-700" />
                    <input
                      id="content-file"
                      name="file"
                      type="file"
                      accept={
                        contentType === "recorded_video"
                          ? "video/mp4,video/webm,video/quicktime"
                          : ".pdf,.ppt,.pptx,.doc,.docx,image/jpeg,image/png,image/webp"
                      }
                      className="min-w-0 text-xs"
                    />
                  </label>
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Maximum 100 MB. Use an unlisted YouTube or Vimeo URL for larger recordings.
                    {editingItem?.storage_path ? " Leave empty to keep the current upload." : ""}
                  </p>
                  {editingItem?.storage_path && (
                    <label className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                      <input
                        name="remove_existing_file"
                        type="checkbox"
                        className="h-4 w-4 accent-emerald-800"
                      />
                      Remove the current uploaded file and use the URL instead
                    </label>
                  )}
                </div>
              )}

              {contentType === "live_class" && (
                <div>
                  <label htmlFor="starts-at" className={AUTH_LABEL_CLASS}>
                    Class date and time
                  </label>
                  <input
                    id="starts-at"
                    name="starts_at"
                    type="datetime-local"
                    required
                    defaultValue={
                      editingItem?.starts_at ? toDateTimeLocal(editingItem.starts_at) : ""
                    }
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="duration" className={AUTH_LABEL_CLASS}>
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    name="duration_minutes"
                    type="number"
                    min={1}
                    defaultValue={editingItem?.duration_minutes ?? ""}
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="item-order" className={AUTH_LABEL_CLASS}>
                    Display order
                  </label>
                  <input
                    id="item-order"
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={editingItem?.sort_order ?? 0}
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
                <label className="flex items-end gap-3 pb-3 text-sm text-zinc-700">
                  <input
                    name="published"
                    type="checkbox"
                    defaultChecked={editingItem?.published ?? false}
                    className="h-4 w-4 accent-emerald-800"
                  />
                  Publish
                </label>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingItem ? "Save content" : "Add content"}
              </button>
            </div>
          )}
        </form>
      </div>

      <section className="space-y-4 rounded-[2rem] border border-zinc-200/80 bg-[#f7f7f3] p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 px-1 pb-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a77d2f]">
              Curriculum map
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-emerald-950">
              Academy modules
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Creators only see modules and content marked as published.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="text-sm font-medium text-emerald-800 hover:text-emerald-950"
          >
            Refresh
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No learning modules yet.</p>
          </div>
        ) : (
          modules.map((module, moduleIndex) => (
            <article
              key={module.id}
              className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-[#f7f7f3] font-serif text-xs font-semibold text-emerald-900">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-emerald-950">{module.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        module.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {module.published ? "Published" : "Draft"}
                    </span>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                      {module.items.length} {module.items.length === 1 ? "lesson" : "lessons"}
                    </p>
                    {module.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      runAction(
                        () => toggleLearningModuleAction(module.id, !module.published),
                        module.published ? "Module unpublished." : "Module published."
                      )
                    }
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:border-emerald-200"
                  >
                    {module.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingModule(module);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:text-emerald-800"
                    aria-label={`Edit ${module.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Delete "${module.title}" and all of its content?`)) {
                        runAction(
                          () => deleteLearningModuleAction(module.id),
                          "Module deleted."
                        );
                      }
                    }}
                    className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                    aria-label={`Delete ${module.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-zinc-100">
                {module.items.length === 0 ? (
                  <p className="px-6 py-5 text-sm text-zinc-400">No content in this module.</p>
                ) : (
                  module.items.map((item) => {
                    const Icon = contentIcons[item.content_type];
                    return (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                                {LEARNING_CONTENT_LABELS[item.content_type]}
                              </span>
                              {!item.published && (
                                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] uppercase text-zinc-500">
                                  Draft
                                </span>
                              )}
                            </div>
                            {item.starts_at && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {new Intl.DateTimeFormat("en-MY", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                  timeZone: "Asia/Kuala_Lumpur",
                                }).format(new Date(item.starts_at))}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              runAction(
                                () => toggleLearningItemAction(item.id, !item.published),
                                item.published ? "Content unpublished." : "Content published."
                              )
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:border-emerald-200"
                          >
                            {item.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditingItem(item)}
                            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:text-emerald-800"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              if (window.confirm(`Delete "${item.title}"?`)) {
                                runAction(
                                  () => deleteLearningItemAction(item.id),
                                  "Content deleted."
                                );
                              }
                            }}
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
