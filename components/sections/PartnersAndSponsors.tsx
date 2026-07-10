"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  Globe,
  GraduationCap,
  Heart,
  Users,
} from "lucide-react";
import { fadeInUp, standardEase } from "@/lib/animations";
import { campaignImages } from "@/lib/data/campaign-images";
import {
  getSponsorBackingCopy,
  getVisiblePartners,
  partnerGridColsClass,
  type StrategicPartner,
} from "@/lib/config/partners";
import PartnershipInquiryModal from "@/components/partnership/PartnershipInquiryModal";
import { cn } from "@/lib/utils";

const SPONSOR_BENEFITS = [
  {
    title: "CSR Impact",
    desc: "Deliver measurable social value through youth digital literacy, cultural preservation, and education — aligned with national development priorities.",
    icon: Heart,
    featured: false,
  },
  {
    title: "Brand Visibility",
    desc: "Secure premium placement across national event media, press backdrops, award ceremonies, and high-engagement digital showcases viewed nationwide.",
    icon: Eye,
    featured: true,
  },
  {
    title: "Youth Engagement",
    desc: "Connect authentically with Malaysia's most creative student demographic — future consumers, talent, and community leaders aged 16–17.",
    icon: Users,
    featured: false,
  },
  {
    title: "Education Support",
    desc: "Empower schools with filmmaking resources, industry mentorship, and real-world creative exposure that strengthens Malaysia's education ecosystem.",
    icon: GraduationCap,
    featured: false,
  },
  {
    title: "National Exposure",
    desc: "Align your brand with a distinguished cultural initiative documented across tourism media, heritage storytelling, and nationwide campaign channels.",
    icon: Globe,
    featured: true,
  },
] as const;

function PartnerLogoCard({
  partner,
  index,
}: {
  partner: StrategicPartner;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: standardEase, delay: index * 0.05 }}
      className="group relative flex flex-col items-center justify-center bg-white px-8 py-12 text-center transition-colors duration-500 hover:bg-[#FCFBF9]"
    >
      <div className="absolute top-0 right-0 w-0 h-px bg-[#B68A35]/30 transition-all duration-500 group-hover:w-8" />
      <div className="absolute top-0 right-0 h-0 w-px bg-[#B68A35]/30 transition-all duration-500 group-hover:h-8" />

      <div className="flex h-[5rem] w-full max-w-[220px] items-center justify-center px-4 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
        <Image
          src={partner.logo.src}
          alt={partner.logo.alt}
          width={partner.logo.width}
          height={partner.logo.height}
          className="h-auto max-h-[4rem] w-auto max-w-full object-contain"
          sizes="(max-width: 768px) 70vw, 220px"
        />
      </div>

      <div className="mt-8 w-full max-w-[14rem] border-t border-black/[0.06] pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#5A655F] leading-relaxed transition-colors duration-300 group-hover:text-[#B68A35]">
          {partner.role}
        </p>
      </div>

      <span className="sr-only">{partner.name}</span>
    </motion.div>
  );
}

function SponsorBenefitCard({
  benefit,
}: {
  benefit: (typeof SPONSOR_BENEFITS)[number];
}) {
  const Icon = benefit.icon;

  return (
    <motion.article
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        "group relative flex flex-col justify-between border border-transparent bg-[#FAF9F5] transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:border-[#B68A35]/35 hover:bg-white hover:shadow-[0_16px_48px_rgba(11,19,15,0.07)]",
        benefit.featured
          ? "min-h-[280px] p-10 sm:min-h-[300px] sm:p-11 lg:min-h-[320px]"
          : "min-h-[240px] p-8 sm:min-h-[260px] sm:p-9"
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-px w-full transition-colors duration-500",
          benefit.featured ? "bg-[#B68A35]/30 group-hover:bg-[#B68A35]/60" : "bg-black/[0.04] group-hover:bg-[#B68A35]/40"
        )}
      />

      <div>
        <div className="flex items-start justify-between gap-4">
          <Icon
            className="h-[1.125rem] w-[1.125rem] shrink-0 text-[#B68A35]/50 transition-colors duration-300 group-hover:text-[#B68A35]"
            strokeWidth={1.25}
            aria-hidden
          />
        </div>

        <h3
          className={cn(
            "mt-5 font-serif font-bold tracking-tight text-[#0B130F] transition-colors duration-300",
            benefit.featured ? "text-2xl sm:text-[1.6rem] lg:text-[1.75rem]" : "text-xl sm:text-2xl"
          )}
        >
          {benefit.title}
        </h3>

        <p
          className={cn(
            "mt-4 max-w-sm font-light leading-relaxed text-[#5A655F]",
            benefit.featured ? "text-base sm:leading-7" : "text-sm sm:text-[0.95rem] sm:leading-6"
          )}
        >
          {benefit.desc}
        </p>
      </div>
    </motion.article>
  );
}

function SponsorVisualPanel() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group relative min-h-[280px] overflow-hidden bg-[#0B130F] sm:min-h-[320px] lg:min-h-full"
    >
      <Image
        src={campaignImages.creatorSpotlight}
        alt="Young creators capturing Malaysia's stories on film"
        fill
        className="object-cover campaign-photo-grade opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B130F]/95 via-[#0B130F]/35 to-[#0B130F]/10" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 lg:p-11">
        <div className="mb-6 h-px w-10 bg-[#B68A35]/70" aria-hidden />
        <blockquote className="font-serif text-2xl font-light italic leading-snug tracking-tight text-white sm:text-[1.65rem] lg:text-3xl">
          &ldquo;A nation&apos;s story is best told by those who will inherit its future.&rdquo;
        </blockquote>
        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.32em] text-[#B68A35]">
          MyLENS Malaysia Unseen 2026
        </p>
      </div>

      <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 border-t border-r border-[#B68A35]/30" aria-hidden />
    </motion.div>
  );
}

function SponsorCtaBlock({ onOpenPartnership }: { onOpenPartnership: () => void }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative overflow-hidden border border-black/[0.07] bg-white px-8 py-10 sm:px-11 sm:py-12 lg:px-14 lg:py-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(215,179,93,0.06),transparent_45%)] pointer-events-none" />
      <div className="absolute top-0 left-0 h-px w-24 bg-[#B68A35]/50" aria-hidden />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#B68A35]">
            National Partnership
          </p>
          <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#0B130F] sm:text-3xl lg:text-[2.35rem] lg:leading-[1.12]">
            Partner With MyLENS
          </h3>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-[#4A544E] sm:text-[1.05rem] sm:leading-7">
            Speak with our team about sponsorship tiers, brand placement, and CSR alignment for
            your organisation.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onOpenPartnership}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-[#B68A35]/40 bg-[#0B130F] px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:border-[#B68A35]/70 hover:bg-[#152820] lg:self-center"
        >
          Discuss Partnership
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function PartnersAndSponsorsSections() {
  const [partnershipModalOpen, setPartnershipModalOpen] = useState(false);
  const visiblePartners = getVisiblePartners();

  return (
    <div className="bg-[#FAF9F5] text-[#0B130F] font-sans overflow-hidden select-none">
      <PartnershipInquiryModal
        open={partnershipModalOpen}
        onClose={() => setPartnershipModalOpen(false)}
      />
      {/* ── STRATEGIC PARTNERS REGISTRY ── */}
      <section id="strategic-partners" className="relative bg-white py-24 border-t border-black/[0.06] lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(215,179,93,0.02),transparent_40%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#B68A35] font-bold text-xs uppercase tracking-[0.45em] block mb-4"
            >
              Strategic Partners
            </motion.span>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#0B130F] font-serif text-xl sm:text-2xl lg:text-3xl italic leading-relaxed font-light text-balance"
            >
              Supported by institutions driving digital acceleration, cultural preservation, and national youth development frameworks.
            </motion.p>
          </div>

          {visiblePartners.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mx-auto max-w-5xl overflow-hidden bg-black/[0.06] p-px"
            >
              <div className={cn("grid gap-px", partnerGridColsClass(visiblePartners.length))}>
                {visiblePartners.map((partner, idx) => (
                  <PartnerLogoCard key={partner.id} partner={partner} index={idx} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── FOR CORPORATE INVESTORS ── */}
      <section
        id="for-sponsors"
        aria-labelledby="for-sponsors-heading"
        className="relative border-t border-black/[0.06] bg-[#FAF9F5] pt-28 pb-16 lg:pt-36 lg:pb-20"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 bottom-0 w-px bg-black/[0.02]" />
          <div className="absolute top-0 left-3/4 bottom-0 w-px bg-black/[0.02]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,179,93,0.03),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-16 max-w-4xl lg:mb-20">
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-[#B68A35]"
            >
              Partnership Opportunities
            </motion.p>

            <motion.h2
              id="for-sponsors-heading"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#0B130F] sm:text-5xl lg:mb-10 lg:text-6xl"
            >
              Invest In <span className="italic font-normal text-[#B68A35]">Young Talent</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl font-serif text-lg font-light leading-relaxed text-[#4A544E] sm:text-xl sm:leading-[1.7]"
            >
              {getSponsorBackingCopy()}
            </motion.p>
          </div>

          <div className="overflow-hidden border border-black/[0.08] bg-black/[0.08]">
            <div className="grid gap-px md:grid-cols-2 lg:grid-cols-3">
              <SponsorBenefitCard benefit={SPONSOR_BENEFITS[0]} />
              <SponsorBenefitCard benefit={SPONSOR_BENEFITS[1]} />
              <SponsorBenefitCard benefit={SPONSOR_BENEFITS[2]} />
              <SponsorBenefitCard benefit={SPONSOR_BENEFITS[3]} />
              <SponsorBenefitCard benefit={SPONSOR_BENEFITS[4]} />
              <div className="md:col-span-2 lg:col-span-1 lg:row-span-1">
                <SponsorVisualPanel />
              </div>
            </div>
          </div>

          <div className="mt-16 lg:mt-20">
            <SponsorCtaBlock onOpenPartnership={() => setPartnershipModalOpen(true)} />
          </div>
        </div>
      </section>
    </div>
  );
}
