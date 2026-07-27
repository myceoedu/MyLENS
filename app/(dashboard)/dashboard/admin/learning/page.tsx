import dynamic from "next/dynamic";
import { requireRole } from "@/lib/auth/session";
import { getAdminLearningModules } from "@/lib/learning/queries";

const LearningAdminPanel = dynamic(() => import("@/components/admin/LearningAdminPanel"), {
  loading: () => (
    <div className="h-[32rem] animate-pulse rounded-[1.5rem] border border-[#e2ded5] bg-white" />
  ),
});

export default async function AdminLearningPage() {
  await requireRole(["admin"]);
  const modules = await getAdminLearningModules();
  const items = modules.flatMap((module) => module.items);
  const publishedCount = items.filter((item) => item.published).length;
  const liveClassCount = items.filter((item) => item.content_type === "live_class").length;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#062419] px-7 py-8 text-white shadow-[0_24px_60px_-32px_rgba(6,36,25,0.55)] md:px-9">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(182,138,53,0.2),transparent_38%)]"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d3ad62]"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Academy command center
            </p>
            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              Learning curriculum
            </h1>
            <p
              className="mt-3 max-w-xl text-sm leading-7 text-white/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Build the creator journey, schedule live instruction, and control every lesson
              published to the MyLENS academy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[430px]">
            {[
              ["Modules", modules.length],
              ["Content", items.length],
              ["Published", publishedCount],
              ["Live", liveClassCount],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 text-center"
              >
                <p className="font-serif text-xl text-white">{value}</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/40">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LearningAdminPanel modules={modules} />
    </div>
  );
}
