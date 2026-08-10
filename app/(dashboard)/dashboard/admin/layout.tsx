import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const [
    { count: submissionQueue },
    { count: newContactInquiries },
    { count: newPartnershipInquiries },
    { count: pendingProfiles },
    taskQueueResult,
  ] = await Promise.all([
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("partnership_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("learning_task_submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
  ]);

  const taskQueue =
    taskQueueResult.error?.code === "42P01" ? 0 : (taskQueueResult.count ?? 0);

  return (
    <div>
      <AdminNav
        counts={{
          submissions: submissionQueue ?? 0,
          inquiries: (newContactInquiries ?? 0) + (newPartnershipInquiries ?? 0),
          people: pendingProfiles ?? 0,
          learning: taskQueue,
        }}
      />
      {children}
    </div>
  );
}
