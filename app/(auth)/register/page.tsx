import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { getDashboardPath } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { isUserRole } from "@/types/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const profile = await getCurrentProfile();

  if (profile?.status === "active" && isUserRole(profile.role)) {
    redirect(getDashboardPath(profile.role));
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join MyLENS as a participating creator. Your account will be reviewed before activation."
    >
      <RegisterForm />
    </AuthShell>
  );
}
