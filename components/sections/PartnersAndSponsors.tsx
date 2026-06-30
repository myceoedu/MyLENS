"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const PARTNERS = [
  { name: "Tourism Malaysia", role: "National Tourism Heritage Partner" },
  { name: "MDEC", role: "Digital Acceleration & Innovation Lead" },
  { name: "MyCEO Education", role: "Academic Excellence & Talent Framework" },
] as const;

const SPONSOR_BENEFITS = [
  { title: "CSR Impact", desc: "Drive meaningful, measurable social change by supporting youth digital literacy and cultural preservation." },
  { title: "Brand Visibility", desc: "Gain premium placement across national event media, press backdrops, and high-engagement digital showcases." },
  { title: "Youth Engagement", desc: "Connect directly with Malaysia's most creative, high-achieving student demographic and future leaders." },
  { title: "Education Support", desc: "Empower schools nationwide with modern filmmaking resources, industry mentorship, and real-world exposure." },
  { title: "National Exposure", desc: "Align your organization with distinguished cultural, heritage, and national development initiatives." },
] as const;

export default function PartnersAndSponsorsSections() {
  return (
    <div className="bg-[#F6F3ED] text-[#051B10] font-sans overflow-hidden select-none">
      
      {/* ── SECTION 10: STRATEGIC PARTNERS ── */}
      <section id="strategic-partners" className="py-24 border-t border-[#051B10]/08">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#B58A3D] font-medium text-xs tracking-[0.5em] uppercase block mb-4"
            >
             
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

          {/* Editorial Wordmark Brand Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {PARTNERS.map((partner, idx) => (
              <motion.div
                key={partner.name}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center justify-center p-8 bg-[#FAF7F2] border border-[#051B10]/04 rounded-2xl group hover:bg-[#FDFCFB] hover:shadow-xl hover:shadow-[#051B10]/02 transition-all duration-500 h-40 text-center"
              >
                <span className="text-[#051B10] font-serif text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-[#B58A3D] transition-colors duration-300">
                  {partner.name}
                </span>
                <span className="text-[#51665A] text-xs tracking-wider uppercase font-light">
                  {partner.role}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 11: FOR SPONSORS ── */}
      <section id="for-sponsors" className="py-28 lg:py-36 border-t border-[#051B10]/08 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Premium Pitch & Statement */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-24">
              <motion.span
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[#B58A3D] font-medium text-xs tracking-[0.5em] uppercase block mb-6"
              >
                
              </motion.span>
              
              <motion.h2
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[#051B10] font-bold text-4xl sm:text-5xl tracking-tight leading-[1.15] font-serif mb-8"
              >
                Invest In Young Talent
              </motion.h2>

              <div className="w-12 h-px bg-[#B58A3D]/40 mb-8" />

              <motion.p
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[#2B3F35] text-lg sm:text-xl font-serif italic leading-relaxed mb-8 border-l-2 border-[#B58A3D]/40 pl-6"
              >
                Support a national platform that develops future storytellers and celebrates Malaysia through youth voices.
              </motion.p>

              <motion.button
                type="button"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4 rounded-full bg-[#051B10] text-[#F6F3ED] hover:bg-[#113A24] shadow-lg shadow-[#051B10]/05 transition-all duration-300"
              >
                Download Investment Prospectus
              </motion.button>
            </div>

            {/* Right Column: Premium Interactive Benefits Grid */}
            <div className="w-full lg:w-7/12 flex flex-col gap-6">
              <span className="text-[#51665A] text-xs font-semibold tracking-[0.2em] uppercase block mb-2">
                EXCLUSIVE CORPORATE BENEFITS
              </span>
              
              <div className="flex flex-col gap-4">
                {SPONSOR_BENEFITS.map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="bg-[#F6F3ED] border border-[#051B10]/04 rounded-2xl p-6 flex items-start gap-5 hover:bg-[#FDFCFB] hover:shadow-lg hover:shadow-[#051B10]/01 transition-all duration-400 group"
                  >
                    {/* Premium Gold Luxury Check Accent */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B58A3D]/10 flex items-center justify-center text-[#B58A3D] mt-0.5 group-hover:bg-[#B58A3D] group-hover:text-[#F6F3ED] transition-all duration-300">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <div>
                      <h3 className="text-[#051B10] font-serif text-lg font-semibold tracking-tight mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-[#4F6457] text-sm leading-relaxed font-light">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}