"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, standardEase } from "@/lib/animations";
import { partnerLogos } from "@/lib/data/campaign-images";

const PARTNERS = [
  {
    name: "Tourism Malaysia",
    role: "National Tourism Heritage Partner",
    logo: partnerLogos.tourismMalaysia,
  },
  {
    name: "MDEC",
    role: "Digital Acceleration & Innovation Lead",
    logo: partnerLogos.mdec,
  },
  {
    name: "MyCEO Education",
    role: "Academic Excellence & Talent Framework",
    logo: partnerLogos.myceo,
  },
] as const;

const SPONSOR_BENEFITS = [
  { title: "CSR Impact", desc: "Drive meaningful, measurable social change by supporting youth digital literacy and cultural preservation." },
  { title: "Brand Visibility", desc: "Gain premium placement across national event media, press backdrops, and high-engagement digital showcases." },
  { title: "Youth Engagement", desc: "Connect directly with Malaysia's most creative, high-achieving student demographic and future leaders." },
  { title: "Education Support", desc: "Empower schools nationwide with modern filmmaking resources, industry mentorship, and real-world exposure." },
  { title: "National Exposure", desc: "Align your organization with distinguished cultural, heritage, and national development initiatives." },
] as const;

function PartnerLogoCard({
  partner,
  index,
}: {
  partner: (typeof PARTNERS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: standardEase, delay: index * 0.08 }}
      className="group flex flex-col items-center justify-center px-8 py-10 text-center sm:px-10 sm:py-12"
    >
      <div className="flex h-[5rem] w-full max-w-[240px] items-center justify-center px-5 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
        <Image
          src={partner.logo.src}
          alt={partner.logo.alt}
          width={partner.logo.width}
          height={partner.logo.height}
          className="h-auto max-h-[3.75rem] w-auto max-w-full object-contain"
          sizes="(max-width: 768px) 70vw, 240px"
        />
      </div>

      <div className="mt-8 w-full max-w-[16rem] border-t border-[#051B10]/08 pt-5">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#51665A]/90 leading-relaxed">
          {partner.role}
        </p>
      </div>

      <span className="sr-only">{partner.name}</span>
    </motion.div>
  );
}

export default function PartnersAndSponsorsSections() {
  return (
    <div className="bg-white text-[#051B10] font-sans overflow-hidden select-none">
      
      {/* ── SECTION 10: STRATEGIC PARTNERS ── */}
      <section id="strategic-partners" className="bg-white py-24 border-t border-[#051B10]/08 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#B58A3D] font-medium text-xs tracking-[0.5em] uppercase block mb-5"
            >
              Strategic Partners
            </motion.span>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#1E3529] font-serif text-xl sm:text-2xl italic leading-relaxed font-light"
            >
              Supported by organisations that believe in youth development, creativity and nation-building.
            </motion.p>
          </div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-sm border border-[#051B10]/10 bg-white shadow-[0_12px_40px_-24px_rgba(5,27,16,0.18)]"
          >
            <div className="grid grid-cols-1 divide-y divide-[#051B10]/08 md:grid-cols-3 md:divide-x md:divide-y-0">
              {PARTNERS.map((partner, idx) => (
                <PartnerLogoCard key={partner.name} partner={partner} index={idx} />
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── SECTION 11: FOR SPONSORS ── */}
      <section
        id="for-sponsors"
        aria-labelledby="for-sponsors-heading"
        className="border-t border-black/[0.08] bg-white py-28 lg:py-36"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Full-width premium intro */}
          <div className="mb-16 max-w-3xl lg:mb-20">
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#B68A35]"
            >
              Exclusive Corporate Benefits
            </motion.p>

            <motion.h2
              id="for-sponsors-heading"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-[#0B130F] sm:text-5xl lg:text-[3.25rem]"
            >
              Invest In Young Talent
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl font-serif text-lg italic font-light leading-relaxed text-[#4A544E] sm:text-xl"
            >
              Support a national platform that develops future storytellers and celebrates Malaysia
              through youth voices.
            </motion.p>
          </div>

          {/* Premium horizontal benefit grid */}
          <div className="group/grid grid gap-px bg-black/[0.06] md:grid-cols-2 lg:grid-cols-3">
            {SPONSOR_BENEFITS.map((benefit, i) => (
              <motion.article
                key={benefit.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="flex min-h-[240px] flex-col bg-white p-8 transition-all duration-500 ease-out group-hover/grid:opacity-45 hover:!opacity-100 hover:bg-[#FCFBF9] sm:p-10"
              >
                <span className="font-serif text-sm font-medium tracking-[0.2em] text-[#B68A35]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-8 font-serif text-xl font-bold tracking-tight text-[#0B130F] sm:text-2xl">
                  {benefit.title}
                </h3>

                <p className="mt-4 text-sm font-light leading-relaxed text-[#4A544E] sm:text-base">
                  {benefit.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
