"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Video, School, Flag, Trophy } from "lucide-react";
import {
  editorialFadeLeft,
  editorialFadeRight,
  editorialFadeUp,
  editorialStagger,
} from "@/lib/animations";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Learn from Industry Experts",
  },
  {
    icon: Video,
    title: "Create Original Video Content",
  },
  {
    icon: School,
    title: "Represent Their Schools",
  },
  {
    icon: Flag,
    title: "Share Untold Malaysian Stories",
  },
  {
    icon: Trophy,
    title: "Compete on a National Platform",
  },
] as const;

export default function WhyMyLENSSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section id="why-mylens" className="bg-[#FAF9F5] text-[#051B10] py-24 lg:py-32 font-sans overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* ── HEADER BLOCK ── */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-16">
          <motion.span
            variants={editorialFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#B58A3D] font-medium text-xs tracking-[0.4em] uppercase block mb-4"
          >
            About The Programme
          </motion.span>
          
          <motion.h2
            variants={editorialFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#051B10] font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none font-serif mb-4"
          >
            What Is MyLENS?
          </motion.h2>
          
          <motion.span
            variants={editorialFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#B58A3D] font-medium text-[0.7rem] sm:text-xs tracking-[0.25em] uppercase block mb-6"
          >
            More Than A Video Competition
          </motion.span>
          
          <motion.p
            variants={editorialFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#4F6457] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            MyLENS is a learning journey where students explore Malaysia, tell meaningful stories,
            and develop real-world skills through video creation.
          </motion.p>
        </div>

        {/* ── CINEMATIC EDITORIAL PRESENTATION ── */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">
          
          {/* Left Column: fills its track — no orphan whitespace */}
          <motion.div
            ref={imgRef}
            variants={editorialFadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative h-[380px] w-full overflow-hidden bg-[#051B10] shadow-[0_20px_60px_rgba(5,27,16,0.10)] sm:h-[400px] lg:h-[420px]"
          >
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0 h-full w-full origin-center"
            >
              <Image
                src="/images/KLCC.png"
                alt="Petronas Twin Towers in Kuala Lumpur, Malaysia"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                priority
                unoptimized
                className="object-cover object-[center_30%]"
              />
            </motion.div>

            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#051B10]/70 via-[#051B10]/15 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-7 sm:left-7 sm:right-7">
              <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#B58A3D]">
                Kuala Lumpur Icon
              </p>
              <p className="font-serif text-base italic font-light tracking-wide text-white/90 sm:text-lg">
                Discovering Malaysia through its unforgettable landmarks
              </p>
            </div>
          </motion.div>

          {/* Right Column: feature list aligned to image height */}
          <motion.div
            variants={editorialStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="group/list w-full"
          >
            <div className="border-t border-[#051B10]/12">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={editorialFadeRight}
                    className="group/row flex items-center gap-4 border-b border-[#051B10]/12 py-4 transition-all duration-500 ease-out hover:bg-[#F3F1EB]/50 group-hover/list:opacity-40 hover:!opacity-100 sm:gap-5 sm:py-5"
                  >
                    {/* Minimal Clean Typography Index Identifier */}
                    <span className="min-w-[28px] font-serif text-sm font-medium tracking-wider text-[#051B10]/45 transition-colors duration-500 ease-out group-hover/row:text-[#B58A3D]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <Icon className="h-4 w-4 shrink-0 text-[#051B10] stroke-[1] transition-colors duration-500 ease-out group-hover/row:text-[#B58A3D]" />
                    <h3 className="flex-1 font-serif text-base font-medium leading-snug tracking-tight text-[#051B10] sm:text-lg">
                      {feature.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}