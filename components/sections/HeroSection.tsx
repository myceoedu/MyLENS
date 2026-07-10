"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { heroTextVariant, fadeInUp } from "@/lib/animations";
import { getHeroKickerText } from "@/lib/config/partners";
import { campaignImages, CANVAS_OFF_WHITE } from "@/lib/data/campaign-images";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: CANVAS_OFF_WHITE }}
    >
      {/* ── Full-bleed hero background (z-0) ── */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full"
        style={{ y }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaignImages.heroBackground}
          alt={campaignImages.heroBackgroundAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
      </motion.div>

      {/* ── Top-down nav anchor fade ── */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-transparent to-transparent z-[5] pointer-events-none"
        aria-hidden
      />

      {/* ── Bottom-up mist fade — melts into page canvas ── */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#fafaf7] via-transparent to-transparent z-10 pointer-events-none"
        aria-hidden
      />

      {/* ── Foreground content ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pt-24 pb-32"
      >
        {/* Kicker */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-white/80 text-[0.65rem] font-semibold tracking-[0.45em] uppercase mb-6 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {getHeroKickerText()}
        </motion.p>

        {/* Main title — MyLENS — directly on image, no card */}
        <motion.h1
          variants={heroTextVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-bold leading-none tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "clamp(4rem, 12vw, 11rem)",
            fontWeight: 700,
          }}
        >
          MyLENS
        </motion.h1>

        {/* Second title — MALAYSIA UNSEEN 2026 — directly on image */}
        <motion.p
          variants={heroTextVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg lg:text-xl font-medium tracking-[0.4em] uppercase mt-4 mb-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Malaysia Unseen <span className="text-white/90">2026</span>
        </motion.p>

        {/* Frosted card — slogan, body, stats, buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.75 }}
          className="bg-slate-950/30 backdrop-blur-sm rounded-2xl px-6 py-7 max-w-2xl mx-auto border border-white/10"
        >
          {/* Slogan */}
          <p
            className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            See Malaysia Through New Eyes
          </p>

          {/* Body */}
          <p
            className="text-sm sm:text-base leading-relaxed text-white/90 mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            A national storytelling challenge where students discover hidden stories, develop
            creative skills, and showcase their talents on a national stage.
          </p>
        </motion.div>

        {/* CTA buttons — outside the card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6"
        >
          <motion.button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto rounded-none bg-[#051B10] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FAF9F5] transition-colors duration-[400ms] ease-out hover:bg-[#B68A35] hover:text-white"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Register Your School
          </motion.button>

          <motion.button
            onClick={() => document.querySelector("#for-sponsors")?.scrollIntoView({ behavior: "smooth" })}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto rounded-none border border-[#051B10]/20 bg-transparent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#051B10] transition-all duration-[400ms] ease-out hover:border-transparent hover:bg-[#051B10] hover:text-[#FAF9F5]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Become A Partner
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group text-white/70"
      >
        <span className="text-[10px] tracking-[0.35em] uppercase font-medium group-hover:text-[#2E8B57] transition-colors">
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 group-hover:text-[#2E8B57] transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
}
