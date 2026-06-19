"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AUTH_ERROR_MESSAGES, AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add your keys to .env.local and restart the dev server.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!schoolName.trim() || !accessToken.trim()) {
      setError(AUTH_ERROR_MESSAGES.invalid_school_token);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: schoolId, error: validateError } = await supabase.rpc(
      "validate_school_registration",
      {
        p_school_name: schoolName.trim(),
        p_access_token: accessToken.trim(),
      }
    );

    if (validateError) {
      setLoading(false);
      setError(validateError.message);
      return;
    }

    if (!schoolId) {
      setLoading(false);
      setError(AUTH_ERROR_MESSAGES.invalid_school_token);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: "creator",
          school_id: schoolId,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setError("Could not create account. Please try again.");
      return;
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
          <UserPlus className="w-5 h-5 text-emerald-700" />
        </div>
        <p className="text-emerald-950 font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>
          Account created
        </p>
        <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
          Your creator account for <strong>{email}</strong> has been submitted. A MyLENS administrator
          will review and activate it — you&apos;ll be able to sign in once approved.
        </p>
        <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
          If email confirmation is enabled, please confirm your email first.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full bg-emerald-900 hover:bg-emerald-800 text-white font-medium rounded-xl py-3.5 transition-all shadow-sm text-sm"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Back to Sign In
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
        For participating creators and students only. Enter your school details and the unique team
        access token provided by the event administrators.
      </p>

      <div>
        <label htmlFor="fullName" className={AUTH_LABEL_CLASS}>
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label htmlFor="register-email" className={AUTH_LABEL_CLASS}>
          Email
        </label>
        <input
          id="register-email"
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
        <label htmlFor="schoolName" className={AUTH_LABEL_CLASS}>
          School Name
        </label>
        <input
          id="schoolName"
          type="text"
          autoComplete="organization"
          required
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="e.g., SMK Victoria"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label htmlFor="accessToken" className={AUTH_LABEL_CLASS}>
          Event Access Token
        </label>
        <input
          id="accessToken"
          type="text"
          autoComplete="off"
          required
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="e.g., MYLENS-KUL-02"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label htmlFor="register-password" className={AUTH_LABEL_CLASS}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={AUTH_LABEL_CLASS}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
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
            Creating account…
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Create Account
          </>
        )}
      </button>

      <p className="text-xs text-center text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-700 hover:text-emerald-900">
          Sign in
        </Link>
      </p>
    </form>
  );
}
