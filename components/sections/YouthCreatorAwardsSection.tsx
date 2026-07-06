"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Clapperboard,
  Users,
  Landmark,
  Star,
  ChevronRight,
} from "lucide-react";

const GRAND_FINALE_HIGHLIGHTS = [
  {
    icon: Award,
    title: "National Recognition",
    description: "Celebrating outstanding youth achievements on Malaysia's premier stage.",
  },
  {
    icon: Trophy,
    title: "Top 15 Finalist Teams",
    description: "Honouring the elite cinematic shortlists chosen from across the nation.",
  },
  {
    icon: Star,
    title: "Award Ceremony",
    description: "A prestigious red-carpet gala night recognizing visionary storytellers.",
  },
  {
    icon: Users,
    title: "Industry Exposure",
    description: "Connecting raw passion directly with legendary veteran filmmakers.",
  },
  {
    icon: Clapperboard,
    title: "Showcase Of Winning Stories",
    description: "Premieres screening on ultra-premium cinematic canvases.",
  },
  {
    icon: Landmark,
    title: "Networking Opportunities",
    description: "Forging valuable lifelong blueprints with media powerhouses.",
  },
];

export default function YouthCreatorAwardsSection() {
  return (
    <section
      id="awards"
      className="relative overflow-hidden bg-[#070B09] py-28 md:py-36 text-[#FAFAF9] font-sans select-none"
    >
      {/* ── CINEMATIC BACKLIT STAGE LIGHTING (FIXES THE "TOO DARK" VIBE) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft, deep ambient foundational wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C120F] via-[#070B09] to-[#040605]" />
        
        {/* Luminous upper golden theatrical glow illuminating the section */}
        <div className="absolute right-0 top-0 h-[650px] w-[850px] bg-[radial-gradient(circle_at_top_right,rgba(215,179,93,0.15),transparent_65%)]" />
        
        {/* Luminous lower deep emerald spotlight glow */}
        <div className="absolute left-1/4 bottom-0 h-[550px] w-[750px] bg-[radial-gradient(circle_at_bottom,rgba(20,90,50,0.18),transparent_70%)]" />
        
        {/* Subtle geometric structural mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:gap-20 px-6 sm:px-8 lg:grid-cols-12">

        {/* ── LEFT COLUMN: HERO TEXT PROSE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#D7B35D]/30 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D7B35D]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#D7B35D]">
              Youth Creator Awards 2026
            </span>
          </div>

          <h2 className="mt-8 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
            Where Malaysia&apos;s Young{" "}
            <span className="block italic text-[#D7B35D] font-normal my-1">
              Storytellers
            </span>
            Take The Stage
          </h2>

          <div className="my-8 h-[1px] w-28 bg-gradient-to-r from-[#D7B35D]/50 to-transparent" />

          <p className="text-base sm:text-lg leading-relaxed text-[#D2DDD6] font-light tracking-wide">
            After months of learning, creating and sharing their stories,
            selected finalists gather at the national grand finale to celebrate
            creativity, achievement and the power of youth voices.
          </p>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#A4B3A8] font-light">
            The Youth Creator Awards recognises students who have demonstrated
            exceptional storytelling, structural depth, and profound pride in showcasing
            the heart of Malaysia.
          </p>
        </motion.div>

        {/* ── RIGHT COLUMN: FINALE HIGHLIGHTS PANEL (HIGH CONTRAST GLASS BOARD) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative lg:col-span-7 w-full flex flex-col items-center"
        >
          {/* Main High-Contrast Content Card Container */}
          <div className="relative w-full max-w-2xl rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#131C18]/95 to-[#0A0F0D]/98 p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            
            {/* Header Area */}
            <div className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D7B35D]">
                  Grand Finale Highlights
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#A4B3A8]/50 font-light">
                  Honouring Excellence & Innovation
                </span>
              </div>
              <Award size={18} className="text-[#D7B35D]/70" />
            </div>

            {/* List of 6 Restored Features with high-contrast active hover states */}
            <div className="grid gap-2">
              {GRAND_FINALE_HIGHLIGHTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.4 }}
                    className="group flex items-center justify-between rounded-xl p-3.5 border border-transparent transition-all duration-300 hover:border-white/[0.06] hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-5">
                      {/* Crisp Luxury Dark Mode Icon Frame */}
                      <div className="rounded-xl border border-white/[0.06] bg-[#192520] p-3 transition-all duration-300 group-hover:border-[#D7B35D]/50 group-hover:bg-[#20322A]">
                        <Icon size={18} className="text-[#D7B35D]" />
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <h3 className="font-serif text-lg tracking-wide text-[#FAFAF9] transition-colors duration-300 group-hover:text-[#D7B35D]">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#A4B3A8]/80 font-light max-w-md transition-colors group-hover:text-[#C5D4C9]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                      <ChevronRight size={14} className="text-[#D7B35D] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      <span className="font-serif text-xs font-light tracking-wider text-white/20 transition-colors group-hover:text-[#D7B35D]">
                        0{index + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Premium Decorative Frame Finish Line */}
            <div className="mt-8 pt-2 flex items-center justify-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.08]" />
              <div className="h-1 w-1 rotate-45 border border-[#D7B35D]/40 bg-transparent" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}