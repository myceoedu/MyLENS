import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignStep } from "@/types/campaign";

export default function CampaignProgress({ steps }: { steps: CampaignStep[] }) {
  return (
    <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {steps.map((step, index) => {
        const isCaptureActive = step.id === "capture" && step.status === "current";

        return (
          <li
            key={step.id}
            className={cn(
              "group relative bg-white/85 backdrop-blur-sm border rounded-[1.25rem] p-5 lg:p-6 shadow-sm",
              "transition-all duration-300 ease-out",
              "hover:shadow-lg hover:shadow-[#2d4a3e]/10 hover:-translate-y-1 hover:scale-[1.02]",
              index % 2 === 1 && "lg:mt-3",
              step.status === "complete" && "border-emerald-700/25 bg-emerald-50/40",
              step.status === "current" && !isCaptureActive && "border-amber-500/35 ring-1 ring-amber-400/20",
              step.status === "upcoming" && "border-[#e8dcc8]/80",
              step.status === "locked" && "border-[#e8dcc8]/60 opacity-70",
              isCaptureActive &&
                "border-amber-500/50 ring-2 ring-amber-400/35 shadow-[0_0_28px_-6px_rgba(212,160,84,0.55)] animate-capture-glow"
            )}
          >
            {isCaptureActive && (
              <span
                className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-semibold bg-gradient-to-r from-emerald-800 to-[#8b6914] text-amber-50 shadow-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Active now
              </span>
            )}

            <div className="flex items-center gap-3 mb-3 mt-1">
              <StepIcon status={step.status} index={index} isCaptureActive={isCaptureActive} />
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
  isCaptureActive,
}: {
  status: CampaignStep["status"];
  index: number;
  isCaptureActive?: boolean;
}) {
  const base =
    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105";

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
          ? isCaptureActive
            ? "bg-gradient-to-br from-emerald-800 to-[#6b5a20] text-amber-50 border border-amber-400/40 shadow-md shadow-amber-500/25"
            : "bg-amber-50 text-[#8b6914] border border-amber-400/40"
          : "bg-[#faf6ee] text-[#6b5d4f] border border-[#e8dcc8]"
      )}
    >
      <Circle className="w-3.5 h-3.5" />
      <span className="sr-only">Step {index + 1}</span>
    </div>
  );
}
