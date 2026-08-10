"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function TokenCopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied" : "Copy access token"}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-xs tracking-wider text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
    >
      {token}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-zinc-400" />
      )}
    </button>
  );
}
