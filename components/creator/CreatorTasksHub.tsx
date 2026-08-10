"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Clock3 } from "lucide-react";
import CreatorLearningNav from "@/components/creator/CreatorLearningNav";
import LearningTaskSubmitForm from "@/components/creator/LearningTaskSubmitForm";
import { formatTaskDate } from "@/lib/learning/tasks";
import { cn } from "@/lib/utils";
import {
  LEARNING_TASK_STATUS_LABELS,
  type LearningItem,
  type LearningModule,
  type LearningTaskSubmission,
} from "@/types/learning";

const STATUS_TONE: Record<string, string> = {
  none: "border-zinc-200 bg-zinc-50 text-zinc-600",
  draft: "border-zinc-200 bg-zinc-50 text-zinc-600",
  submitted: "border-amber-200 bg-amber-50 text-amber-700",
  in_review: "border-sky-200 bg-sky-50 text-sky-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  revision: "border-orange-200 bg-orange-50 text-orange-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

type TaskRow = {
  item: LearningItem;
  moduleTitle: string;
  submission: LearningTaskSubmission | null;
};

function statusKey(submission: LearningTaskSubmission | null) {
  return submission?.status ?? "none";
}

function statusLabel(submission: LearningTaskSubmission | null) {
  if (!submission) return "Not started";
  return LEARNING_TASK_STATUS_LABELS[submission.status];
}

export default function CreatorTasksHub({
  modules,
  taskSubmissions,
  userId,
}: {
  modules: LearningModule[];
  taskSubmissions: Record<string, LearningTaskSubmission>;
  userId: string;
}) {
  const tasks = useMemo<TaskRow[]>(() => {
    return modules.flatMap((module) =>
      module.items
        .filter((item) => item.content_type === "task")
        .map((item) => ({
          item,
          moduleTitle: module.title,
          submission: taskSubmissions[item.id] ?? null,
        }))
    );
  }, [modules, taskSubmissions]);

  const openCount = tasks.filter((row) => {
    const status = statusKey(row.submission);
    return status === "none" || status === "draft" || status === "revision";
  }).length;

  const [selectedId, setSelectedId] = useState<string | null>(
    () => tasks.find((row) => statusKey(row.submission) !== "approved")?.item.id ?? tasks[0]?.item.id ?? null
  );

  const selected = tasks.find((row) => row.item.id === selectedId) ?? null;

  if (tasks.length === 0) {
    return (
      <div className="bg-white">
        <header className="border-b border-zinc-200 px-4 py-5 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B08D3F]">
            Academy
          </p>
          <h1
            className="mt-1 text-2xl font-medium tracking-tight text-zinc-900 sm:text-[1.75rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            My tasks
          </h1>
        </header>
        <CreatorLearningNav active="tasks" openTaskCount={0} />
        <div className="px-4 py-16 text-center sm:px-5">
          <ClipboardList className="mx-auto h-8 w-8 text-zinc-300" />
          <h2 className="mt-4 text-base font-semibold text-zinc-900">No assignments yet</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <header className="border-b border-zinc-200 px-4 py-5 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B08D3F]">
          Academy
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-medium tracking-tight text-zinc-900 sm:text-[1.75rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              My tasks
            </h1>
          </div>
          <p className="text-sm tabular-nums text-zinc-500">
            <span className="font-semibold text-zinc-900">{openCount}</span> open
            <span className="mx-1.5 text-zinc-300">/</span>
            <span className="font-semibold text-zinc-900">{tasks.length}</span> total
          </p>
        </div>
      </header>

      <CreatorLearningNav active="tasks" openTaskCount={openCount} />

      <div className="grid lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.4fr)]">
        <aside className="border-b border-zinc-200 lg:border-b-0 lg:border-r">
          <ul className="divide-y divide-zinc-100">
            {tasks.map(({ item, moduleTitle, submission }) => {
              const active = item.id === selectedId;
              const key = statusKey(submission);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors sm:px-5",
                      active ? "bg-[#eef5f1]" : "hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          STATUS_TONE[key] ?? STATUS_TONE.none
                        )}
                      >
                        {statusLabel(submission)}
                      </span>
                      <span className="text-[11px] text-zinc-400">{moduleTitle}</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    {item.due_at ? (
                      <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        Due {formatTaskDate(item.due_at)}
                      </p>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 sm:py-6">
          {selected ? (
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {selected.moduleTitle}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-900">
                  {selected.item.title}
                </h2>
                {selected.item.description ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                    {selected.item.description}
                  </p>
                ) : null}
                {selected.item.due_at ? (
                  <p className="mt-3 text-sm text-zinc-500">
                    Due {formatTaskDate(selected.item.due_at)}
                  </p>
                ) : null}
              </div>

              <LearningTaskSubmitForm
                key={`task-form-${selected.item.id}-${selected.submission?.updated_at ?? "new"}`}
                item={selected.item}
                submission={selected.submission}
                userId={userId}
              />
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Select a task to begin.</p>
          )}
        </section>
      </div>
    </div>
  );
}
