"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Clapperboard, type LucideIcon } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { SectionTextureLayer, DecorativeHeader } from "@/components/ui/SectionDecor";
import { campaignImages } from "@/lib/data/campaign-images";
import { getPartnersImageAlt, getPartnersTeaserText } from "@/lib/config/partners";
import { cn } from "@/lib/utils";

type HeaderType = "native-image" | "gradient" | "remote-image";

interface FeatureCard {
  id: string;
  label: string;
  title: string;
  teaser: string;
  launchNote: string;
  headerType: HeaderType;
  image?: string;
  imageAlt?: string;
  thumbnailHeight?: string;
  gradientClass?: string;
  icon?: LucideIcon;
}

const features: FeatureCard[] = [
  {
    id: "creators",
    label: "Creator Spotlight",
    title: "Meet The Visionaries",
    teaser: "Homegrown creators and the stories behind their lenses.",
    launchNote: "Launching in Phase 2 — Meet our digital ambassadors soon.",
    headerType: "native-image",
    image: campaignImages.creatorSpotlight,
    imageAlt: "Homegrown creator with camera in Malaysian nature",
  },
  {
    id: "leaderboard",
    label: "Competition",
    title: "National Leaderboard",
    teaser: "Live rankings across schools, states, and submissions nationwide.",
    launchNote: "Launching in Phase 2 — Track the race to the finals.",
    headerType: "gradient",
    thumbnailHeight: "h-32",
    gradientClass: "from-[#14352A] via-[#1F4D3A] to-[#2E8B57]",
    icon: Trophy,
  },
  {
    id: "awards",
    label: "Recognition",
    title: "Awards & Trophies",
    teaser: "Best Hidden Gem, Storytelling, Cinematography, and National Champion.",
    launchNote: "Launching in Phase 2 — Honour rolls and ceremony details.",
    headerType: "remote-image",
    image: campaignImages.sneakPeek.awards,
    imageAlt: "Awards and recognition",
    thumbnailHeight: "h-32",
  },
  {
    id: "sponsors",
    label: "Partners",
    title: "Supported By",
    teaser: getPartnersTeaserText(),
    launchNote: "Launching in Phase 2 — Our partners in discovery.",
    headerType: "remote-image",
    image: campaignImages.sneakPeek.sponsors,
    imageAlt: getPartnersImageAlt(),
    thumbnailHeight: "h-32",
  },
  {
    id: "gallery",
    label: "Gallery",
    title: "Behind The Lens",
    teaser: "Cinematic behind-the-scenes moments from filming across Malaysia.",
    launchNote: "Launching in Phase 2 — Exclusive frames from the field.",
    headerType: "gradient",
    thumbnailHeight: "h-40 sm:h-44",
    gradientClass: "from-[#1A2332] via-[#14352A] to-[#1F6B40]",
    icon: Clapperboard,
  },
];

function GradientCardHeader({
  feature,
}: {
  feature: FeatureCard;
}) {
  const Icon = feature.icon ?? Trophy;

  return (
    <div
      className={cn(
        "relative mx-4 mt-4 overflow-hidden rounded-2xl flex items-center justify-center",
        feature.thumbnailHeight ?? "h-32"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-95",
          feature.gradientClass
        )}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(82,183,136,0.4) 0%, transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/90" strokeWidth={1.25} />
        </div>
        <span
          className="text-[9px] tracking-[0.28em] uppercase text-white/70 font-light"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {feature.label}
        </span>
      </div>
    </div>
  );
}

function TeaserCard({
  feature,
  className,
}: {
  feature: FeatureCard;
  className?: string;
}) {
  return (
    <article
      id={feature.id}
      className={cn(
        "card-lift card-float flex flex-col overflow-hidden rounded-xl",
        "hover:border-[rgba(46,139,87,0.12)] transition-colors duration-300",
        className
      )}
    >
      {feature.headerType === "native-image" && feature.image && (
        <div className="px-4 pt-4 sm:px-5 sm:pt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={feature.image}
            alt={feature.imageAlt ?? ""}
            className="w-full h-48 object-cover rounded-2xl mb-4 campaign-photo-grade"
          />
        </div>
      )}

      {feature.headerType === "gradient" && <GradientCardHeader feature={feature} />}

      {feature.headerType === "remote-image" && feature.image && (
        <div
          className={cn(
            "relative mx-4 mt-4 overflow-hidden rounded-lg",
            feature.thumbnailHeight ?? "h-32"
          )}
        >
          <Image
            src={feature.image}
            alt={feature.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover campaign-photo-grade"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(20,53,42,0.35) 0%, transparent 55%)",
            }}
            aria-hidden
          />
        </div>
      )}

      <div className="flex flex-col flex-1 justify-between p-5 sm:p-6">
        <div>
          {feature.headerType !== "gradient" && (
            <p
              className="text-amber-700 font-sans font-bold tracking-widest text-[10px] uppercase mb-3"
            >
              {feature.label}
            </p>
          )}
          <h3 className="text-zinc-800 font-sans font-semibold text-lg sm:text-xl tracking-wide leading-snug mb-2">
            {feature.title}
          </h3>
          <p className="text-zinc-600 font-sans text-sm leading-relaxed">
            {feature.teaser}
          </p>
        </div>
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-[#8A98B0] font-light mt-5 pt-4 border-t border-[rgba(45,55,72,0.06)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {feature.launchNote}
        </p>
      </div>
    </article>
  );
}

export default function UpcomingFeaturesSection() {
  const creators = features.find((f) => f.id === "creators")!;
  const leaderboard = features.find((f) => f.id === "leaderboard")!;
  const awards = features.find((f) => f.id === "awards")!;
  const sponsors = features.find((f) => f.id === "sponsors")!;
  const gallery = features.find((f) => f.id === "gallery")!;

  return (
    <section
      className="section-off-white section-textured relative overflow-hidden py-24 lg:py-32"
      style={{ borderTop: "1px solid rgba(46,139,87,0.06)" }}
    >
      <SectionTextureLayer />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14 lg:mb-16"
        >
          <DecorativeHeader>
            <motion.p variants={fadeInUp} className="section-label-dark mb-4">
              What&apos;s Next
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="section-title text-emerald-950 font-serif font-bold text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              An Exclusive Sneak Peek
            </motion.h2>
            <motion.div variants={fadeInUp} className="accent-line-center mb-6" />
            <motion.p
              variants={fadeInUp}
              className="text-[#5A6A7E] text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Five experiences in development — curated previews of what arrives in Phase 2.
            </motion.p>
          </DecorativeHeader>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5"
        >
          <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-7 lg:row-span-2">
            <TeaserCard feature={creators} className="h-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-5">
            <TeaserCard feature={leaderboard} />
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-5">
            <TeaserCard feature={awards} />
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-4">
            <TeaserCard feature={sponsors} />
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-8">
            <TeaserCard feature={gallery} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
