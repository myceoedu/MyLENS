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
    ? "text-amber-600"
    : variant === "pending"
      ? "text-zinc-400"
      : "text-emerald-950";

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <p
        className="text-zinc-400 text-[11px] font-semibold tracking-wider uppercase mb-1 block"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {label}
      </p>
      <p className={cn("font-serif font-bold text-4xl tracking-tight", valueClass)}>{value}</p>
      {hint && (
        <p className="text-xs text-zinc-500 mt-2" style={{ fontFamily: "var(--font-inter)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
