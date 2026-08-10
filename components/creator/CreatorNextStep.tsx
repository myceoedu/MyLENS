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
            description: "Use Learning to prepare your story before submissions open.",
            href: "/dashboard/creator/learning",
            label: "Open learning",
            icon: BookOpen,
          };

  const Icon = nextStep.icon;

  return (
    <section className="border-b border-zinc-200 px-4 py-5 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-200 bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Next step
            </p>
            <h2 className="mt-1 text-base font-semibold text-zinc-900">{nextStep.title}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">{nextStep.description}</p>
          </div>
        </div>
        <Link
          href={nextStep.href}
          className="inline-flex shrink-0 items-center gap-2 bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {nextStep.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
