import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { getDashboardPath } from "@/lib/auth/roles";

export default async function DashboardIndexPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  redirect(getDashboardPath(profile.role));
}
