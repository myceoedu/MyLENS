import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import ResourceList from "@/components/creator/ResourceList";
import { CreatorShell } from "@/components/creator/CreatorShell";
import type { CampaignResource } from "@/types/campaign";

export default async function CreatorResourcesPage() {
  await requireRole(["creator"]);
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("campaign_resources")
    .select("*")
    .eq("published", true)
    .order("sort_order");

  return (
    <CreatorShell>
      <div className="p-8 md:p-10 space-y-6">
        <section>
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Learning Hub
          </p>
          <h1
            className="text-2xl font-bold text-emerald-950 mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Campaign Resources
          </h1>
          <p className="text-zinc-600 text-sm max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Official briefs, filming guides, and checklists to help your team create compelling
            tourism videos for MyLENS 2026.
          </p>
        </section>

        <ResourceList resources={(resources ?? []) as CampaignResource[]} />
      </div>
    </CreatorShell>
  );
}
