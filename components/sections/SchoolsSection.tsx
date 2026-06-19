"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Aperture, Filter } from "lucide-react";
import { schools } from "@/lib/data/schools";
import { states } from "@/lib/data/states";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const ACCENT_GREEN = "#2E8B57";
const ACCENT_GOLD = "#B8860B";

const categoryConfig = {
  national: {
    label: "National Top",
    border: ACCENT_GOLD,
    text: ACCENT_GOLD,
  },
  state: {
    label: "State Winner",
    border: ACCENT_GREEN,
    text: ACCENT_GREEN,
  },
  participant: {
    label: "Participant",
    border: "#CBD5E1",
    text: "#64748B",
  },
};

function SchoolCard({ school }: { school: (typeof schools)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const catCfg = categoryConfig[school.category];

  return (
    <motion.div
      layout
      className="card-lift card-float rounded-xl overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <MapPin
                className="w-3.5 h-3.5 mt-1 flex-shrink-0 text-slate-300"
                strokeWidth={1.5}
              />
              <h3
                className="text-zinc-800 font-sans font-semibold text-[15px] leading-snug tracking-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {school.name}
              </h3>
            </div>
            <p
              className="text-xs text-slate-400 ml-[22px] tracking-wide"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {school.state}
            </p>
          </div>

          <span
            className="flex-shrink-0 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] rounded-sm bg-transparent whitespace-nowrap"
            style={{
              color: catCfg.text,
              border: `1px solid ${catCfg.border}`,
              fontFamily: "var(--font-inter)",
            }}
          >
            {catCfg.label}
          </span>
        </div>

        {/* Metrics — single row, dividers */}
        <div className="flex items-stretch mb-5">
          {[
            { value: school.videosSubmitted, label: "Videos" },
            { value: school.points, label: "Points" },
            { value: school.students.length, label: "Creators" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 text-center py-1 ${
                i < 2 ? "border-r border-slate-200" : ""
              }`}
            >
              <p
                className="text-lg font-semibold text-[#1B2B4B] tabular-nums leading-none"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[9px] text-slate-400 uppercase tracking-[0.18em] mt-1.5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Rank + expand */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p
            className="text-xs text-slate-400 tracking-wide"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span
              className="font-medium text-slate-500 tabular-nums"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              #{school.rank}
            </span>
            <span className="mx-1.5 text-slate-300">·</span>
            National placement
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#2E8B57] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {expanded ? "Hide" : "View"} team
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            </motion.div>
          </button>
        </div>

        {/* Student team */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <Aperture
                    className="w-3 h-3 text-slate-300"
                    strokeWidth={1.5}
                  />
                  <p
                    className="text-[9px] uppercase tracking-[0.18em] text-slate-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Student creators
                  </p>
                </div>
                <ul className="space-y-2">
                  {school.students.map((student) => (
                    <li
                      key={student}
                      className="text-xs text-slate-600 leading-relaxed pl-0"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {student}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface SchoolsSectionProps {
  standalone?: boolean;
}

export default function SchoolsSection({
  standalone = false,
}: SchoolsSectionProps) {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"points" | "rank" | "name">("points");

  const filtered = useMemo(() => {
    let result = [...schools];
    if (selectedState !== "all")
      result = result.filter((s) => s.stateId === selectedState);
    if (selectedCategory !== "all")
      result = result.filter((s) => s.category === selectedCategory);
    if (sortBy === "points") result.sort((a, b) => b.points - a.points);
    else if (sortBy === "rank") result.sort((a, b) => a.rank - b.rank);
    else result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [selectedState, selectedCategory, sortBy]);

  const stateOptions = [
    { id: "all", name: "All States" },
    ...states.map((s) => ({ id: s.id, name: s.name })),
  ];

  const categoryFilters = [
    { id: "all", label: "All" },
    { id: "national", label: "National Top" },
    { id: "state", label: "State Winner" },
    { id: "participant", label: "Participant" },
  ];

  return (
    <section
      id={standalone ? undefined : "schools"}
      className={`section-sky relative overflow-hidden ${standalone ? "py-12 lg:py-16" : "py-24 lg:py-36"}`}
      style={
        standalone
          ? undefined
          : { borderTop: "1px solid rgba(27,58,107,0.06)" }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!standalone && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="section-label-dark mb-4">
              Our Schools
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight"
            >
              Participating Schools
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="accent-line-navy accent-line-center mb-7"
            />
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 font-sans text-sm leading-relaxed text-lg max-w-2xl mx-auto"
            >
              {schools.length} schools from across Malaysia, each fielding a
              team of 4 talented student content creators ready to showcase
              their state.
            </motion.p>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 space-y-6"
        >
          {/* State + sort row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Filter
                className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                strokeWidth={1.5}
              />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full appearance-none bg-transparent border-0 border-b border-slate-200 pl-6 pr-8 py-2.5 text-sm text-[#1B2B4B] outline-none cursor-pointer focus:border-[#2E8B57] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stateOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                strokeWidth={1.5}
              />
            </div>

            <div className="relative max-w-[160px]">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as typeof sortBy)
                }
                className="w-full appearance-none bg-transparent border-0 border-b border-slate-200 pl-0 pr-7 py-2.5 text-sm text-slate-500 outline-none cursor-pointer focus:border-[#2E8B57] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="points">Sort: Points</option>
                <option value="rank">Sort: Rank</option>
                <option value="name">Sort: Name</option>
              </select>
              <ChevronDown
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Category text filters */}
          <nav
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
            aria-label="Filter by category"
          >
            {categoryFilters.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative pb-1 text-sm transition-colors duration-200 ${
                    active
                      ? "text-[#1B2B4B] font-medium"
                      : "text-slate-400 hover:text-slate-600 font-normal"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: ACCENT_GREEN }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Results count */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-xs text-slate-400 tracking-wide mb-7 uppercase"
          style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.08em" }}
        >
          Showing{" "}
          <span className="text-slate-600 normal-case tracking-normal font-medium">
            {filtered.length}
          </span>{" "}
          school{filtered.length !== 1 ? "s" : ""}
          {selectedState !== "all" &&
            ` · ${stateOptions.find((s) => s.id === selectedState)?.name}`}
        </motion.p>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedState}-${selectedCategory}-${sortBy}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((school, i) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
              >
                <SchoolCard school={school} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin
              className="w-8 h-8 text-slate-300 mx-auto mb-4"
              strokeWidth={1.5}
            />
            <p
              className="text-slate-500 font-medium text-sm"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              No schools match this filter.
            </p>
          </div>
        )}

        {/* Bottom stats — editorial, borderless */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-16 pt-10 border-t border-slate-100 max-w-lg mx-auto"
        >
          {[
            { label: "Total Schools", value: `${schools.length}+` },
            { label: "Total Creators", value: `${schools.length * 5}+` },
            { label: "States & Territories", value: "14" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={scaleIn}
              className="text-center"
            >
              <p
                className="text-2xl font-semibold text-[#1B2B4B] tabular-nums"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {s.value}
              </p>
              <p
                className="text-[9px] text-slate-400 uppercase tracking-[0.18em] mt-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
