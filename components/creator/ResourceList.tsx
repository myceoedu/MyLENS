import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import type { CampaignResource } from "@/types/campaign";

const typeIcons = {
  link: ExternalLink,
  pdf: FileText,
  video: PlayCircle,
};

export default function ResourceList({ resources }: { resources: CampaignResource[] }) {
  if (resources.length === 0) {
    return (
      <p className="text-sm text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
        No resources published yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {resources.map((resource) => {
        const Icon = typeIcons[resource.resource_type] ?? ExternalLink;
        const isExternal = resource.url.startsWith("http");

        return (
          <li key={resource.id}>
            <a
              href={resource.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group flex items-start gap-4 bg-white border border-zinc-200/80 hover:border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Icon className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold text-emerald-950 group-hover:text-emerald-800"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {resource.title}
                </p>
                {resource.description && (
                  <p
                    className="text-sm text-zinc-600 mt-1 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {resource.description}
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-2">
                  {resource.resource_type}
                </p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
