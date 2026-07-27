import dynamic from "next/dynamic";
import { CreatorShell } from "@/components/creator/CreatorShell";
import { requireRole } from "@/lib/auth/session";
import {
  getCreatorCompletedLearningItemIds,
  getCreatorLearningModules,
} from "@/lib/learning/queries";

const LearningHub = dynamic(() => import("@/components/creator/LearningHub"), {
  loading: () => (
    <div className="h-[28rem] animate-pulse rounded-[2rem] border border-zinc-200 bg-white" />
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
        <section className="relative overflow-hidden rounded-[2rem] bg-[#062419] px-6 py-8 text-white shadow-[0_24px_60px_-32px_rgba(6,36,25,0.65)] sm:px-8 lg:px-10 lg:py-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(182,138,53,0.18),transparent_36%)]"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p
                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d3ad62]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                MyLENS Creator Academy
              </p>
              <h1
                className="max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Build the craft behind every meaningful story.
              </h1>
              <p
                className="mt-4 max-w-xl text-sm leading-7 text-white/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Follow the curriculum, attend scheduled classes, and develop your filmmaking
                skills through official MyLENS learning material.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:min-w-[330px]">
              {[
                ["Modules", modules.length],
                ["Lessons", lessonCount],
                ["Live classes", liveClassCount],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#092a1e]/90 px-4 py-4 text-center">
                  <p className="font-serif text-2xl text-white">{value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LearningHub modules={modules} completedItemIds={completedItemIds} />
      </div>
    </CreatorShell>
  );
}
