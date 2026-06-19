"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardPath } from "@/lib/auth/roles";
import { isUserRole } from "@/types/auth";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface LoginFormProps {
  redirectTo?: string;
  initialError?: string | null;
}

export default function LoginForm({ redirectTo, initialError }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add your keys to .env.local and restart the dev server.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Sign in failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Could not load your profile. Please contact support.");
      return;
    }

    if (profile.status !== "active") {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Your account is not active yet. Please contact your administrator.");
      return;
    }

    if (!isUserRole(profile.role)) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Your account role is invalid. Please contact support.");
      return;
    }

    const destination =
      redirectTo && redirectTo.startsWith("/dashboard")
        ? redirectTo
        : getDashboardPath(profile.role);

    router.push(destination);
    router.refresh();
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 space-y-2">
        <p className="text-sm font-semibold text-amber-900" style={{ fontFamily: "var(--font-poppins)" }}>
          Supabase not connected
        </p>
        <p className="text-sm text-amber-800/90" style={{ fontFamily: "var(--font-inter)" }}>
          Add your URL and anon key to <code className="font-mono">.env.local</code>, then restart{" "}
          <code className="font-mono">npm run dev</code>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          style={{ fontFamily: "var(--font-inter)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu.my"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className={AUTH_LABEL_CLASS + " mb-0"}>
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 transition-all shadow-sm"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Sign In
          </>
        )}
      </button>

      <p className="text-zinc-500 text-sm mt-6 text-center" style={{ fontFamily: "var(--font-inter)" }}>
        New team?{" "}
        <Link href="/register" className="text-emerald-700 hover:underline font-medium">
          Register with your event token
        </Link>
      </p>
    </form>
  );
}
