export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes("your-project") || key === "your-anon-key") return false;

  return url.startsWith("https://") && key.length > 20;
}

export function getSupabaseConfigError(): string | null {
  if (isSupabaseConfigured()) return null;
  return "Add your Supabase URL and anon key to .env.local, then restart npm run dev.";
}
