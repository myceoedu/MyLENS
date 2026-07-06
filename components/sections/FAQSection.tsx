"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const FAQ_ITEMS = [
  {
    question: "Who can participate?",
    answer:
      "The program is open to all students aged 16 and 17 years old across Malaysia, regardless of their school category, who are passionate about filmmaking, visual storytelling, and exploring local heritage.",
  },
  {
    question: "How many students per school?",
    answer:
      "Each participating school is represented by a dedicated team of exactly 4 students within the required 16–17 age bracket, accompanied by an official supervising teacher.",
  },
  {
    question: "What equipment is needed?",
    answer:
      "No expensive or high-end cinema equipment is required. A standard smartphone or basic digital camera paired with accessible editing software is perfectly sufficient. We value the soul of the story over costly gear.",
  },
  {
    question: "Is prior video experience required?",
    answer:
      "Not at all. MyLENS is designed as a foundational growth journey. Selected students receive guided learning modules, structural masterclasses, and direct industry mentorship to shape their technical skills from scratch.",
  },
  {
    question: "How are videos judged?",
    answer:
      "Submissions are evaluated by a distinguished panel of cultural experts and cinematic pioneers based on narrative depth, creative perspective, technical authenticity, and how powerfully they capture the unseen essence of Malaysia.",
  },
  {
    question: "What are the key dates?",
    answer:
      "The journey unfolds throughout 2026, starting with nationwide registrations, phase-one content masterclasses, submission cut-offs, followed by the exclusive Top 15 Finalist announcements leading into the National Grand Finale Ceremony.",
  },
] as const;

const accordionEase = [0.04, 0.62, 0.23, 0.98] as const;

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="overflow-hidden bg-white py-28 font-sans text-[#0B130F] select-none lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column — sticky header block */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#B68A35]"
            >
              Questions & Answers
            </motion.p>

            <motion.h2
              id="faq-heading"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-[#0B130F] sm:text-[2.75rem]"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-sm text-sm font-light leading-relaxed text-[#4A544E]"
            >
              Have other inquiries regarding registration timelines, academic frameworks, or asset
              submissions? Connect directly with our national secretariat team.
            </motion.p>
          </div>

          {/* Right Column — accordion stack */}
          <div className="lg:col-span-8">
            <div className="border-t border-black/[0.08]">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIdx === idx;

                return (
                  <motion.div
                    key={item.question}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className={`border-b border-black/[0.08] transition-colors duration-300 ${
                      isOpen
                        ? "border-l-2 border-l-[#B68A35]/40 bg-[#FDFBF7]"
                        : "border-l-2 border-l-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-4 py-6 text-left transition-colors duration-300 hover:bg-[#F9F9F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B68A35]/40 focus-visible:ring-offset-2 sm:py-7"
                    >
                      <span
                        className={`font-serif text-lg font-medium tracking-tight transition-colors duration-300 sm:text-xl ${
                          isOpen ? "text-[#B68A35]" : "text-[#0B130F]"
                        }`}
                      >
                        {item.question}
                      </span>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 stroke-[1.5] text-[#B68A35] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.4, ease: accordionEase },
                              opacity: { duration: 0.3, ease: accordionEase },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: 0.35, ease: accordionEase },
                              opacity: { duration: 0.2, ease: accordionEase },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl px-4 pb-6 text-sm font-light leading-relaxed text-[#4A544E] sm:pb-7 sm:text-base">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
