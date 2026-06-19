"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, School } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { schools } from "@/lib/data/schools";

export default function SchoolsPageHero() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-14 lg:pt-32 lg:pb-16"
      style={{
        background:
          "linear-gradient(135deg, #E8F5EE 0%, #EDF4FB 50%, #F9FAF8 100%)",
        borderBottom: "1px solid rgba(45,55,72,0.06)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(46,139,87,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(27,58,107,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={fadeInUp}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5A6A7E] hover:text-[#2E8B57] transition-colors mb-8"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(46,139,87,0.12)" }}
            >
              <School className="w-5 h-5 text-[#2E8B57]" />
            </div>
            <p className="section-label-dark">Our Schools</p>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="section-title text-4xl sm:text-5xl lg:text-6xl mb-5 tracking-tight"
          >
            Participating Schools
          </motion.h1>

          <motion.div variants={fadeInUp} className="accent-line mb-6" />

          <motion.p
            variants={fadeInUp}
            className="text-gray-600 font-sans text-sm leading-relaxed text-lg max-w-2xl"
          >
            Explore {schools.length}+ schools from across Malaysia — each fielding a team of
            5 student creators ready to showcase their state&apos;s hidden gems.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
