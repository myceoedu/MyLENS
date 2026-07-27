import { cn } from "@/lib/utils";

export default function AdminStatCard({
  label,
  value,
  hint,
  variant = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  variant?: "default" | "pending";
}) {
  const numValue = typeof value === "number" ? value : Number.parseInt(String(value), 10) || 0;
  const isPendingHighlight = variant === "pending" && numValue > 0;

  const valueClass = isPendingHighlight
    ? "text-[#a77d2f]"
    : variant === "pending"
      ? "text-zinc-400"
      : "text-emerald-950";

  return (
    <div className="border border-[#e2ded5] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(16,39,28,0.45)] transition-shadow hover:shadow-[0_16px_34px_-24px_rgba(16,39,28,0.45)]">
      <p
        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {label}
      </p>
      <p className={cn("font-serif text-4xl font-semibold tracking-tight", valueClass)}>{value}</p>
      {hint && (
        <p className="text-xs text-zinc-500 mt-2" style={{ fontFamily: "var(--font-inter)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
