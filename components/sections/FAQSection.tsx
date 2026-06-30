"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const FAQ_ITEMS = [
  {
    question: "Who can participate?",
    answer: "The program is open to all students aged 16 and 17 years old across Malaysia, regardless of their school category, who are passionate about filmmaking, visual storytelling, and exploring local heritage.",
  },
  {
    question: "How many students per school?",
    answer: "Each participating school is represented by a dedicated team of exactly 4 students within the required 16–17 age bracket, accompanied by an official supervising teacher.",
  },
  {
    question: "What equipment is needed?",
    answer: "No expensive or high-end cinema equipment is required. A standard smartphone or basic digital camera paired with accessible editing software is perfectly sufficient. We value the soul of the story over costly gear.",
  },
  {
    question: "Is prior video experience required?",
    answer: "Not at all. MyLENS is designed as a foundational growth journey. Selected students receive guided learning modules, structural masterclasses, and direct industry mentorship to shape their technical skills from scratch.",
  },
  {
    question: "How are videos judged?",
    answer: "Submissions are evaluated by a distinguished panel of cultural experts and cinematic pioneers based on narrative depth, creative perspective, technical authenticity, and how powerfully they capture the unseen essence of Malaysia.",
  },
  {
    question: "What are the key dates?",
    answer: "The journey unfolds throughout 2026, starting with nationwide registrations, phase-one content masterclasses, submission cut-offs, followed by the exclusive Top 15 Finalist announcements leading into the National Grand Finale Ceremony.",
  },
] as const;

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-28 lg:py-36 bg-[#F6F3ED] text-[#051B10] font-sans border-t border-[#051B10]/08 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Minimalist Elegant Title Block */}
          <div className="w-full lg:w-4/12 lg:sticky lg:top-28">
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#B58A3D] font-medium text-xs tracking-[0.5em] uppercase block mb-4"
            >
              QUESTIONS & ANSWERS
            </motion.span>
            
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#051B10] font-bold text-4xl tracking-tight leading-[1.15] font-serif mb-6"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="w-12 h-px bg-[#B58A3D]/40 mb-6" />
            
            <p className="text-[#4F6457] text-sm font-light leading-relaxed max-w-sm">
              Have other inquiries regarding registration timelines, academic frameworks, or asset submissions? Connect directly with our national secretariat team.
            </p>
          </div>

          {/* Right Column: Clean Premium Minimalist Accordion Stack */}
          <div className="w-full lg:w-8/12 flex flex-col">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <motion.div
                  key={item.question}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="border-b border-[#051B10]/10 py-6 first:pt-0 group"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                  >
                    <span className={`font-serif text-lg sm:text-xl font-medium tracking-tight transition-colors duration-300 ${
                      isOpen ? "text-[#B58A3D]" : "text-[#051B10] group-hover:text-[#113A24]"
                    }`}>
                      {item.question}
                    </span>
                    
                    {/* Ultra-Clean Fine Line Interactive Rotation Indicator */}
                    <div className="relative w-5 h-5 flex items-center justify-center ml-4 flex-shrink-0">
                      <div className="absolute w-4 h-[1.5px] bg-[#B58A3D]" />
                      <motion.div 
                        className="absolute w-[1.5px] h-4 bg-[#B58A3D]"
                        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-2 pr-6 text-[#3A5043] text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}