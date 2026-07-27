import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignStep } from "@/types/campaign";

export default function CampaignProgress({ steps }: { steps: CampaignStep[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
      {steps.map((step, index) => {
        return (
          <li
            key={step.id}
            className={cn(
              "group relative rounded-[1.25rem] border bg-white/85 p-5 shadow-[0_12px_28px_-24px_rgba(16,39,28,0.38)] lg:p-6",
              step.status === "complete" && "border-emerald-700/25 bg-emerald-50/35",
              step.status === "current" && "border-[#c8b077] ring-1 ring-[#e6dbc0]",
              step.status === "upcoming" && "border-[#e8dcc8]/80",
              step.status === "locked" && "border-[#e8dcc8]/60 opacity-70"
            )}
          >
            <div className="flex items-center gap-3 mb-3 mt-1">
              <StepIcon status={step.status} index={index} />
              <div>
                <p
                  className="text-[0.6rem] uppercase tracking-[0.28em] text-[#6b5d4f] font-semibold"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Step {index + 1}
                </p>
                <p
                  className="text-base font-semibold text-[#2c2419] leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.label}
                </p>
              </div>
            </div>
            <p
              className="text-xs text-[#5c5046] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {step.description}
            </p>
            <p
              className={cn(
                "mt-4 text-[10px] uppercase tracking-[0.18em] font-semibold",
                step.status === "complete" && "text-emerald-800",
                step.status === "current" && "text-[#8b6914]",
                step.status === "upcoming" && "text-[#9a8b7a]",
                step.status === "locked" && "text-[#9a8b7a]"
              )}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {step.status === "complete"
                ? "Complete"
                : step.status === "current"
                  ? "In progress"
                  : step.status === "locked"
                    ? "Locked"
                    : "Up next"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function StepIcon({
  status,
  index,
}: {
  status: CampaignStep["status"];
  index: number;
}) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";

  if (status === "complete") {
    return (
      <div className={cn(base, "bg-emerald-800 text-amber-50 shadow-sm shadow-emerald-900/20")}>
        <Check className="w-4 h-4" strokeWidth={2.5} />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className={cn(base, "bg-[#f5ebe0] text-[#9a8b7a] border border-[#e8dcc8]")}>
        <Lock className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        status === "current"
          ? "border border-[#c8b077] bg-[#f5efe4] text-[#8b6914]"
          : "bg-[#faf6ee] text-[#6b5d4f] border border-[#e8dcc8]"
      )}
    >
      <Circle className="w-3.5 h-3.5" />
      <span className="sr-only">Step {index + 1}</span>
    </div>
  );
}
