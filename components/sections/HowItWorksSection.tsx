"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { School, Users, Camera, Globe2, MapPin, Compass } from "lucide-react";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { DecorativeHeader } from "@/components/ui/SectionDecor";
import { campaignImages } from "@/lib/data/campaign-images";

const CHAPTERS = [
  {
    step: "01",
    icon: School,
    title: "Schools Register",
    subtitle: "The invitation",
    description:
      "Schools from every corner of Malaysia answer the call — each state sending its finest institutions to represent their homeland.",
  },
  {
    step: "02",
    icon: Users,
    title: "Creators Assemble",
    subtitle: "The visionaries",
    description:
      "Four young creators form a storytelling team — digital ambassadors carrying the voice of their school, community, and nation.",
  },
  {
    step: "03",
    icon: Camera,
    title: "Capture the Unseen",
    subtitle: "The journey",
    description:
      "Teams venture into their landscapes to discover hidden gems — heritage, culture, nature, and the flavours that define a place.",
  },
  {
    step: "04",
    icon: Globe2,
    title: "Share with the Nation",
    subtitle: "The premiere",
    description:
      "Completed films are celebrated on the national stage — judged, honoured, and preserved as part of Malaysia's living story.",
  },
] as const;

function JourneyDecor() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.06] bg-[url('/images/batik.jpg')] bg-cover bg-center pointer-events-none filter grayscale"
        aria-hidden
      />
      <div className="section-topo-texture opacity-[0.05]" aria-hidden />
      <svg
        className="absolute top-24 right-8 w-40 h-40 opacity-[0.05] pointer-events-none"
        viewBox="0 0 160 160"
        aria-hidden
      >
        <ellipse cx="80" cy="80" rx="70" ry="42" fill="none" stroke="#0A1F44" strokeWidth="0.6" />
        <ellipse cx="80" cy="80" rx="50" ry="30" fill="none" stroke="#0E5A44" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute bottom-40 left-4 w-56 h-24 opacity-[0.06] pointer-events-none"
        viewBox="0 0 280 80"
        aria-hidden
      >
        <path
          d="M0 40 C60 20 120 60 180 35 S260 15 280 40"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
      </svg>
    </>
  );
}

function JourneyTimeline() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative mb-20 lg:mb-28"
    >
      {/* Horizontal journey line — desktop */}
      <div
        className="hidden lg:block absolute top-[3.25rem] left-[12%] right-[12%] h-px z-0 bg-zinc-200/80"
        aria-hidden
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        {CHAPTERS.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <motion.article
              key={chapter.step}
              variants={fadeInUp}
              custom={index}
              className="relative flex flex-col items-center lg:items-start text-center lg:text-left px-2 lg:px-4"
            >
              <div className="relative mb-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto lg:mx-0 transition-transform duration-400 hover:scale-105 bg-white border border-zinc-200/60 shadow-sm">
                  <Icon className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-1 -right-2 lg:-right-4 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-800 text-white border-2 border-[#fafaf7]">
                  {index + 1}
                </span>
              </div>

              <span className="text-4xl sm:text-5xl font-serif font-light leading-none mb-4 select-none text-zinc-200">
                {chapter.step}
              </span>

              <p className="text-amber-700 font-sans tracking-widest text-xs uppercase font-bold mb-2">
                {chapter.subtitle}
              </p>

              <h3 className="text-slate-800 font-sans font-semibold text-xl sm:text-2xl mb-4 leading-snug tracking-tight">
                {chapter.title}
              </h3>

              <p className="text-gray-600 font-sans text-sm leading-relaxed max-w-xs mx-auto lg:mx-0">
                {chapter.description}
              </p>

              {index < CHAPTERS.length - 1 && (
                <div className="lg:hidden w-px h-10 mx-auto mt-10 bg-zinc-200" aria-hidden />
              )}
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

function CinematicHeroBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative w-full group"
    >
      <div
        className="relative overflow-hidden rounded-[24px]"
        style={{
          height: "clamp(550px, 65vh, 650px)",
          boxShadow:
            "0 24px 64px rgba(10,31,68,0.14), 0 8px 24px rgba(10,31,68,0.08)",
        }}
      >
        <motion.div
          className="absolute inset-0 scale-105"
          style={{ y: imageY }}
        >
          <Image
            src={campaignImages.bannerLandscape}
            alt="Panoramic Malaysian landscape — mountains, heritage, and rainforest"
            fill
            className="object-cover campaign-photo-grade transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="100vw"
            priority={false}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,31,68,0.88) 0%, rgba(10,31,68,0.35) 45%, rgba(10,31,68,0.12) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,90,68,0.3) 0%, transparent 55%)",
          }}
          aria-hidden
        />

        {/* Overlay content — bottom-left */}
        <motion.div
          style={{ y: contentY }}
          className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 lg:p-12 max-w-2xl"
        >
          <p
            className="text-[11px] tracking-[0.32em] uppercase font-semibold mb-4 flex items-center gap-2"
            style={{ color: "#D4AF37" }}
          >
            <Compass className="w-3.5 h-3.5" strokeWidth={2} />
            Discover Malaysia
          </p>

          <blockquote className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F0] leading-[1.15] tracking-tight mb-5">
            &ldquo;Every hidden gem has a story waiting to be told.&rdquo;
          </blockquote>

          <p className="text-sm sm:text-base text-white/75 leading-relaxed font-sans mb-7 max-w-xl">
            From the mountains of Sabah to the heritage streets of Melaka, young
            creators uncover the people, culture, traditions and destinations that
            make Malaysia extraordinary.
          </p>

          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold"
            style={{
              color: "#FAF7F0",
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.4)",
            }}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={2} />
            14 States &bull; 75 Schools &bull; 300 Creators
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden pt-28 lg:pt-36 pb-0 bg-[#fafaf7]"
    >
      <JourneyDecor />

      <div
        className="absolute top-0 inset-x-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20 lg:mb-28"
        >
          <DecorativeHeader>
            <motion.p variants={fadeInUp} className="section-label-dark">
              The Creative Journey
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="section-title text-4xl sm:text-5xl lg:text-[3.5rem] mb-8 tracking-tight"
            >
              How It Unfolds
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-16 h-px mx-auto mb-8 bg-zinc-200"
            />
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 font-sans text-sm leading-relaxed max-w-xl mx-auto"
            >
              Four chapters in an extraordinary journey — from first registration
              to the national stage.
            </motion.p>
          </DecorativeHeader>
        </motion.header>

        {/* Four chapters */}
        <JourneyTimeline />

        {/* Cinematic hero storytelling moment */}
        <div className="mb-16 lg:mb-20">
          <CinematicHeroBlock />
        </div>
      </div>

      {/* Registration banner */}
      <motion.section
        id="registration-banner"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative overflow-hidden w-full pt-14 md:pt-20 pb-14 md:pb-20"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0] via-[#F5F2EA] to-white pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[url('/images/batik.jpg')] bg-cover bg-center opacity-[0.07] pointer-events-none filter grayscale"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label-dark">Begin Your Chapter</p>
          <h3 className="text-slate-800 font-sans font-semibold text-2xl sm:text-3xl lg:text-4xl mb-5 leading-snug">
            Your Story Deserves
            <br />
            To Be Seen
          </h3>
          <p className="text-gray-600 font-sans text-sm leading-relaxed max-w-md mx-auto mb-10">
            Register your school and let your youth teams become Malaysia&apos;s
            next generation of digital tourism storytellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm px-10 py-3.5 tracking-wide font-semibold rounded-full transition-colors bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            >
              Register Your School
            </motion.button>
            <motion.button
              onClick={() =>
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm px-10 py-3.5 tracking-wide font-semibold rounded-full transition-colors border bg-white/90 text-slate-800 border-zinc-200/60 hover:border-zinc-300"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.section>
    </section>
  );
}
