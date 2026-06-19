"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { videoCategories } from "@/lib/data/videos";

export default function VideosPageHero() {
  return (
    <section
      className="relative pt-32 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0F2A1E 0%, #14352A 60%, #1B4D35 100%)" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(46,139,87,0.2), transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(116,198,157,0.12), transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/#videos"
            className="inline-flex items-center gap-2 text-[#74C69D] hover:text-white transition-colors text-sm font-medium"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <p className="text-[#74C69D] text-sm font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Video Showcase
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Watch The{" "}
            <span style={{ color: "#74C69D" }}>Stories</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-8">
            Authentic 45-second films by Malaysian student teams — discover
            hidden gems, local food, cultural traditions, and breathtaking
            landscapes across every state and territory nationwide.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap gap-6"
        >
          {[
            { icon: Play, value: "300+", label: "Videos" },
            { value: "14", label: "States & Territories" },
            { value: `${videoCategories.length}`, label: "Categories" },
            { value: "300+", label: "Student Creators" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-poppins)" }}>
                  {s.value}
                </p>
                <p className="text-white/50 text-xs uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
