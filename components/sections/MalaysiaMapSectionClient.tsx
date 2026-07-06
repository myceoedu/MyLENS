"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, School, Star } from "lucide-react";
import {
  getCampaignMapStats,
  MAX_CREATORS_PER_SCHOOL,
  MAX_SCHOOLS_PER_STATE,
} from "@/lib/config/campaign";
import type { StateData } from "@/lib/data/states";
import type { ParticipatingSchool, PublicMapData } from "@/lib/map/types";
import { cn } from "@/lib/utils";

const MALAYSIA_MAP_SRC = "/images/MALAYSIA.png";

const cinematicEase = [0.25, 1, 0.5, 1] as const;

const STATE_SLOT_VIDEOS = MAX_SCHOOLS_PER_STATE;

function StateDirectoryRow({
  state,
  index,
  isActive,
  onSelect,
}: {
  state: StateData;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group/row flex w-full items-center gap-6 border-b border-black/10 px-2 py-6 text-left transition-all duration-400 ease-out sm:py-7",
        "hover:bg-[#F4F3EE] group-hover/explorer:opacity-40 hover:!opacity-100",
        isActive && "!opacity-100 bg-[#F4F3EE]"
      )}
    >
      <span className="min-w-[32px] font-serif text-sm tracking-wider text-black/30">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-serif text-lg tracking-tight text-[#0B130F] transition-colors duration-400 sm:text-xl",
            "group-hover/row:text-[#B68A35]",
            isActive && "text-[#B68A35]"
          )}
        >
          {state.name}
        </span>
        <span className="mt-1.5 block text-xs font-light text-[#4A544E]/70 sm:hidden">
          {MAX_SCHOOLS_PER_STATE} schools · {STATE_SLOT_VIDEOS} videos
        </span>
      </div>

      <span className="hidden shrink-0 text-xs font-light tracking-wide text-[#4A544E]/70 sm:block">
        {MAX_SCHOOLS_PER_STATE} schools · {STATE_SLOT_VIDEOS} videos
      </span>
    </button>
  );
}

function StateModal({
  state,
  schools,
  onClose,
}: {
  state: StateData;
  schools: ParticipatingSchool[];
  onClose: () => void;
}) {
  const stateCreators = MAX_SCHOOLS_PER_STATE * MAX_CREATORS_PER_SCHOOL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: cinematicEase }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#0B130F]/55 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: cinematicEase }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-black/10 px-8 py-10 sm:px-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center text-[#4A544E] transition-colors hover:text-[#0B130F]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.25} />
          </button>

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#B68A35]">
            {state.region === "east" ? "East Malaysia" : "Peninsular Malaysia"}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#0B130F] sm:text-4xl">
            {state.name}
          </h2>
          <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[#4A544E]">
            {state.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-10 border-t border-black/10 pt-8">
            {[
              { icon: School, value: MAX_SCHOOLS_PER_STATE, label: "Schools" },
              { icon: Video, value: STATE_SLOT_VIDEOS, label: "Videos" },
              { icon: Star, value: stateCreators, label: "Creators" },
            ].map((s) => (
              <div key={s.label}>
                <s.icon className="mb-2 h-4 w-4 text-[#B68A35]" strokeWidth={1.25} />
                <p className="font-serif text-2xl font-bold text-[#0B130F]">{s.value}</p>
                <p className="mt-1.5 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#4A544E]/80">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10 px-8 py-10 sm:px-10">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B68A35]">
              Tourism Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.tourismHighlights.map((h) => (
                <span
                  key={h}
                  className="border border-black/10 px-3 py-1.5 text-sm font-light text-[#4A544E]"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B68A35]">
              Hidden Gems Explored
            </h3>
            <ul className="space-y-3">
              {state.hiddenGems.map((gem, i) => (
                <li key={gem} className="flex items-start gap-4 text-sm font-light text-[#4A544E]">
                  <span className="font-serif text-xs text-[#B68A35]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {gem}
                </li>
              ))}
            </ul>
          </div>

          {schools.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B68A35]">
                Participating Schools
              </h3>
              <div className="divide-y divide-black/10 border-t border-black/10">
                {schools.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-serif text-sm font-medium text-[#0B130F]">{sch.name}</p>
                      <p className="mt-1 text-xs font-light text-[#4A544E]/80">
                        {sch.videoCount} {sch.videoCount === 1 ? "video" : "videos"} ·{" "}
                        {sch.creatorCount} {sch.creatorCount === 1 ? "creator" : "creators"}
                      </p>
                    </div>
                    <span className="text-xs font-medium tracking-wider text-[#B68A35]">
                      {sch.points} pts
                    </span>
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

type MalaysiaMapSectionClientProps = {
  states: StateData[];
  mapData: PublicMapData;
};

export default function MalaysiaMapSectionClient({
  states,
  mapData,
}: MalaysiaMapSectionClientProps) {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const { schoolsByState } = mapData;
  const campaignStats = getCampaignMapStats(states.length);

  const aggregateStats = [
    { label: "Regions", value: String(campaignStats.regions) },
    { label: "Approved Schools", value: String(campaignStats.totalSchools) },
    { label: "Creators Embarked", value: String(campaignStats.totalCreators) },
    { label: "Cinematic Videos", value: String(campaignStats.totalVideos) },
  ];

  return (
    <section
      id="map"
      aria-labelledby="map-heading"
      className="relative overflow-hidden bg-white py-28 lg:py-40"
    >
      <div className="section-topo-texture pointer-events-none absolute inset-0 opacity-[0.02]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[88rem] px-6 sm:px-10 lg:px-16">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: cinematicEase }}
          className="mx-auto mb-20 max-w-3xl text-center lg:mb-28"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[#B68A35]">
            Explore Malaysia
          </p>
          <h2
            id="map-heading"
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#0B130F] sm:text-5xl lg:text-6xl"
          >
            Across The Nation
          </h2>
          <div className="mx-auto my-10 h-px w-16 bg-[#B68A35]/40" aria-hidden />
          <p className="mx-auto max-w-2xl text-base font-light leading-[1.85] text-[#4A544E] sm:text-lg">
            A cultural registry of participating schools and student storytellers — browse each
            state to uncover the narratives shaping Malaysia from every region.
          </p>
        </motion.header>

        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: cinematicEase }}
            className="flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12"
          >
            <div className="relative w-full max-w-2xl">
              <Image
                src={MALAYSIA_MAP_SRC}
                alt="Malaysia — national cultural registry map"
                width={1200}
                height={800}
                priority
                unoptimized
                className="h-auto w-full object-contain grayscale contrast-[1.15] brightness-[1.05] sepia-[0.12] hue-rotate-[15deg] opacity-90"
                style={{ maxHeight: "min(440px, 50vh)" }}
              />
            </div>
            <p className="mt-10 text-xs uppercase tracking-[0.3em] text-black/40">
              Interactive National Atlas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: cinematicEase, delay: 0.08 }}
            className="flex flex-col"
          >
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.4em] text-[#B68A35]">
              Destination Explorer
            </p>

            <div
              className="group/explorer max-h-[min(520px,58vh)] overflow-y-auto border-t border-black/10"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(11,19,15,0.1) transparent",
              }}
            >
              {states.map((state, index) => (
                <StateDirectoryRow
                  key={state.id}
                  state={state}
                  index={index}
                  isActive={selectedState?.id === state.id}
                  onSelect={() => setSelectedState(state)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: cinematicEase }}
          className="mt-24 flex flex-wrap items-start justify-center gap-x-16 gap-y-10 lg:mt-32 lg:gap-x-24"
        >
          {aggregateStats.map((stat) => (
            <div key={stat.label} className="min-w-[130px] text-center">
              <p className="font-serif text-4xl font-bold tracking-tight text-[#0B130F] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-[#4A544E]/65">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedState && (
          <StateModal
            state={selectedState}
            schools={schoolsByState[selectedState.id] ?? []}
            onClose={() => setSelectedState(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
