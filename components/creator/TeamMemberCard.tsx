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
        "bg-white border rounded-2xl p-5 shadow-sm",
        isCurrentUser ? "border-emerald-200 ring-1 ring-emerald-100" : "border-zinc-200/80"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-emerald-700" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-sm font-semibold text-emerald-950"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {displayName}
            </h3>
            {isCurrentUser && (
              <span className="bg-emerald-900 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
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
