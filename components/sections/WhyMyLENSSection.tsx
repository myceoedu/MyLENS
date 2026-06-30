"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Video, School, Flag, Trophy } from "lucide-react";
import { fadeInLeft, fadeInRight, staggerContainer, fadeInUp } from "@/lib/animations";
import { campaignImages } from "@/lib/data/campaign-images";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Learn from Industry Experts",
    desc: "Guided by professional filmmakers, journalists and content creators from across Malaysia.",
  },
  {
    icon: Video,
    title: "Create Original Video Content",
    desc: "Students produce authentic 45-second stories using real equipment and storytelling techniques.",
  },
  {
    icon: School,
    title: "Represent Their Schools",
    desc: "Each entry carries the school's pride — a chance to shine on a national stage.",
  },
  {
    icon: Flag,
    title: "Share Untold Malaysian Stories",
    desc: "Uncover hidden gems, local culture and breathtaking destinations others have never seen.",
  },
  {
    icon: Trophy,
    title: "Compete on a National Platform",
    desc: "The top creators advance to a grand finale watched by educators, industry leaders and the public.",
  },
] as const;

const JOURNEY_STEPS = ["Learn", "Create", "Represent", "Share", "Compete"];

export default function WhyMyLENSSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section id="why-mylens" className="bg-white text-[#051B10] py-24 lg:py-32 font-sans overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* ── HEADER BLOCK ── */}
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-24">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#B58A3D] font-medium text-xs tracking-[0.4em] uppercase block mb-4"
          >
            About The Programme
          </motion.span>
          
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#051B10] font-bold text-4xl sm:text-5xl tracking-tight leading-none font-serif mb-4"
          >
            What Is MyLENS?
          </motion.h2>
          
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#B58A3D] font-medium text-[0.7rem] sm:text-xs tracking-[0.25em] uppercase block mb-6"
          >
            More Than A Video Competition
          </motion.span>
          
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[#4F6457] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            MyLENS is a learning journey where students explore Malaysia, tell meaningful stories,
            and develop real-world skills through video creation.
          </motion.p>
        </div>

        {/* ── TWO COLUMN EDITORIAL PRESENTATION ── */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
          
          {/* Left Column: Clean Borderless Framed Imagery */}
          <motion.div
            ref={imgRef}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-[50%] relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#FAF7F2]"
          >
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0 w-full h-full origin-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaignImages.creatorSpotlight}
                alt="Student filming local culture and heritage in Malaysia"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Subtle premium shadow gradient to preserve high legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#051B10]/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/60 text-[0.6rem] font-bold tracking-[0.3em] uppercase mb-1">
                Student Creator
              </p>
              <p className="text-white text-base font-serif italic tracking-wide">
                Discovering Malaysia through a 45-second lens
              </p>
            </div>
          </motion.div>

          {/* Right Column: Pristine Minimalist Index Row List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="w-full lg:w-[50%] flex flex-col"
          >
            <div className="border-t border-[#051B10]/08">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeInRight}
                    className="flex gap-6 py-6 border-b border-[#051B10]/08 items-start group transition-colors duration-300"
                  >
                    {/* Minimal Clean Typography Index Identifier */}
                    <span className="font-serif text-sm text-[#B58A3D] font-medium tracking-wider pt-1 min-w-[24px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#051B10] stroke-[1.25]" />
                        <h3 className="text-[#051B10] font-serif text-base sm:text-lg font-medium tracking-tight">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-[#4F6457] text-sm leading-relaxed font-light pl-7 max-w-lg">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Journey Timeline Breadcrumb Footer */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 bg-[#FAF7F2] border border-[#051B10]/04 rounded-full px-5 py-2.5 self-start"
            >
              {JOURNEY_STEPS.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] text-[#051B10] uppercase">
                    {step}
                  </span>
                  {i < YOURNEY_STEPS_LENGTH_CHECK && (
                    <span className="text-[#B58A3D]/50 text-xs">/</span>
                  )}
                </span>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Inline fallback evaluation for mapping safely
const YOURNEY_STEPS_LENGTH_CHECK = JOURNEY_STEPS.length - 1;