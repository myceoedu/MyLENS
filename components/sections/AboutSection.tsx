"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Quote } from "lucide-react";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  lineGrow,
  scaleIn,
} from "@/lib/animations";
import { SectionTextureLayer, DecorativeHeader } from "@/components/ui/SectionDecor";
import { campaignImages } from "@/lib/data/campaign-images";
import { featuredStorytellers } from "@/lib/data/featured-storytellers";
import { cn } from "@/lib/utils";

const IMPACT_METRICS = [
  { value: "14", label: "States Explored", sub: "From Perlis to Sabah — one Malaysia" },
  { value: "75", label: "Schools Participating", sub: "Classrooms turned into studios" },
  { value: "300+", label: "Young Storytellers", sub: "Homegrown voices behind every frame" },
  { value: "500+", label: "Hidden Gems Captured", sub: "Places the guidebooks never mention" },
] as const;

const COLLAGE_ITEMS = [
  { key: "kinabalu", label: "Mount Kinabalu", span: "col-span-2 row-span-2" },
  { key: "georgeTown", label: "George Town Heritage", span: "col-span-1 row-span-1" },
  { key: "sarawak", label: "Sarawak Culture", span: "col-span-1 row-span-1" },
  { key: "food", label: "Malaysian Food", span: "col-span-3 row-span-1" },
] as const;

function MalaysiaCollage() {
  const collage = campaignImages.aboutCollage;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 h-[340px] sm:h-[420px] lg:h-[480px]"
    >
      {COLLAGE_ITEMS.map((item, i) => {
        const src = collage[item.key as keyof typeof collage];
        return (
          <motion.div
            key={item.key}
            variants={scaleIn}
            custom={i}
            className={cn(
              "group relative overflow-hidden rounded-sm min-h-0",
              item.span
            )}
          >
            <Image
              src={src}
              alt={item.label}
              fill
              className="object-cover campaign-photo-grade transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <p className="absolute bottom-2.5 left-3 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/90 font-medium">
              {item.label}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function ImpactMetrics() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-2 gap-4 sm:gap-5"
    >
      {IMPACT_METRICS.map((metric, i) => (
        <motion.div
          key={metric.label}
          variants={fadeInUp}
          custom={i}
          className="relative overflow-hidden rounded-sm border border-slate-200/70 bg-white/80 p-5 sm:p-6"
        >
          <div
            className="absolute top-0 left-0 w-full h-0.5 bg-zinc-200/80"
          />
          <p className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {metric.value}
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-slate-800 font-sans font-semibold mt-2">
            {metric.label}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
            {metric.sub}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FeaturedStorytellersRow() {
  return (
    <div>
      <div className="text-center mb-10">
        <p className="section-label-dark text-center">Voices of the Movement</p>
        <h3 className="text-slate-800 font-sans font-semibold text-2xl sm:text-3xl tracking-tight">
          Featured Storytellers
        </h3>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {featuredStorytellers.map((storyteller, i) => (
          <motion.article
            key={storyteller.id}
            variants={fadeInUp}
            custom={i}
            className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
          >
            <div className="relative h-full rounded-sm border border-slate-200/70 bg-white overflow-hidden group hover:shadow-lg hover:shadow-slate-900/5 transition-shadow duration-400">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={storyteller.portrait}
                  alt={storyteller.name}
                  fill
                  className="object-cover object-top campaign-photo-grade transition-transform duration-600 group-hover:scale-105"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  className="absolute top-3 left-3 w-8 h-0.5 rounded-full"
                  style={{ background: storyteller.accent }}
                />
              </div>
              <div className="p-5">
                <p className="text-slate-800 font-sans font-semibold">{storyteller.name}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600 font-sans font-medium mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" strokeWidth={2} />
                  {storyteller.state}
                </p>
                <div className="relative mt-4 pt-3 border-t border-slate-100">
                  <Quote
                    className="absolute -top-1 left-0 w-4 h-4 text-slate-200"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-gray-600 leading-relaxed italic pl-1">
                    &ldquo;{storyteller.quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden">
      <div className="section-white section-textured py-20 lg:py-28">
        <SectionTextureLayer />
        <div
          className="absolute inset-0 opacity-[0.015] bg-[url('/images/batik.jpg')] bg-cover bg-center pointer-events-none filter grayscale"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 lg:mb-20"
          >
            <DecorativeHeader>
              <motion.p variants={fadeInUp} className="section-label-dark mb-4">
                A National Movement
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight"
              >
                A Nation Told Through
                <br />
                Young Eyes
              </motion.h2>
              <motion.div variants={lineGrow} className="accent-line-center mb-8" />
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
              >
                From rainforest canopies to heritage streets, young Malaysians are
                uncovering the places, people, and traditions that make this country
                extraordinary — one story at a time.
              </motion.p>
            </DecorativeHeader>
          </motion.div>

          {/* Collage + narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-20 lg:mb-24">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <MalaysiaCollage />
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col gap-8"
            >
              <div>
                <p className="section-label-dark mb-3">Our Story</p>
                <h3 className="text-slate-800 font-sans font-semibold text-2xl sm:text-3xl mb-5 leading-tight">
                  More Than a Campaign — A Love Letter to Malaysia
                </h3>
                <div className="space-y-4 text-gray-600 font-sans text-sm leading-relaxed">
                  <p>
                    Temples tucked in rainforest. Recipes passed down for generations.
                    Coastlines known only to locals. Across every state, students are
                    stepping forward with cameras and courage — to tell the stories that
                    rarely make the headlines.
                  </p>
                  <p>
                    Each 45-second film is an act of cultural preservation. Heritage
                    honoured. Traditions celebrated. Diversity embraced. This is{" "}
                    <span className="text-slate-800 font-sans font-semibold">
                      national pride in motion
                    </span>{" "}
                    — young creators inviting the world to see their homeland through
                    eyes full of wonder.
                  </p>
                </div>
              </div>
              <ImpactMetrics />
            </motion.div>
          </div>

          {/* Featured storytellers */}
          <div>
            <FeaturedStorytellersRow />
          </div>
        </div>
      </div>
    </section>
  );
}
