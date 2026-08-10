import dynamic from "next/dynamic";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { requireRole } from "@/lib/auth/session";
import {
  getCreatorCompletedLearningItemIds,
  getCreatorLearningModules,
} from "@/lib/learning/queries";

const LearningHub = dynamic(() => import("@/components/creator/LearningHub"), {
  loading: () => <div className="h-[32rem] animate-pulse bg-zinc-50" />,
});

export default async function CreatorLearningPage() {
  const profile = await requireRole(["creator"]);
  const [modules, completedItemIds] = await Promise.all([
    getCreatorLearningModules(),
    getCreatorCompletedLearningItemIds(profile.id),
  ]);

  return (
    <CreatorShell>
      <LearningHub modules={modules} completedItemIds={completedItemIds} />
    </CreatorShell>
  );
}
