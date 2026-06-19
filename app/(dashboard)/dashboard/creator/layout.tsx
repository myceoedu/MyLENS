import { requireRole } from "@/lib/auth/session";
import CreatorNav from "@/components/creator/CreatorNav";

export const dynamic = "force-dynamic";

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["creator"]);

  return (
    <div>
      <CreatorNav />
      {children}
    </div>
  );
}
