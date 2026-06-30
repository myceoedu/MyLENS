"use client";
  
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Lightbulb,
  Mic2,
  Star,
  HandshakeIcon,
  Smartphone,
  Compass,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const SKILLS = [
  {
    icon: Lightbulb,
    title: "Creative Thinking",
    desc: "Learn how to turn raw ideas into deeply compelling visual stories that reflect local heritage.",
    bgColor: "#FFFFFF", // White
  },
  {
    icon: Mic2,
    title: "Communication Skills",
    desc: "Express structural ideas clearly and with absolute poise through cinematic framing and presentation.",
    bgColor: "#F7F3EC", // Warm Sand
  },
  {
    icon: Star,
    title: "Unwavering Confidence",
    desc: "Build foundational courage to project your original voice and share stories with a global audience.",
    bgColor: "#F5F7F2", // Light Sage
  },
  {
    icon: HandshakeIcon,
    title: "Strategic Teamwork",
    desc: "Collaborate seamlessly with peer creators to map production workflows and deliver unified concepts.",
    bgColor: "#FFFFFF", // White
  },
  {
    icon: Smartphone,
    title: "Digital Mastery",
    desc: "Master modern technical execution, encompassing mobile cinematography, editing, and publishing.",
    bgColor: "#F7F3EC", // Warm Sand
  },
  {
    icon: Compass,
    title: "Visionary Leadership",
    desc: "Take absolute ownership of creative directions, direct peer talent, and represent your school identity.",
    bgColor: "#F5F7F2", // Light Sage
  },
] as const;

export default function StudentGainsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Scroll Progress tracking for the connecting path timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="student-gains"
      ref={containerRef}
      className="relative bg-white text-[#000000] pt-24 lg:pt-36 overflow-hidden select-none"
    >
      {/* ── BACKGROUND ART: TOURISM MALAYSIA TOPOGRAPHIC PATH PATTERN ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] select-none z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <path
            d="M0,150 C400,200 800,50 1200,180 C1600,310 1700,100 1920,220 M0,450 C300,350 700,600 1200,450 C1700,300 1800,550 1920,400 M0,850 C500,900 900,750 1400,950 C1800,1150 1850,850 1920,900"
            fill="none"
            stroke="#B68A35"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ==========================================
              LEFT COLUMN - EDITORIAL STICKY HEADER
          ========================================== */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit z-10">
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#B68A35] font-sans font-bold text-xs tracking-[0.4em] uppercase block mb-4"
            >
              More Than A Competition
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#000000] font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
            >
              What Students Gain
            </motion.h2>

            <div className="w-16 h-[2px] bg-[#B68A35] mb-6" />

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#000000] font-sans text-base leading-relaxed font-light max-w-sm"
            >
              A deliberate developmental landscape engineered to equip young visionaries with professional real-world capabilities.
            </motion.p>
          </div>

          {/* ==========================================
              RIGHT COLUMN - STAGGERED TYPOGRAPHIC CARDS
          ========================================== */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="lg:col-span-8 relative space-y-8"
          >
            {/* Continuous Animated Timeline Line */}
            <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-[#000000]/5 hidden sm:block">
              <motion.div
                style={{ scaleY }}
                className="w-full h-full bg-[#B68A35] origin-top"
              />
            </div>

            {SKILLS.map((skill, index) => {
              const Icon = skill.icon;

              return (
                <motion.div
                  key={skill.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="
                    group
                    relative
                    ml-0
                    sm:ml-12
                    p-8
                    sm:p-10
                    rounded-[24px]
                    backdrop-blur-md
                    border
                    border-[#000000]/5
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-500
                    overflow-hidden
                  "
                  style={{ backgroundColor: `${skill.bgColor}F2` }}
                >
                  {/* Refined, Smaller Background Editorial Number */}
                  <div className="absolute right-8 bottom-6 font-serif text-5xl sm:text-6xl font-bold text-[#B68A35]/15 select-none pointer-events-none leading-none z-0">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Center Path Journey Pointer Node */}
                  <div className="absolute -left-[55px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#B68A35] z-20 hidden sm:flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#000000]" />
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Active Icon Badge */}
                    <div className="w-11 h-11 rounded-xl bg-[#000000] text-white flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-300 group-hover:bg-[#B68A35]">
                      <Icon className="w-4 h-4 stroke-[1.5]" />
                    </div>

                    <div className="flex-1">
                      {/* Card Heading */}
                      <h3 className="text-[#000000] font-serif font-bold text-2xl tracking-tight leading-tight mb-2">
                        {skill.title}
                      </h3>

                      {/* Supporting Body Content */}
                      <p className="text-[#000000] font-sans text-sm sm:text-base leading-relaxed font-light pr-12">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
