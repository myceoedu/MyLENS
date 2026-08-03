import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignStep } from "@/types/campaign";

export default function CampaignProgress({ steps }: { steps: CampaignStep[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
      {steps.map((step, index) => {
        return (
          <li
            key={step.id}
            className={cn(
              "group relative border bg-white p-5",
              step.status === "complete" && "border-emerald-200/80 bg-emerald-50/30",
              step.status === "current" && "border-[#B68A35]/50 ring-1 ring-[#B68A35]/20",
              step.status === "upcoming" && "border-[#e2ded5]",
              step.status === "locked" && "border-[#e8e2d6] opacity-70"
            )}
          >
            <div className="mb-3 mt-1 flex items-center gap-3">
              <StepIcon status={step.status} index={index} />
              <div>
                <p
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#8A98B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Step {index + 1}
                </p>
                <p
                  className="text-base font-semibold leading-tight text-[#1A2332]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.label}
                </p>
              </div>
            </div>
            <p
              className="text-xs leading-relaxed text-[#5A6A7E]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {step.description}
            </p>
            <p
              className={cn(
                "mt-4 text-[10px] font-semibold uppercase tracking-[0.18em]",
                step.status === "complete" && "text-emerald-700",
                step.status === "current" && "text-[#B68A35]",
                step.status === "upcoming" && "text-[#8A98B0]",
                step.status === "locked" && "text-[#8A98B0]"
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
  const base = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";

  if (status === "complete") {
    return (
      <div className={cn(base, "bg-emerald-700 text-white")}>
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className={cn(base, "border border-[#e2ded5] bg-[#FAF9F5] text-[#8A98B0]")}>
        <Lock className="h-3.5 w-3.5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        status === "current"
          ? "border border-[#B68A35]/50 bg-[#FAF9F5] text-[#B68A35]"
          : "border border-[#e2ded5] bg-[#FAF9F5] text-[#5A6A7E]"
      )}
    >
      <Circle className="h-3.5 w-3.5" />
      <span className="sr-only">Step {index + 1}</span>
    </div>
  );
}
