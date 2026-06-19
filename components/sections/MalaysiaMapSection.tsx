"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Video, School, Star } from "lucide-react";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { states, type StateData } from "@/lib/data/states";
import { stateLandscapeImages } from "@/lib/data/state-landscapes";
import { schools } from "@/lib/data/schools";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { SectionTextureLayer, DecorativeHeader } from "@/components/ui/SectionDecor";
import { campaignImages, CANVAS_OFF_WHITE } from "@/lib/data/campaign-images";
import { cn } from "@/lib/utils";

function StateExplorerCard({
  state,
  isHighlighted,
  onSelect,
}: {
  state: StateData;
  isHighlighted: boolean;
  onSelect: () => void;
}) {
  const landscape = stateLandscapeImages[state.id];

  return (
    <motion.button
      variants={fadeInUp}
      onClick={onSelect}
      className={cn(
        "group relative w-full flex items-center justify-between p-3.5 rounded-xl text-left overflow-hidden",
        "border transition-all duration-300 ease-out",
        isHighlighted
          ? "border-zinc-300/80 bg-white shadow-sm"
          : "bg-white border-zinc-200/60 hover:border-zinc-300/80 hover:shadow-sm"
      )}
    >
      {/* Landscape thumbnail fade on hover / selected */}
      {landscape && (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-out",
              isHighlighted ? "opacity-[0.28]" : "opacity-0 group-hover:opacity-[0.22]"
            )}
            style={{
              backgroundImage: `url(${landscape})`,
              filter: "saturate(0.75) contrast(1.05)",
            }}
            aria-hidden
          />
          {/* Left-heavy scrim so text stays readable */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.6) 100%)",
            }}
            aria-hidden
          />
        </>
      )}

      {/* Text */}
      <div className="relative z-10 min-w-0 flex-1">
        <p
          className={cn(
            "font-medium text-[13px] truncate transition-colors duration-200",
            isHighlighted ? "text-slate-800" : "text-slate-800 group-hover:text-slate-900"
          )}
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {state.name}
        </p>
        <p className="text-[11px] mt-0.5 text-gray-600 font-sans">
          {state.schools} schools · {state.videos} videos
        </p>
      </div>

      {/* Pin badge */}
      <div
        className={cn(
          "relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-3",
          "border transition-all duration-300",
          isHighlighted
            ? "bg-zinc-100 border-zinc-200"
            : "bg-white border-zinc-200/60 group-hover:bg-zinc-50 group-hover:border-zinc-300"
        )}
      >
        <MapPin
          className="w-3 h-3"
          style={{ color: "#64748b" }}
          strokeWidth={2}
        />
      </div>
    </motion.button>
  );
}

function StateModal({ state, onClose }: { state: StateData; onClose: () => void }) {
  const stateSchools = schools.filter((s) => s.stateId === state.id).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F2040]/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(27,58,107,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-8 pt-8 pb-6 rounded-t-3xl"
          style={{ background: `linear-gradient(135deg, ${state.color} 0%, ${state.color}cc 100%)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-white/70" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-widest">
              {state.region === "east" ? "East Malaysia" : "Peninsular Malaysia"}
            </span>
          </div>

          <h2
            className="text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {state.name}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            {state.description}
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mt-5">
            {[
              { icon: School, value: state.schools, label: "Schools" },
              { icon: Video,  value: state.videos,  label: "Videos" },
              { icon: Star,   value: state.schools * MAX_CREATORS_PER_SCHOOL, label: "Creators" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
                <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-poppins)" }}>
                  {s.value}
                </p>
                <p className="text-white/60 text-xs uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-7">
          {/* Tourism Highlights */}
          <div>
            <h3 className="text-slate-800 font-sans font-semibold text-sm uppercase tracking-widest mb-3">
              Tourism Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.tourismHighlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-50 text-slate-800 border border-zinc-200/60"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Hidden Gems */}
          <div>
            <h3 className="text-slate-800 font-sans font-semibold text-sm uppercase tracking-widest mb-3">
              Hidden Gems Explored
            </h3>
            <div className="space-y-2">
              {state.hiddenGems.map((gem, i) => (
                <div key={gem} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-zinc-100 text-slate-800">
                    {i + 1}
                  </div>
                  <span className="text-gray-600 font-sans text-sm">{gem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schools */}
          {stateSchools.length > 0 && (
            <div>
              <h3 className="text-slate-800 font-sans font-semibold text-sm uppercase tracking-widest mb-3">
                Participating Schools
              </h3>
              <div className="space-y-2">
                {stateSchools.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#fafaf7] border border-zinc-200/60"
                  >
                    <div>
                      <p className="text-slate-800 font-sans font-semibold text-sm">
                        {sch.name}
                      </p>
                      <p className="text-xs text-gray-600 font-sans">{sch.videosSubmitted} videos · {sch.students.length} creators</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-slate-800">
                      {sch.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MalaysiaMapSection() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  return (
    <section id="map" className="section-white section-textured relative overflow-hidden pt-16 lg:pt-24 pb-24 lg:pb-36">
      <SectionTextureLayer />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <DecorativeHeader>
            <motion.p variants={fadeInUp} className="section-label-dark mb-4">Explore Malaysia</motion.p>
            <motion.h2
              variants={fadeInUp}
              className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight"
            >
              Across The Nation
            </motion.h2>
            <motion.div variants={fadeInUp} className="accent-line-center mb-7" />
            <motion.p variants={fadeInUp} className="text-gray-600 font-sans text-sm leading-relaxed text-lg max-w-2xl mx-auto">
              Explore the official peta Malaysia — click any state to discover participating schools,
              hidden gems, and the homegrown creators behind each story.
            </motion.p>
          </DecorativeHeader>
        </motion.div>

        {/* Map + state directory layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Map image */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 self-stretch"
          >
            <div
              className="
                relative h-full flex flex-col
                rounded-2xl overflow-hidden
                border border-zinc-200/60
                shadow-[0_8px_30px_rgb(0,0,0,0.02)]
              "
              style={{ background: CANVAS_OFF_WHITE }}
            >
              {/* Subtle inner-top shimmer line */}
              <div
                className="absolute top-0 inset-x-0 h-px z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                }}
                aria-hidden
              />

              <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-6 sm:py-8">
                <div
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{
                    background: CANVAS_OFF_WHITE,
                    boxShadow: `inset 0 0 56px rgba(251,251,250,0.95), inset 0 0 24px rgba(239,239,237,0.4)`,
                  }}
                >
                  <Image
                    src={campaignImages.mapTerrain}
                    alt="Peta Malaysia — minimalist terrain map"
                    width={820}
                    height={540}
                    priority
                    className="w-full h-auto object-contain campaign-photo-grade"
                    style={{ maxHeight: "480px", opacity: 0.92 }}
                  />
                  {/* Warm vignette — edges melt into #FBFBFA canvas */}
                  <div className="map-terrain-vignette absolute inset-0 pointer-events-none" aria-hidden />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(251,251,250,0.65) 0%, transparent 16%), linear-gradient(to bottom, rgba(251,251,250,0.6) 0%, transparent 14%), linear-gradient(to left, rgba(251,251,250,0.45) 0%, transparent 12%), linear-gradient(to right, rgba(251,251,250,0.45) 0%, transparent 12%)",
                    }}
                    aria-hidden
                  />
                </div>
              </div>

              {/* Caption bar */}
              <div className="px-6 pb-4 pt-0 flex items-center justify-between">
                <p
                  className="text-[11px] text-[#8A98B0] font-light tracking-wide"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Peta Malaysia · Interactive Directory
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 opacity-70" />
                  <span
                    className="text-[10px] text-[#8A98B0] tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Live
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* State directory sidebar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(45,55,72,0.1) transparent" }}
          >
            {states.map((state) => (
              <StateExplorerCard
                key={state.id}
                state={state}
                isHighlighted={selectedState?.id === state.id}
                onSelect={() => setSelectedState(state)}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom aggregate stats — clean light nature cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14"
        >
          {[
            { label: "Regions", value: "14" },
            { label: "Approved Schools", value: "75" },
            { label: "Creators Embarked", value: "300" },
            { label: "Cinematic Videos", value: "300+" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              className="relative overflow-hidden bg-white border border-zinc-200/80 rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-600/30"
            >
              <div
                className="absolute inset-0 bg-[url('/images/batik.jpg')] bg-cover bg-center opacity-[0.02] pointer-events-none filter grayscale"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <p
                  className="text-slate-900 font-serif font-bold text-3xl md:text-4xl tracking-tight"
                >
                  {stat.value}
                </p>
                <span className="text-zinc-500 font-sans font-bold tracking-widest text-[10px] uppercase mt-2 block">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* State modal */}
      <AnimatePresence>
        {selectedState && (
          <StateModal state={selectedState} onClose={() => setSelectedState(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
