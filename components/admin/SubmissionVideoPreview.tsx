"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/youtube";

/**
 * Lazy video preview — loads iframe only after click to avoid lag on page load.
 */
export default function SubmissionVideoPreview({
  videoUrl,
  title,
}: {
  videoUrl: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;

  if (!videoUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-[#ddd8ce] bg-[#f7f5ef] text-sm text-zinc-500">
        No video URL provided
      </div>
    );
  }

  if (youtubeId && playing) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#e2ded5] bg-black shadow-sm">
        <iframe
          title={title}
          src={getYouTubeEmbedUrl(youtubeId)}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (youtubeId) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative block w-full overflow-hidden rounded-2xl border border-[#e2ded5] bg-black text-left shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getYouTubeThumbnailUrl(youtubeId)}
          alt=""
          className="aspect-video w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          loading="lazy"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#10271c] shadow-lg transition-transform group-hover:scale-105">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </span>
        <span className="sr-only">Play video preview</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e2ded5] bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm text-zinc-600">
        Preview is available for YouTube links. Open the submitted URL directly:
      </p>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 break-all text-sm font-medium text-emerald-900 hover:underline"
      >
        {videoUrl}
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </a>
    </div>
  );
}
