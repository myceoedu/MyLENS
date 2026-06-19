export const AUTH_INPUT_CLASS =
  "bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all py-3 px-4 w-full text-sm outline-none";

export const AUTH_LABEL_CLASS =
  "block text-[0.65rem] uppercase tracking-widest mb-2 font-semibold text-emerald-700";

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  account_inactive:
    "Your account is not active yet. Please contact your school coordinator or MyLENS admin.",
  invalid_role: "Your account role is invalid. Please contact support.",
  invalid_credentials: "Invalid email or password. Please try again.",
  invalid_school_token:
    "Invalid school name or event access token. Please check your details with your administrator.",
  auth_callback_failed: "Authentication failed. Please try logging in again.",
};

export function getAuthErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}
