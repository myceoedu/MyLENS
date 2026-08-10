import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  isCurrentUser: boolean;
}

export default function TeamMemberCard({
  fullName,
  email,
  avatarUrl,
  bio,
  isCurrentUser,
}: TeamMemberCardProps) {
  const displayName = fullName ?? email.split("@")[0];

  return (
    <article
      className={cn(
        "border bg-white p-4",
        isCurrentUser ? "border-emerald-600" : "border-zinc-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <User className="h-5 w-5 text-zinc-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900">{displayName}</h3>
            {isCurrentUser ? (
              <span className="bg-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                You
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{email}</p>
          {bio ? <p className="mt-2 text-sm leading-relaxed text-zinc-600">{bio}</p> : null}
        </div>
      </div>
    </article>
  );
}
