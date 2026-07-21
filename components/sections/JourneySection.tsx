"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, fadeInUp } from "@/lib/animations";

const STEPS = [
  {
    num: "01",
    label: "Step 1",
    title: "School Registration",
    body: "Selected schools assemble their most passionate storytelling teams and officially register to step onto the national stage.",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    imgAlt: "A casual group of young Asian students sitting together around a table for a relaxed meeting and discussion",
  },
  {
    num: "02",
    label: "Step 2",
    title: "Creator Academy",
    body: "Students unlock deep technical mastery through elite online masterclasses and mentorship sessions led by active industry professionals.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
    imgAlt: "Interactive workshop environment focusing on digital media production",
  },
  {
    num: "03",
    label: "Step 3",
    title: "Video Challenge",
    body: "Armed with cinema-grade workflows, teams venture on-location to capture original visual narratives exploring Malaysia unseen.",
    img: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80",
    imgAlt: "Professional cinema camera on a tripod set up to capture a gorgeous on-location story",
  },
  {
    num: "04",
    label: "Step 4",
    title: "National Selection",
    body: "Submissions enter an intense curation phase where an expert panel of filmmakers and judges shortlist the top cinematic entries.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80",
    imgAlt: "Professional editing bay and post-production screening process",
  },
  {
    num: "05",
    label: "Step 5",
    title: "Youth Creator Awards 2026",
    body: "The journey culminates in a grand gala celebration. Finalists project their works on the big screen and claim national recognition.",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    imgAlt: "Grand award ceremony main stage with a massive projection screen and spectacular lighting",
  },
] as const;

export default function JourneySection() {
  return (
    <section
      id="journey"
      className="bg-white py-24 lg:py-36 overflow-hidden select-none"
    >
      {/* ── SECTION HEADER ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-16 lg:mb-24"
      >
        <span className="text-[#B68A35] font-sans tracking-[0.4em] text-xs uppercase font-bold block mb-4">
          Programme Structure
        </span>
        
        <h2 className="text-[#000000] font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
          The MyLENS Journey
        </h2>
        
        <p className="text-[#000000]/70 font-sans text-base sm:text-lg tracking-wide font-light">
          Learn. Create. Showcase.
        </p>
        
        <div className="w-16 h-[1px] bg-[#B68A35]/40 mx-auto my-6" />
        
        <p className="text-[#000000] font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
          A premium developmental blueprint engineered to transform young perspectives into striking national digital legacies.
        </p>
      </motion.div>

      {/* ── ALTERNATING EDITORIAL STEPS ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col space-y-16 lg:space-y-28">
        {STEPS.map((step, i) => {
          const isEven = i % 2 === 0;

          return (
            <div
              key={step.num}
              className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-24"
            >
              {/* IMAGE MEDIA CONTAINER */}
              <motion.div
                variants={isEven ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={`w-full lg:w-1/2 flex ${isEven ? "lg:justify-start lg:order-1" : "lg:justify-end lg:order-2"}`}
              >
                <motion.div 
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full max-w-2xl aspect-[16/10] overflow-hidden rounded-none shadow-sm hover:shadow-md transition-shadow duration-500 bg-[#000000]/5 border border-[#000000]/5"
                >
                  <Image
                    src={step.img}
                    alt={step.imgAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out grayscale-[10%] group-hover:scale-105"
                  />
                  
                  {/* Subtle Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#000000]/15 to-transparent pointer-events-none" />
                  
                  {/* Minimalist Editorial Frame Corner Accents */}
                  <div
                    className={`absolute bottom-6 ${isEven ? "right-6" : "left-6"} w-6 h-6 pointer-events-none`}
                    style={{
                      borderBottom: "1px solid rgba(182,138,53,0.4)",
                      borderRight: isEven ? "1px solid rgba(182,138,53,0.4)" : undefined,
                      borderLeft: !isEven ? "1px solid rgba(182,138,53,0.4)" : undefined,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* TEXT CONTENT CONTAINER */}
              <motion.div
                variants={isEven ? fadeInRight : fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={`w-full lg:w-1/2 relative flex items-center ${
                  isEven ? "lg:order-2 lg:pl-6" : "lg:order-1 lg:pr-6"
                }`}
              >
                {/* Clean, Scaled Down Editorial Watermark Behind Content */}
                <span
                  className="absolute select-none pointer-events-none font-serif font-bold text-[#B68A35]/10 leading-none"
                  style={{
                    fontSize: "clamp(5rem, 10vw, 7.5rem)",
                    right: isEven ? "2rem" : undefined,
                    left: !isEven ? "2rem" : undefined,
                    top: "-2rem",
                  }}
                  aria-hidden
                >
                  {step.num}
                </span>

                <div className="relative z-10 max-w-lg w-full">
                  {/* Micro Metadata Step Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#B68A35] font-sans tracking-[0.3em] text-xs uppercase font-bold">
                      {step.label}
                    </span>
                    <span className="w-1 h-[1px] bg-[#000000]/20" />
                    <span className="text-[#000000]/40 font-serif text-sm italic">
                      Phase {step.num}
                    </span>
                  </div>

                  {/* Content Container Card */}
                  <div className="bg-[#F8F6F1]/60 hover:bg-[#F8F6F1] border border-[#000000]/05 rounded-[24px] p-6 sm:p-8 transition-all duration-300">
                    {/* Primary Header - Crisp Black */}
                    <h3 className="text-[#000000] font-serif font-bold text-2xl sm:text-3xl tracking-tight leading-tight mb-4">
                      {step.title}
                    </h3>

                    {/* Body Content - Crisp Black */}
                    <p className="text-[#000000] font-sans text-sm sm:text-base leading-relaxed font-light">
                      {step.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}