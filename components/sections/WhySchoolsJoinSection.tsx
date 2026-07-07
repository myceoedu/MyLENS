"use client";

import { motion } from "framer-motion";
import { editorialBenefitStagger, fadeInEditorial } from "@/lib/animations";

const BENEFITS = [
  "Discover student talents",
  "Encourage creativity and innovation",
  "Build confidence among students",
  "Showcase student achievements",
  "Gain national recognition",
  "Represent their school with pride",
] as const;

export default function WhySchoolsJoinSection() {
  return (
    <section
      id="why-schools-join"
      aria-labelledby="why-schools-join-heading"
      className="bg-[#FAFAF8] py-20 text-slate-950 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6 sm:px-8 lg:px-10">
        <motion.div
          variants={editorialBenefitStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="grid gap-8 border-b border-black/[0.08] pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div variants={fadeInEditorial}>
              <p className="mb-4 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#0F766E]">
                Why Schools Should Join
              </p>
              <h2
                id="why-schools-join-heading"
                className="max-w-xl font-serif text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[56px]"
              >
                A Platform For Students To Shine
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInEditorial}
              className="flex items-end"
            >
              <p className="max-w-2xl text-base font-light leading-7 text-slate-600 lg:text-lg lg:leading-8">
                MyLENS helps schools discover student talents, encourage creativity and innovation,
                build confidence, and give every school a meaningful platform for national
                recognition.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInEditorial}
            className="mt-10 grid gap-px overflow-hidden border-y border-black/[0.06] bg-black/[0.06] sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map((benefit) => (
              <article
                key={benefit}
                className="group flex min-h-28 items-center bg-[#FAFAF8] p-6 transition-colors duration-300 ease-out hover:bg-white sm:p-7"
              >
                <h3 className="max-w-xs font-serif text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 transition-colors duration-300 ease-out group-hover:text-[#0F766E]">
                  {benefit}
                </h3>
              </article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
