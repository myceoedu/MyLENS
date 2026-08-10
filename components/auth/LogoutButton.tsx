/*"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-950 border border-zinc-200/80 rounded-xl px-4 py-2 bg-white hover:border-emerald-200 transition-all disabled:opacity-60"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Log out
    </button>
  );
}*/


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5
        text-sm
        font-semibold
        text-red-700
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-red-600
        hover:bg-red-600
        hover:text-white
        hover:shadow-lg
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}