"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { editorialStagger, fadeInEditorial } from "@/lib/animations";

const GOLD = "#B58A3D";

export default function VideosPageHero() {
  return (
    <section className="relative overflow-hidden bg-[#0F2A1E] pt-32 pb-24 lg:pb-32">
      {/* Cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,19,15,0.2)_0%,#051B10_100%)]"
        aria-hidden
      />

      {/* Theatrical gold spotlight bleed */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,179,93,0.03),transparent_55%)]"
        aria-hidden
      />

      {/* Microscopic texture */}
      <div
        className="section-topo-texture pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden
      />

      {/* Canvas melt into content below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fafaf7] via-[#fafaf7]/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={editorialStagger}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* Executive navigation */}
          <motion.div variants={fadeInEditorial}>
            <Link
              href="/#videos"
              className="group mb-12 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-widest text-white/50 transition-colors duration-300 hover:text-[#B58A3D]"
            >
              <ArrowLeft
                className="h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-x-1"
                strokeWidth={1.5}
              />
              Back to Home
            </Link>
          </motion.div>

          {/* Tracking tag */}
          <motion.span
            variants={fadeInEditorial}
            className="mb-6 block text-[11px] font-bold uppercase tracking-[0.4em] text-[#B58A3D]"
          >
            Video Showcase
          </motion.span>

          {/* Editorial headline */}
          <motion.h1
            variants={fadeInEditorial}
            className="font-serif text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Watch The{" "}
            <span
              className="font-serif italic font-light tracking-tight"
              style={{ color: GOLD }}
            >
              Stories
            </span>
          </motion.h1>

          {/* Lead copy */}
          <motion.p
            variants={fadeInEditorial}
            className="mt-8 max-w-xl font-light leading-[1.75] text-white/50 sm:text-base lg:text-lg"
          >
            A curated anthology of short films — landscapes, culture, and hidden
            gems across Malaysia, presented through the MyLENS lens.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
