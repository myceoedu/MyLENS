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
        "border bg-white p-5 shadow-[0_12px_28px_-24px_rgba(16,39,28,0.4)]",
        isCurrentUser ? "border-[#c7b47e] ring-1 ring-[#e8dfc4]" : "border-[#e2ded5]"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ded8ca] bg-[#f5efe4]">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <User className="h-5 w-5 text-[#8d6928]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-sm font-semibold text-[#10271c]"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {displayName}
            </h3>
            {isCurrentUser && (
              <span className="rounded-full bg-[#10271c] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-white">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{email}</p>
          {bio && (
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              {bio}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
