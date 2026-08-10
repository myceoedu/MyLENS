import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignStep } from "@/types/campaign";

export default function CampaignProgress({ steps }: { steps: CampaignStep[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => {
        return (
          <li
            key={step.id}
            className={cn(
              "border bg-white p-4",
              step.status === "complete" && "border-emerald-200 bg-emerald-50/50",
              step.status === "current" && "border-emerald-600",
              step.status === "upcoming" && "border-zinc-200",
              step.status === "locked" && "border-zinc-200 opacity-70"
            )}
          >
            <div className="mb-3 flex items-center gap-3">
              <StepIcon status={step.status} index={index} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Step {index + 1}
                </p>
                <p className="text-sm font-semibold text-zinc-900">{step.label}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">{step.description}</p>
            <p
              className={cn(
                "mt-3 text-[11px] font-semibold uppercase tracking-wide",
                step.status === "complete" && "text-emerald-700",
                step.status === "current" && "text-emerald-700",
                step.status === "upcoming" && "text-zinc-400",
                step.status === "locked" && "text-zinc-400"
              )}
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
  const base = "flex h-9 w-9 shrink-0 items-center justify-center";

  if (status === "complete") {
    return (
      <div className={cn(base, "bg-emerald-700 text-white")}>
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className={cn(base, "border border-zinc-200 bg-white text-zinc-400")}>
        <Lock className="h-3.5 w-3.5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        status === "current"
          ? "border border-emerald-600 bg-emerald-50 text-emerald-700"
          : "border border-zinc-200 bg-white text-zinc-500"
      )}
    >
      <Circle className="h-3.5 w-3.5" />
      <span className="sr-only">Step {index + 1}</span>
    </div>
  );
}
