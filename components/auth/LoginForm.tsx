"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardPath } from "@/lib/auth/roles";
import { isUserRole } from "@/types/auth";
import {
  WORKSPACE_INPUT_CLASS,
  WORKSPACE_LABEL_CLASS,
  WORKSPACE_LINK_CLASS,
} from "@/lib/auth/workspace-form-styles";
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

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    // signInWithPassword already returns the authenticated user — avoids a redundant round-trip.
    const user = signInData.user;

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
      <div className="space-y-2 rounded-sm border border-[#B68A35]/40 bg-[#FAF9F5] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B68A35]">
          Supabase not connected
        </p>
        <p className="text-sm text-[#5A655F]">
          Add your URL and anon key to <code className="font-mono text-[#0B130F]/80">.env.local</code>, then
          restart <code className="font-mono text-[#0B130F]/80">npm run dev</code>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className={WORKSPACE_LABEL_CLASS}>
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
          className={WORKSPACE_INPUT_CLASS}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="password" className={WORKSPACE_LABEL_CLASS + " mb-0"}>
            Password
          </label>
          <Link href="/forgot-password" className={WORKSPACE_LINK_CLASS}>
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
          className={WORKSPACE_INPUT_CLASS}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-none bg-[#051B10] py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-[#FAF9F5] transition-colors duration-300 hover:bg-[#B68A35] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <p className="mt-6 text-center text-sm text-[#5A655F]">
        New team?{" "}
        <Link href="/register" className={WORKSPACE_LINK_CLASS}>
          Register with event token
        </Link>
      </p>
    </form>
  );
}
