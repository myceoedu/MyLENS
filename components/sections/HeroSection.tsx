"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ChevronDown, Camera, Globe, Users, Film } from "lucide-react";
import { heroTextVariant, staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { campaignImages, CANVAS_OFF_WHITE } from "@/lib/data/campaign-images";

const stats = [
  { icon: Globe,  value: "14",  suffix: "",  label: "States & Territories" },
  { icon: Camera, value: "75",  suffix: "",  label: "Schools" },
  { icon: Users,  value: "300", suffix: "",  label: "Homegrown Creators" },
  { icon: Film,   value: "300", suffix: "+", label: "Tourism Videos" },
];

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    let cancelled = false;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = window.setInterval(() => {
      if (cancelled) return;
      current += increment;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1800 / steps);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

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
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pt-24 pb-32"
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-10"
        >
          <div className="h-px w-10 bg-white/40" />
          <span
            className="text-white/90 text-[0.65rem] font-semibold tracking-[0.45em] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Supported by Tourism Malaysia
          </span>
          <div className="h-px w-10 bg-white/40" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <motion.h1
            variants={heroTextVariant}
            className="font-bold leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "clamp(4rem, 12vw, 11rem)",
              fontWeight: 700,
            }}
          >
            MyLENS
          </motion.h1>

          <motion.p
            variants={heroTextVariant}
            className="text-base sm:text-lg lg:text-xl font-medium tracking-[0.4em] uppercase mt-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Malaysia Unseen
            <span className="ml-3 text-white/90">2026</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="w-20 h-0.5 mx-auto mb-8 rounded-full bg-white/50"
        />

        {/* Frosted glass plate — shields subtitle & body from busy background */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="bg-slate-950/20 backdrop-blur-sm p-6 rounded-2xl max-w-2xl mx-auto border border-white/10 mb-8"
        >
          <p
            className="text-lg sm:text-xl lg:text-2xl font-medium mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Malaysia Through Young Visionaries
          </p>

          <p
            className="text-sm sm:text-base leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Discover Malaysia through the eyes of young creators as homegrown creators from across the
            nation uncover hidden gems, untold stories, local culture, and breathtaking
            destinations — 45 seconds at a time.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.3 }}
          className="flex justify-center mb-16"
        >
          <motion.button
            onClick={() => document.querySelector("#videos")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary-green gap-2.5 text-sm px-10 py-3.5 shadow-lg"
            style={{ boxShadow: "0 8px 28px rgba(46,139,87,0.35)" }}
          >
            <Play className="w-4 h-4 fill-white" />
            Explore Videos
          </motion.button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.55 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              className="stat-card-hero backdrop-blur-md bg-white/80 rounded-2xl p-5 text-center border border-[rgba(46,139,87,0.14)]"
            >
              <stat.icon className="w-4 h-4 mx-auto mb-2 text-zinc-400 opacity-80" />
              <div className="text-slate-900 font-serif font-bold text-3xl md:text-4xl tracking-tight mb-0.5 leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-zinc-500 font-sans font-bold tracking-widest text-[10px] uppercase mt-2 block">
                {stat.label}
              </p>
            </motion.div>
          ))}
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
