import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";

export default function CategoryPill({
  category,
  size = "sm",
}: {
  category: VideoCategory;
  size?: "sm" | "xs";
}) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-lg border",
        cfg.bg,
        cfg.color,
        size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <span>{cfg.emoji}</span>
      {category}
    </span>
  );
}
