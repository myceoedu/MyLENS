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
      className="inline-flex items-center gap-2 font-mono text-sm bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-emerald-950 hover:border-emerald-300 transition-all"
    >
      {token}
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Copy className="w-4 h-4 text-zinc-400" />
      )}
    </button>
  );
}
