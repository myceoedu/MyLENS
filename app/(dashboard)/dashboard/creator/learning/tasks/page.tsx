import dynamic from "next/dynamic";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { requireRole } from "@/lib/auth/session";
import {
  getCreatorLearningModules,
  getCreatorTaskSubmissionsByItem,
} from "@/lib/learning/queries";

const CreatorTasksHub = dynamic(() => import("@/components/creator/CreatorTasksHub"), {
  loading: () => <div className="h-[32rem] animate-pulse bg-zinc-50" />,
});

export default async function CreatorLearningTasksPage() {
  const profile = await requireRole(["creator"]);
  const [modules, taskSubmissions] = await Promise.all([
    getCreatorLearningModules(),
    getCreatorTaskSubmissionsByItem(profile.id),
  ]);

  return (
    <CreatorShell>
      <CreatorTasksHub
        modules={modules}
        taskSubmissions={taskSubmissions}
        userId={profile.id}
      />
    </CreatorShell>
  );
}
