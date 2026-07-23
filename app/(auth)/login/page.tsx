import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { getDashboardPath } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";
import { isUserRole } from "@/types/auth";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  if (profile?.status === "active" && isUserRole(profile.role)) {
    const safeRedirect =
      params.redirectTo?.startsWith("/dashboard") ? params.redirectTo : getDashboardPath(profile.role);
    redirect(safeRedirect);
  }

  const initialError = getAuthErrorMessage(params.error);

  return (
    <AuthShell
      variant="workspace"
      title="Access"
      headlineAccent="Workspace"
      subtitle="National student workspace and admin command — secure sign-in required."
    >
      <LoginForm redirectTo={params.redirectTo} initialError={initialError} />
    </AuthShell>
  );
}
