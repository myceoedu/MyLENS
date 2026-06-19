import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset Password" subtitle="We'll email you a secure reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
