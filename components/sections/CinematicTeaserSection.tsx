"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CAMPAIGN_TEASER_POSTER_SRC,
  getCampaignTeaserYouTubeId,
} from "@/lib/config/campaign";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

const TEASER_POSTER_ALT = "MyLENS 2026 campaign teaser thumbnail";

function PlayTriangle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 6.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

export default function CinematicTeaserSection() {
  const youtubeId = getCampaignTeaserYouTubeId();
  const [started, setStarted] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  const handlePlay = () => {
    if (!youtubeId) return;
    setStarted(true);
    setIframeReady(false);
  };

  const resetPlayback = () => {
    setStarted(false);
    setIframeReady(false);
  };

  const showCoverStill = !started || (started && !iframeReady);

  return (
    <section
      className="bg-[#FAF9F5] pt-14 pb-10 lg:pt-20 lg:pb-12"
      aria-label="The Cinematic Manifesto — national visual register"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.35em] text-[#B68A35]">
              THE NATIONAL VISUAL REGISTER
            </span>

            <h2 className="font-serif text-3xl leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.65rem]">
              <span className="font-bold text-[#0B130F]">The Cinematic </span>
              <span className="italic font-normal text-[#0B130F]">Manifesto</span>
            </h2>

            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[#4A544E]">
              An atmospheric index documenting heritage, identity, and raw regional
              transformations captured through unfiltered youth perspectives across
              Malaysia.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="group relative aspect-video overflow-hidden rounded-none border border-black/[0.06] bg-[#FAF9F5]">
              {showCoverStill && (
                <div className="absolute inset-0 z-[2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CAMPAIGN_TEASER_POSTER_SRC}
                    alt={TEASER_POSTER_ALT}
                    className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.05] contrast-[1.08] saturate-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/20"
                    aria-hidden
                  />
                </div>
              )}

              {started && youtubeId && (
                <iframe
                  src={getYouTubeEmbedUrl(youtubeId)}
                  title="MyLENS 2026 campaign manifesto"
                  className={cn(
                    "absolute inset-0 z-[1] h-full w-full transition-opacity duration-500 ease-out",
                    iframeReady ? "opacity-100" : "opacity-0"
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIframeReady(true)}
                />
              )}

              <AnimatePresence>
                {!started && (
                  <motion.button
                    key="teaser-play"
                    type="button"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                    onClick={handlePlay}
                    disabled={!youtubeId}
                    aria-label={
                      youtubeId
                        ? "Play cinematic manifesto teaser"
                        : "Teaser video not configured"
                    }
                    className={cn(
                      "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3",
                      !youtubeId && "cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-[#B68A35] bg-white/75 text-[#B68A35] shadow-[0_8px_32px_rgba(11,19,15,0.12)] backdrop-blur-sm transition-transform duration-[400ms] ease-out",
                        youtubeId && "group-hover:scale-110"
                      )}
                    >
                      <PlayTriangle className="h-5 w-5 translate-x-0.5" />
                    </span>
                    {!youtubeId && (
                      <span className="max-w-xs px-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                        Set NEXT_PUBLIC_CAMPAIGN_TEASER_YOUTUBE in .env.local
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {started && !iframeReady && (
                <div
                  className="absolute inset-0 z-[3] flex items-center justify-center bg-black/25"
                  aria-live="polite"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
                    Loading stream…
                  </span>
                </div>
              )}

              {started && iframeReady && (
                <button
                  type="button"
                  onClick={resetPlayback}
                  aria-label="Close video and return to poster"
                  className="absolute right-3 top-3 z-30 rounded-none border border-white/30 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90 transition-colors hover:bg-black/70"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
