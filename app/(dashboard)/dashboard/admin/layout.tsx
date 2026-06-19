import { requireRole } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
