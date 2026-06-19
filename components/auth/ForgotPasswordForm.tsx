"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add your keys to .env.local and restart the dev server.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/login`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
          <Mail className="w-5 h-5 text-emerald-700" />
        </div>
        <p className="text-zinc-800 font-medium" style={{ fontFamily: "var(--font-poppins)" }}>
          Check your email
        </p>
        <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
          If an account exists for <strong>{email}</strong>, we sent a password reset link.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-emerald-800 hover:text-emerald-950 transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
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

      <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
        Enter your account email and we&apos;ll send you a link to reset your password.
      </p>

      <div>
        <label htmlFor="reset-email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <input
          id="reset-email"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-medium rounded-xl py-3.5 transition-all shadow-sm"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-emerald-800 hover:text-emerald-950 transition-colors"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
    </form>
  );
}
