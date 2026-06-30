"use client";

import { motion } from "framer-motion";
import { Check, School } from "lucide-react";
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from "@/lib/animations";
import { campaignImages } from "@/lib/data/campaign-images";

const BENEFITS = [
  "Discover student talents",
  "Encourage creativity and innovation",
  "Build confidence among students",
  "Showcase student achievements",
  "Gain national recognition",
  "Represent their school with pride",
] as const;

export default function WhySchoolsJoinSection() {
  return (
    <section
      id="why-schools-join"
      className="relative py-[60px] md:py-[80px] lg:py-[120px] bg-[#F8F6F1] overflow-hidden border-t border-slate-200/40"
    >
      {/* Subtle topographic texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cpath d='M0 400 Q200 300 400 400 Q600 500 800 400' stroke='%230B3C5D' fill='none' stroke-width='1.5'/%3E%3Cpath d='M0 350 Q200 250 400 350 Q600 450 800 350' stroke='%230B3C5D' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: "800px 800px",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual panel */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.12)] aspect-[4/3] lg:aspect-[5/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaignImages.creatorSpotlight}
                alt="Students representing their school on the MyLENS platform"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(0.9) contrast(1.08) brightness(0.92)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C5D]/75 via-[#0B3C5D]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                  <School className="w-4 h-4 text-amber-400" strokeWidth={1.6} />
                  <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
                    For Every School
                  </span>
                </div>
                <p
                  className="text-white font-bold text-xl md:text-2xl leading-snug"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  A Platform For Students To Shine
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content panel */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span
              variants={fadeInUp}
              className="text-amber-700 font-sans tracking-widest text-xs uppercase font-bold block mb-4"
            >
              Why Schools Should Join
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-slate-900 font-bold text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight leading-tight mb-5"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              A Platform For Students To Shine
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="w-12 h-1 rounded-full bg-gradient-to-r from-[#1F7A53] to-[#D4A017] mb-6"
            />

            <motion.p
              variants={fadeInUp}
              className="text-gray-600 font-sans text-base leading-relaxed mb-8"
            >
              MyLENS helps schools:
            </motion.p>

            <motion.ul
              variants={staggerContainer}
              className="space-y-4"
            >
              {BENEFITS.map((benefit) => (
                <motion.li
                  key={benefit}
                  variants={fadeInRight}
                  className="flex items-start gap-3.5 group"
                >
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#1F7A53]/10 border border-[#1F7A53]/25 flex items-center justify-center transition-colors group-hover:bg-[#1F7A53]/20">
                    <Check
                      className="w-3.5 h-3.5 text-[#1F7A53]"
                      strokeWidth={2.5}
                    />
                  </span>
                  <span
                    className="text-slate-800 font-sans text-[15px] md:text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
