/*import { cn } from "@/lib/utils";

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
        : "text-sky-900";

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
}   *///original code

import {
  School,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";


export default function AdminStatCard({
  label,
  value,
  hint,
  variant = "schools",
}: {
  label: string;
  value: string | number;
  hint?: string;
  variant?: "schools" | "active" | "pending" | "creators";
}) {


  const getCardStyle = () => {

    switch (variant) {

      case "schools":
        return {
          icon: School,
          border: "border-sky-500",
          background: "bg-sky-50",
          number: "text-sky-700",
          iconBackground: "bg-sky-100",
          iconColor: "text-sky-600",
        };


      case "active":
        return {
          icon: CheckCircle2,
          border: "border-emerald-500",
          background: "bg-emerald-50",
          number: "text-emerald-700",
          iconBackground: "bg-emerald-100",
          iconColor: "text-emerald-600",
        };


      case "pending":
        return {
          icon: Clock3,
          border: "border-amber-500",
          background: "bg-amber-50",
          number: "text-amber-700",
          iconBackground: "bg-amber-100",
          iconColor: "text-amber-600",
        };


      case "creators":
        return {
          icon: Users,
          border: "border-violet-500",
          background: "bg-violet-50",
          number: "text-violet-700",
          iconBackground: "bg-violet-100",
          iconColor: "text-violet-600",
        };

    }

  };


  const style = getCardStyle();

  const Icon = style.icon;



  return (

    <div
      className={`
        ${style.background}

        border-t-4
        ${style.border}

        rounded-3xl

        p-6

        transition-all
        duration-300

        hover:-translate-y-2
        hover:shadow-xl
      `}
    >


      {/* ICON */}

      <div
        className={`
          ${style.iconBackground}

          flex
          h-12
          w-12

          items-center
          justify-center

          rounded-2xl

          mb-5
        `}
      >

        <Icon
          className={`
            h-6
            w-6

            ${style.iconColor}
          `}
        />

      </div>



      {/* NUMBER */}

      <p
        className={`
          text-5xl
          font-bold
          tracking-tight

          ${style.number}
        `}
      >

        {value}

      </p>



      {/* TITLE */}

      <p
        className="
          mt-3
          text-lg
          font-semibold
          text-[#10271c]
        "
      >

        {label}

      </p>



      {/* DESCRIPTION */}

      {hint && (

        <p
          className="
            mt-1
            text-sm
            text-zinc-600
          "
        >

          {hint}

        </p>

      )}


    </div>

  );
}