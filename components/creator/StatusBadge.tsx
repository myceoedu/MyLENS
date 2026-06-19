import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/types/submission";
import type { SubmissionStatus } from "@/types/submission";

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-lg border",
        cfg.color,
        cfg.bg,
        cfg.border
      )}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {cfg.label}
    </span>
  );
}
