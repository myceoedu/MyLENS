"use client";

import { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";

export default function TeamInviteToken({
  token,
  schoolName,
}: {
  token: string | null;
  schoolName: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Your school access token is not available yet. Contact a MyLENS administrator.
      </div>
    );
  }
  const accessToken = token;

  async function copyToken() {
    setError(null);
    try {
      await navigator.clipboard.writeText(accessToken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Copy was blocked by this browser. Select and copy the token manually.");
    }
  }

  return (
    <section className="border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">School access token</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Share this token only with creators joining {schoolName ?? "your school"}.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={copyToken}
          className="inline-flex shrink-0 items-center gap-2 border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy token"}
        </button>
      </div>
      <code className="mt-4 block select-all border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm tracking-wide text-zinc-900">
        {accessToken}
      </code>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </section>
  );
}
