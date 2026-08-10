import dynamic from "next/dynamic";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { requireRole } from "@/lib/auth/session";
import {
  getCreatorCompletedLearningItemIds,
  getCreatorLearningModules,
  getCreatorTaskSubmissionsByItem,
} from "@/lib/learning/queries";

const LearningHub = dynamic(() => import("@/components/creator/LearningHub"), {
  loading: () => <div className="h-[32rem] animate-pulse bg-zinc-50" />,
});

export default async function CreatorLearningPage() {
  const profile = await requireRole(["creator"]);
  const [modules, completedItemIds, taskSubmissions] = await Promise.all([
    getCreatorLearningModules(),
    getCreatorCompletedLearningItemIds(profile.id),
    getCreatorTaskSubmissionsByItem(profile.id),
  ]);

  const openTaskCount = modules
    .flatMap((module) => module.items)
    .filter((item) => item.content_type === "task")
    .filter((item) => {
      const status = taskSubmissions[item.id]?.status;
      return !status || status === "draft" || status === "revision";
    }).length;

  return (
    <CreatorShell>
      <LearningHub
        modules={modules}
        completedItemIds={completedItemIds}
        taskSubmissions={taskSubmissions}
        userId={profile.id}
        mode="lessons"
        openTaskCount={openTaskCount}
      />
    </CreatorShell>
  );
}
