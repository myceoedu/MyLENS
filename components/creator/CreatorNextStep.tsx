import Link from "next/link";
import { ArrowRight, BookOpen, Film, Users } from "lucide-react";
import type { CampaignSettings } from "@/types/campaign";

interface CreatorNextStepProps {
  hasSchool: boolean;
  teamCount: number;
  settings: CampaignSettings | null;
}

function hasSubmissionWindowOpened(settings: CampaignSettings | null) {
  return Boolean(
    settings?.submission_opens_at && new Date(settings.submission_opens_at) <= new Date()
  );
}

export default function CreatorNextStep({
  hasSchool,
  teamCount,
  settings,
}: CreatorNextStepProps) {
  const submissionsOpen = hasSubmissionWindowOpened(settings);
  const nextStep = !hasSchool
    ? {
        title: "Confirm your school assignment",
        description:
          "Your creator account needs a school assignment before you can join a campaign team.",
        href: "/dashboard/creator/profile",
        label: "Review profile",
        icon: Users,
      }
    : teamCount < 2
      ? {
          title: "Build your campaign team",
          description: "Review your school team and make sure everyone is ready to create together.",
          href: "/dashboard/creator/team",
          label: "Open team",
          icon: Users,
        }
      : submissionsOpen
        ? {
            title: "Prepare your video submission",
            description:
              "The submission window is open. Save a draft or submit your finished tourism story.",
            href: "/dashboard/creator/submissions/new",
            label: "Create submission",
            icon: Film,
          }
        : {
            title: "Develop your filmmaking skills",
            description: "Use the Creator Academy to prepare your story before submissions open.",
            href: "/dashboard/creator/learning",
            label: "Open academy",
            icon: BookOpen,
          };

  const Icon = nextStep.icon;

  return (
    <section className="border border-[#e2ded5] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e8dfc4] bg-[#FAF9F5] text-[#B68A35]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B68A35]">
              Your next step
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-[#1A2332]">
              {nextStep.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A6A7E]">{nextStep.description}</p>
          </div>
        </div>
        <Link
          href={nextStep.href}
          className="inline-flex shrink-0 items-center gap-2 bg-[#10271c] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
        >
          {nextStep.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
