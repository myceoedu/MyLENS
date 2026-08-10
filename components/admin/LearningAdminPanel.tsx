"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
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
  LEARNING_TASK_MODE_LABELS,
  type LearningContentType,
  type LearningItem,
  type LearningModule,
  type LearningTaskSubmissionMode,
} from "@/types/learning";
import { cn } from "@/lib/utils";
import { adminButton } from "@/components/admin/AdminUI";

const contentIcons = {
  live_class: CalendarDays,
  recorded_video: Video,
  document: FileText,
  external_link: ExternalLink,
  task: ClipboardList,
};

const LESSON_TYPES: LearningContentType[] = [
  "live_class",
  "recorded_video",
  "document",
  "external_link",
];

export type LearningAdminPanelMode = "lessons" | "assignments";

type WorkspaceView =
  | { kind: "catalogue" }
  | { kind: "module-create" }
  | { kind: "module-edit"; module: LearningModule }
  | { kind: "item-create"; moduleId?: string }
  | { kind: "item-edit"; item: LearningItem };

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

function FormModeLabel({
  tone,
  title,
}: {
  tone: "create" | "edit";
  title: string;
}) {
  const isEdit = tone === "edit";
  return (
    <div className="mb-6 border-b border-zinc-100 pb-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {isEdit ? "Editing" : "New"}
      </p>
      <h2
        className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 sm:text-[1.35rem]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function RowMenu({
  label,
  open,
  onOpenChange,
  children,
}: {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuStyle(null);
      return;
    }

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuHeight = 140;
      const openUp = window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight;
      setMenuStyle({
        position: "fixed",
        right: Math.max(8, window.innerWidth - rect.right),
        ...(openUp
          ? { bottom: Math.max(8, window.innerHeight - rect.top + 4) }
          : { top: Math.min(window.innerHeight - menuHeight - 8, rect.bottom + 4) }),
        zIndex: 50,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && menuStyle ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => onOpenChange(false)}
          />
          <div
            style={menuStyle}
            className="min-w-[11rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
          >
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}

function menuItemClass(danger = false) {
  return cn(
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
    danger
      ? "text-rose-700 hover:bg-rose-50"
      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
  );
}

export default function LearningAdminPanel({
  modules,
  mode = "lessons",
}: {
  modules: LearningModule[];
  mode?: LearningAdminPanelMode;
}) {
  const router = useRouter();
  const isAssignments = mode === "assignments";
  const noun = isAssignments ? "assignment" : "lesson";
  const nounPlural = isAssignments ? "assignments" : "lessons";

  const [view, setView] = useState<WorkspaceView>({ kind: "catalogue" });
  const [contentType, setContentType] = useState<LearningContentType>(
    isAssignments ? "task" : "live_class"
  );
  const [submissionMode, setSubmissionMode] =
    useState<LearningTaskSubmissionMode>("mixed");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const visibleModules = modules.map((module) => ({
    ...module,
    items: module.items.filter((item) =>
      isAssignments ? item.content_type === "task" : item.content_type !== "task"
    ),
  }));

  const editingModule =
    view.kind === "module-edit" ? view.module : null;
  const editingItem = view.kind === "item-edit" ? view.item : null;
  const isItemCreate = view.kind === "item-create";
  const isItemEdit = view.kind === "item-edit";
  const isModuleCreate = view.kind === "module-create";
  const isModuleEdit = view.kind === "module-edit";
  const showModuleForm = isModuleCreate || isModuleEdit;
  const showItemForm = isItemCreate || isItemEdit;
  const formContentType: LearningContentType = isAssignments ? "task" : contentType;
  const contentTypeOptions = isAssignments
    ? ([["task", LEARNING_CONTENT_LABELS.task]] as const)
    : LESSON_TYPES.map((type) => [type, LEARNING_CONTENT_LABELS[type]] as const);
  const defaultModuleId =
    view.kind === "item-create"
      ? view.moduleId ?? modules[0]?.id
      : editingItem?.module_id ?? modules[0]?.id;

  const goCatalogue = (message?: string) => {
    setView({ kind: "catalogue" });
    setContentType(isAssignments ? "task" : "live_class");
    setSubmissionMode("mixed");
    setError(null);
    if (message) setSuccess(message);
  };

  const confirmLeaveForm = () => {
    if (isModuleEdit || isItemEdit) {
      return window.confirm(
        "Leave without saving? Any unsaved changes will be lost."
      );
    }
    return true;
  };

  const openCreateModule = () => {
    setError(null);
    setSuccess(null);
    setView({ kind: "module-create" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditModule = (module: LearningModule) => {
    setError(null);
    setSuccess(null);
    setView({ kind: "module-edit", module });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreateItem = (moduleId?: string) => {
    if (modules.length === 0) {
      setError(`Create a module before adding ${nounPlural}.`);
      return;
    }
    setError(null);
    setSuccess(null);
    setContentType(isAssignments ? "task" : "live_class");
    setSubmissionMode("mixed");
    setView({ kind: "item-create", moduleId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditItem = (item: LearningItem) => {
    const allowed = isAssignments
      ? item.content_type === "task"
      : item.content_type !== "task";
    if (!allowed) return;
    setError(null);
    setSuccess(null);
    setContentType(isAssignments ? "task" : item.content_type);
    setSubmissionMode(item.submission_mode ?? "mixed");
    setView({ kind: "item-edit", item });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (isModuleEdit && editingModule) {
      const ok = window.confirm(
        editingModule.published
          ? `Save changes to published module "${editingModule.title}"?`
          : `Save changes to "${editingModule.title}"?`
      );
      if (!ok) return;
    }

    const saved = await runAction(
      () =>
        saveLearningModuleAction({
          id: editingModule?.id,
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          sortOrder: Number(formData.get("sort_order") ?? 0),
          published: formData.get("published") === "on",
        }),
      isModuleEdit ? "Module updated." : "Module created."
    );
    if (saved) goCatalogue(isModuleEdit ? "Module updated." : "Module created.");
  };

  const handleItemSubmit = async (formData: FormData) => {
    if (isItemEdit && editingItem) {
      const ok = window.confirm(
        editingItem.published
          ? `Save changes to published ${noun} "${editingItem.title}"?`
          : `Save changes to "${editingItem.title}"?`
      );
      if (!ok) return;
    }

    const file = formData.get("file");
    const newFile = file instanceof File && file.size > 0 ? file : null;
    const removeExistingFile = formData.get("remove_existing_file") === "on";
    let storagePath = removeExistingFile
      ? undefined
      : editingItem?.storage_path ?? undefined;
    let uploadedPath: string | null = null;

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      if (newFile) {
        if (newFile.size > 100 * 1024 * 1024) {
          setError(
            "Files must be 100 MB or smaller. Use an unlisted video URL for larger videos."
          );
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
      const dueAtValue = String(formData.get("due_at") ?? "");
      const type = isAssignments ? "task" : contentType;
      const moduleId = String(formData.get("module_id") ?? "");
      const isPublished = formData.get("published") === "on";
      const modulePublished =
        modules.find((module) => module.id === moduleId)?.published ?? false;
      const result = await saveLearningItemAction({
        id: editingItem?.id,
        moduleId,
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        contentType: type,
        contentUrl: type === "task" ? "" : String(formData.get("content_url") ?? ""),
        storagePath: type === "task" ? undefined : storagePath,
        startsAt: startsAtValue ? new Date(startsAtValue).toISOString() : "",
        dueAt: dueAtValue ? new Date(dueAtValue).toISOString() : "",
        submissionMode: type === "task" ? submissionMode : undefined,
        durationMinutes: Number(formData.get("duration_minutes") ?? 0),
        sortOrder: Number(formData.get("sort_order") ?? 0),
        published: isPublished,
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

      let message = isItemEdit
        ? isAssignments
          ? "Assignment updated."
          : "Lesson updated."
        : isAssignments
          ? "Assignment created."
          : "Lesson added.";
      if (!isPublished) {
        message = `Saved as draft. Publish it so creators can see it in ${
          isAssignments ? "My tasks" : "Lessons"
        }.`;
      } else if (!modulePublished) {
        message =
          "Saved, but the module is still a draft. Publish the module too.";
      }

      goCatalogue(message);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {(error || success) && (
        <div
          role={error ? "alert" : "status"}
          className={
            error
              ? "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              : "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          }
        >
          {error ?? success}
        </div>
      )}

      {showModuleForm ? (
        <form
          key={editingModule?.id ?? "new-module"}
          action={handleModuleSubmit}
          className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (!confirmLeaveForm()) return;
                goCatalogue();
              }}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to catalogue
            </button>
          </div>

          <FormModeLabel
            tone={isModuleEdit ? "edit" : "create"}
            title={
              isModuleEdit && editingModule ? editingModule.title : "Module"
            }
          />

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
                  className="h-4 w-4 accent-[#0F3A2C]"
                />
                Publish module
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={busy} className={adminButton.primary}>
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                {isModuleEdit ? "Save module changes" : "Create module"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (!confirmLeaveForm()) return;
                  goCatalogue();
                }}
                className={adminButton.secondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {showItemForm ? (
        <form
          key={
            editingItem?.id ??
            `new-item-${formContentType}-${defaultModuleId ?? "none"}`
          }
          action={handleItemSubmit}
          className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (!confirmLeaveForm()) return;
                goCatalogue();
              }}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to catalogue
            </button>
          </div>

          <FormModeLabel
            tone={isItemEdit ? "edit" : "create"}
            title={isItemEdit && editingItem ? editingItem.title : noun[0]!.toUpperCase() + noun.slice(1)}
          />

          {modules.length === 0 ? (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create a module before adding {nounPlural}.
            </p>
          ) : (
            <div className="space-y-5">
              <div className={cn("grid gap-4", !isAssignments && "sm:grid-cols-2")}>
                <div>
                  <label htmlFor="item-module" className={AUTH_LABEL_CLASS}>
                    Module
                  </label>
                  <select
                    id="item-module"
                    name="module_id"
                    required
                    defaultValue={defaultModuleId}
                    className={AUTH_INPUT_CLASS}
                  >
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                {!isAssignments ? (
                  <div>
                    <label htmlFor="content-type" className={AUTH_LABEL_CLASS}>
                      Lesson type
                    </label>
                    <select
                      id="content-type"
                      value={contentType}
                      onChange={(event) =>
                        setContentType(event.target.value as LearningContentType)
                      }
                      className={AUTH_INPUT_CLASS}
                      disabled={isItemEdit}
                    >
                      {contentTypeOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
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
                  placeholder={
                    isAssignments
                      ? "e.g. Film a 30-second introduction"
                      : "e.g. Live class: Building a visual story"
                  }
                  className={AUTH_INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="item-description" className={AUTH_LABEL_CLASS}>
                  {formContentType === "task" ? "Instructions" : "Description"}
                </label>
                <textarea
                  id="item-description"
                  name="description"
                  rows={isAssignments ? 4 : 3}
                  defaultValue={editingItem?.description ?? ""}
                  placeholder={
                    formContentType === "task" ? "What should creators submit?" : undefined
                  }
                  className={`${AUTH_INPUT_CLASS} resize-y`}
                />
              </div>

              {formContentType === "task" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="submission-mode" className={AUTH_LABEL_CLASS}>
                      Submission format
                    </label>
                    <select
                      id="submission-mode"
                      value={submissionMode}
                      onChange={(event) =>
                        setSubmissionMode(
                          event.target.value as LearningTaskSubmissionMode
                        )
                      }
                      className={AUTH_INPUT_CLASS}
                    >
                      {Object.entries(LEARNING_TASK_MODE_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="due-at" className={AUTH_LABEL_CLASS}>
                      Due date (optional)
                    </label>
                    <input
                      id="due-at"
                      name="due_at"
                      type="datetime-local"
                      defaultValue={
                        editingItem?.due_at ? toDateTimeLocal(editingItem.due_at) : ""
                      }
                      className={AUTH_INPUT_CLASS}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="content-url" className={AUTH_LABEL_CLASS}>
                    {formContentType === "live_class"
                      ? "Meeting link"
                      : "External URL (optional when uploading a file)"}
                  </label>
                  <input
                    id="content-url"
                    name="content_url"
                    type="url"
                    defaultValue={editingItem?.content_url ?? ""}
                    placeholder={
                      formContentType === "recorded_video"
                        ? "https://youtube.com/watch?v=..."
                        : "https://..."
                    }
                    className={AUTH_INPUT_CLASS}
                  />
                </div>
              )}

              {(formContentType === "recorded_video" ||
                formContentType === "document") && (
                <div>
                  <label htmlFor="content-file" className={AUTH_LABEL_CLASS}>
                    Upload file (optional)
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 hover:border-[#B08D3F]/50">
                    <Upload className="h-4 w-4 text-[#B08D3F]" />
                    <input
                      id="content-file"
                      name="file"
                      type="file"
                      accept={
                        formContentType === "recorded_video"
                          ? "video/mp4,video/webm,video/quicktime"
                          : ".pdf,.ppt,.pptx,.doc,.docx,image/jpeg,image/png,image/webp"
                      }
                      className="min-w-0 text-xs"
                    />
                  </label>
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Maximum 100 MB. Use an unlisted YouTube or Vimeo URL for larger
                    recordings.
                    {editingItem?.storage_path
                      ? " Leave empty to keep the current upload."
                      : ""}
                  </p>
                  {editingItem?.storage_path && (
                    <label className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                      <input
                        name="remove_existing_file"
                        type="checkbox"
                        className="h-4 w-4 accent-[#0F3A2C]"
                      />
                      Remove the current uploaded file and use the URL instead
                    </label>
                  )}
                </div>
              )}

              {formContentType === "live_class" && (
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
                      editingItem?.starts_at
                        ? toDateTimeLocal(editingItem.starts_at)
                        : ""
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
                <label className="flex items-end gap-3 pb-3 text-sm font-medium text-zinc-900">
                  <input
                    name="published"
                    type="checkbox"
                    defaultChecked={editingItem?.published ?? false}
                    className="h-4 w-4 accent-[#0F3A2C]"
                  />
                  Visible to creators
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={busy} className={adminButton.primary}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isItemEdit ? (
                    <Pencil className="h-4 w-4" />
                  ) : isAssignments ? (
                    <ClipboardList className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isItemEdit
                    ? `Save ${noun} changes`
                    : isAssignments
                      ? "Create assignment"
                      : "Add lesson"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (!confirmLeaveForm()) return;
                    goCatalogue();
                  }}
                  className={adminButton.secondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      ) : null}

      {!showModuleForm && !showItemForm ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSuccess(null);
                router.refresh();
              }}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreateModule}
              className="text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline"
            >
              New module
            </button>
            <button
              type="button"
              onClick={() => openCreateItem()}
              disabled={modules.length === 0}
              className={adminButton.primary}
            >
              <Plus className="h-4 w-4" />
              {isAssignments ? "Add assignment" : "Add lesson"}
            </button>
          </div>

          {visibleModules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-zinc-300" />
              <p className="mt-3 text-sm font-medium text-zinc-800">No modules yet</p>
              <button
                type="button"
                onClick={openCreateModule}
                className={cn(adminButton.primary, "mt-5")}
              >
                <Plus className="h-4 w-4" />
                New module
              </button>
            </div>
          ) : (
            visibleModules.map((module, moduleIndex) => {
              const moduleMenuId = `module-${module.id}`;
              return (
                <article
                  key={module.id}
                  className="rounded-xl border border-zinc-200 bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold tabular-nums text-zinc-600">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-zinc-900">
                            {module.title}
                          </h3>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              module.published
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-zinc-200 bg-zinc-50 text-zinc-500"
                            }`}
                          >
                            {module.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                          {module.items.length}{" "}
                          {module.items.length === 1 ? noun : nounPlural}
                        </p>
                        <button
                          type="button"
                          onClick={() => openCreateItem(module.id)}
                          className="mt-1.5 text-sm font-medium text-[#0F3A2C] hover:underline"
                        >
                          Add to this module
                        </button>
                        {module.description ? (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                            {module.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <RowMenu
                      label={`Module options for ${module.title}`}
                      open={openMenuId === moduleMenuId}
                      onOpenChange={(open) =>
                        setOpenMenuId(open ? moduleMenuId : null)
                      }
                    >
                      <button
                        type="button"
                        className={menuItemClass()}
                        onClick={() => {
                          setOpenMenuId(null);
                          openEditModule(module);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit module details
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className={menuItemClass()}
                        onClick={() => {
                          setOpenMenuId(null);
                          if (
                            module.published &&
                            !window.confirm(
                              `Unpublish module "${module.title}"? Creators will no longer see it.`
                            )
                          ) {
                            return;
                          }
                          runAction(
                            () =>
                              toggleLearningModuleAction(
                                module.id,
                                !module.published
                              ),
                            module.published
                              ? "Module unpublished."
                              : "Module published."
                          );
                        }}
                      >
                        {module.published ? "Unpublish module" : "Publish module"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className={menuItemClass(true)}
                        onClick={() => {
                          setOpenMenuId(null);
                          if (
                            window.confirm(
                              `Delete module "${module.title}" and all of its content?\n\nThis cannot be undone.`
                            )
                          ) {
                            runAction(
                              () => deleteLearningModuleAction(module.id),
                              "Module deleted."
                            );
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete module
                      </button>
                    </RowMenu>
                  </div>

                  <div className="divide-y divide-zinc-100">
                    {module.items.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-sm text-zinc-500">
                          No {nounPlural} in this module yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => openCreateItem(module.id)}
                          className={cn(adminButton.primary, "mt-4")}
                        >
                          <Plus className="h-4 w-4" />
                          Add first {noun}
                        </button>
                      </div>
                    ) : (
                      module.items.map((item) => {
                        const Icon = contentIcons[item.content_type];
                        const itemMenuId = `item-${item.id}`;
                        return (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-zinc-50/70 sm:px-6"
                          >
                            <button
                              type="button"
                              onClick={() => openEditItem(item)}
                              className="flex min-w-0 flex-1 items-start gap-3 text-left"
                            >
                              <div
                                className={cn(
                                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                  isAssignments
                                    ? "bg-[#faf5ea] text-[#B08D3F]"
                                    : "bg-[#eef5f1] text-[#0F3A2C]"
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-zinc-900">
                                    {item.title}
                                  </p>
                                  {!isAssignments && (
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                                      {LEARNING_CONTENT_LABELS[item.content_type]}
                                    </span>
                                  )}
                                  <span
                                    className={cn(
                                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                      item.published
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-zinc-200 bg-zinc-50 text-zinc-500"
                                    )}
                                  >
                                    {item.published ? "Published" : "Draft"}
                                  </span>
                                </div>
                                {!item.published || !module.published ? (
                                  <p className="mt-1 text-xs text-amber-700">
                                    Hidden from creators
                                    {!module.published
                                      ? " (module is draft)"
                                      : ""}
                                  </p>
                                ) : null}
                                {item.starts_at && (
                                  <p className="mt-1 text-xs text-zinc-500">
                                    {new Intl.DateTimeFormat("en-MY", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                      timeZone: "Asia/Kuala_Lumpur",
                                    }).format(new Date(item.starts_at))}
                                  </p>
                                )}
                                {item.due_at && (
                                  <p className="mt-1 text-xs text-zinc-500">
                                    Due{" "}
                                    {new Intl.DateTimeFormat("en-MY", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                      timeZone: "Asia/Kuala_Lumpur",
                                    }).format(new Date(item.due_at))}
                                  </p>
                                )}
                              </div>
                            </button>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditItem(item)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#0F3A2C] transition-colors hover:bg-[#eef5f1]"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <RowMenu
                                label={`More actions for ${item.title}`}
                                open={openMenuId === itemMenuId}
                                onOpenChange={(open) =>
                                  setOpenMenuId(open ? itemMenuId : null)
                                }
                              >
                                <button
                                  type="button"
                                  disabled={busy}
                                  className={menuItemClass()}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (
                                      item.published &&
                                      !window.confirm(
                                        `Unpublish ${noun} "${item.title}"? Creators will no longer see it.`
                                      )
                                    ) {
                                      return;
                                    }
                                    runAction(
                                      () =>
                                        toggleLearningItemAction(
                                          item.id,
                                          !item.published
                                        ),
                                      item.published
                                        ? `${noun[0]!.toUpperCase()}${noun.slice(1)} unpublished.`
                                        : `${noun[0]!.toUpperCase()}${noun.slice(1)} published.`
                                    );
                                  }}
                                >
                                  {item.published ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  className={menuItemClass(true)}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (
                                      window.confirm(
                                        `Delete ${noun} "${item.title}"?\n\nThis cannot be undone.`
                                      )
                                    ) {
                                      runAction(
                                        () => deleteLearningItemAction(item.id),
                                        isAssignments
                                          ? "Assignment deleted."
                                          : "Lesson deleted."
                                      );
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              </RowMenu>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      ) : null}
    </div>
  );
}
