"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const CHAMPION = {
  school: "SMK Kota Kinabalu",
  state: "Sabah",
  videos: 28,
  recognition:
    "Honoured for exceptional storytelling that captures Sabah's natural wonders and cultural spirit on the national stage.",
};

const AWARD_PLAQUES = [
  {
    title: "National Champion Trophy",
    description:
      "The highest honour — awarded to the overall winning school team across all 14 states.",
  },
  {
    title: "Cinematic Excellence Award",
    description:
      "For outstanding camera craft, lighting mastery, and editorial precision in tourism filmmaking.",
  },
  {
    title: "Hidden Gem Discovery Award",
    description:
      "Celebrating the team that unveils Malaysia's most remarkable undiscovered destination.",
  },
  {
    title: "Cultural Heritage Story Award",
    description:
      "Honouring narratives that preserve and illuminate Malaysia's living traditions and heritage.",
  },
  {
    title: "Eco Tourism Champion Award",
    description:
      "Recognising stories that champion sustainable travel and Malaysia's natural ecosystems.",
  },
  {
    title: "People's Choice Tourism Story",
    description:
      "The nation's favourite — voted by audiences across Malaysia and beyond.",
  },
] as const;

function ChampionSpotlight() {
  return (
    <motion.article
      variants={scaleIn}
      className="relative h-full flex flex-col bg-gradient-to-b from-[#022d20] to-[#00120d] text-white rounded-2xl p-8 shadow-xl border border-emerald-950 overflow-hidden"
    >
      {/* Subtle spotlight — no brand-color wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <Trophy
            className="w-5 h-5 text-amber-400 shrink-0"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="text-amber-400 font-sans font-bold tracking-widest text-xs uppercase">
            National Champion 2026
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center lg:text-left py-4">
          <h3 className="text-white font-serif font-bold text-3xl tracking-wide drop-shadow-md">
            {CHAMPION.school}
          </h3>
          <p className="text-emerald-100/80 font-sans font-medium text-sm mt-2">
            {CHAMPION.state} · {CHAMPION.videos} Tourism Videos Submitted
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-emerald-100/60 font-sans text-xs leading-relaxed">
            {CHAMPION.recognition}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function AwardPlaque({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.article
      variants={fadeInUp}
      custom={index}
      className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[168px]"
    >
      <div className="w-8 h-px bg-zinc-200/80 mb-5" aria-hidden />
      <div>
        <h4 className="text-slate-800 font-sans font-semibold text-base tracking-tight mb-2">
          {title}
        </h4>
        <p className="text-gray-600 font-sans text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

export default function CompetitionHubSection() {
  return (
    <section
      id="competition"
      className="relative bg-[#fafaf7] py-24 border-t border-zinc-200/60 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <span className="text-amber-700 font-sans tracking-widest text-xs uppercase font-bold mb-3 block text-center">
            Tourism Storytelling Championship
          </span>
          <h2 className="text-slate-900 font-serif font-bold text-4xl md:text-5xl tracking-tight text-center">
            National Tourism Awards Finale
          </h2>
          <p className="text-zinc-500 font-sans text-sm tracking-wide text-center mb-16 block mt-4">
            Where Malaysia&apos;s finest young storytellers are honoured on the
            national stage — July 2026, Kuala Lumpur
          </p>
        </motion.header>

        {/* Main grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          <div className="lg:col-span-5 min-h-[380px] lg:min-h-[480px]">
            <ChampionSpotlight />
          </div>

          <motion.div
            variants={staggerContainer}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {AWARD_PLAQUES.map((award, i) => (
              <AwardPlaque
                key={award.title}
                title={award.title}
                description={award.description}
                index={i}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
