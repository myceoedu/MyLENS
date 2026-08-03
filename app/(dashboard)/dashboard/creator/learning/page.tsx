import dynamic from "next/dynamic";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { requireRole } from "@/lib/auth/session";
import {
  getCreatorCompletedLearningItemIds,
  getCreatorLearningModules,
} from "@/lib/learning/queries";

const LearningHub = dynamic(() => import("@/components/creator/LearningHub"), {
  loading: () => (
    <div className="h-[28rem] animate-pulse border border-[#e2ded5] bg-white" />
  ),
});

export default async function CreatorLearningPage() {
  const profile = await requireRole(["creator"]);
  const [modules, completedItemIds] = await Promise.all([
    getCreatorLearningModules(),
    getCreatorCompletedLearningItemIds(profile.id),
  ]);
  const lessonCount = modules.reduce((total, module) => total + module.items.length, 0);
  const liveClassCount = modules.reduce(
    (total, module) =>
      total + module.items.filter((item) => item.content_type === "live_class").length,
    0
  );

  return (
    <CreatorShell>
      <div className="space-y-7 p-5 sm:p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border border-[#e2ded5] bg-white p-6 sm:p-8">
          <DashboardPageHeader
            eyebrow="MyLENS Creator Academy"
            title="Build the craft behind every meaningful story."
            description="Follow the curriculum, attend scheduled classes, and develop your filmmaking skills through official MyLENS learning material."
          />
          <div className="grid min-w-[16rem] grid-cols-3 gap-px overflow-hidden border border-[#e2ded5] bg-[#e2ded5]">
            {[
              ["Modules", modules.length],
              ["Lessons", lessonCount],
              ["Live", liveClassCount],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#FAF9F5] px-3 py-4 text-center">
                <p className="font-serif text-2xl text-[#1A2332]">{value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#8A98B0]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <LearningHub modules={modules} completedItemIds={completedItemIds} />
      </div>
    </CreatorShell>
  );
}
