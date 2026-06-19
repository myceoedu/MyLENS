"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Mail, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { navigateTo } from "@/lib/navigation";
import { SectionTextureLayer } from "@/components/ui/SectionDecor";

const exploreLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Schools", href: "/schools" },
  { label: "Interactive Map", href: "#map" },
  { label: "Stories & Videos", href: "/videos" },
];

const discoverLinks = [
  { label: "Culture & Heritage", href: "#map" },
  { label: "Nature & Wildlife", href: "#map" },
  { label: "Food & Traditions", href: "#map" },
  { label: "Hidden Gems", href: "#map" },
  { label: "State Highlights", href: "#map" },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
];

const supporters = [
  {
    name: "Tourism Malaysia",
    short: "TM",
    accent: "#0B3C5D",
  },
  {
    name: "MCMC",
    short: "MCMC",
    accent: "#1F7A53",
  },
  {
    name: "MDEC",
    short: "MDEC",
    accent: "#C41E3A",
  },
  {
    name: "MyCEO Education",
    short: "MyCEO",
    accent: "#D4A017",
  },
];

const linkClass =
  "text-sm text-gray-600 hover:text-slate-800 transition-colors duration-300 text-left";

const columnLabelClass =
  "text-[11px] tracking-[0.28em] uppercase text-slate-500 font-medium mb-5";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleFooterLink = (href: string) => {
    navigateTo(href, pathname, router);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* ── SECTION 1: Top CTA ── */}
      <section
        className="relative overflow-hidden"
        aria-label="Discover Malaysia call to action"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0B3C5D 0%, #1F7A53 52%, #D4A017 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.06] bg-[url('/images/batik.jpg')] bg-cover bg-center pointer-events-none mix-blend-overlay"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="max-w-3xl"
          >
            <p className="text-[11px] tracking-[0.32em] uppercase text-white/70 font-medium mb-4">
              Malaysia Unseen 2026
            </p>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-[1.15] tracking-tight mb-4">
              Discover Malaysia Through Young Eyes
            </h2>
            <p className="text-base sm:text-lg text-white/85 font-sans leading-relaxed max-w-2xl">
              Thousands of stories, places, cultures, and hidden gems captured by
              the next generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: Main Footer ── */}
      <section
        className="relative section-textured"
        style={{ background: "#F9F8F4" }}
        aria-label="Site footer"
      >
        <SectionTextureLayer />
        <div
          className="absolute inset-0 opacity-[0.018] bg-[url('/images/batik.jpg')] bg-cover bg-center pointer-events-none filter grayscale"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
          >
            {/* Column 1 — Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-2xl sm:text-[1.65rem] font-bold tracking-wide text-slate-900 mb-0.5">
                My<span className="text-[#1F7A53]">LENS</span>
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-slate-400 mb-5">
                Malaysia Unseen 2026
              </p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mb-6">
                Malaysia Unseen 2026 is a nationwide storytelling movement
                empowering students to showcase the beauty, culture, heritage, and
                spirit of Malaysia.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-[11px] tracking-[0.22em] uppercase text-slate-500 hover:text-slate-800 transition-colors font-medium"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Explore */}
            <nav aria-label="Explore">
              <p className={columnLabelClass}>Explore</p>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleFooterLink(link.href)}
                      className={linkClass}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 3 — Discover Malaysia */}
            <nav aria-label="Discover Malaysia">
              <p className={columnLabelClass}>Discover Malaysia</p>
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleFooterLink(link.href)}
                      className={linkClass}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 4 — Contact */}
            <div>
              <p className={columnLabelClass}>Contact</p>
              <a
                href="mailto:myceoedu@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-slate-800 hover:text-slate-900 transition-colors mb-3"
              >
                <Mail className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                myceoedu@gmail.com
              </a>
              <p className="inline-flex items-start gap-2 text-sm text-gray-600 mb-6">
                <MapPin
                  className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <span>
                  Shah Alam, Selangor, Malaysia
                  <br />
                  MyCEO EDUCATION SDN. BHD.
                </span>
              </p>
              <button
                onClick={() => handleFooterLink("#contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors"
              >
                Contact Us
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: Official Supporters ── */}
      <section
        className="relative border-y"
        style={{
          background: "#F9F8F4",
          borderColor: "rgba(15, 23, 42, 0.08)",
        }}
        aria-label="Official supporters"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <p className="text-center text-[11px] tracking-[0.32em] uppercase text-slate-500 font-medium mb-8">
            Officially Supported By
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 items-center">
            {supporters.map((supporter) => (
              <div
                key={supporter.name}
                className="group flex flex-col items-center justify-center text-center cursor-default"
              >
                <div
                  className="flex items-center justify-center w-full h-14 sm:h-16 rounded-lg border border-slate-200/80 bg-white/60 px-4 transition-all duration-500 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-slate-300/80 group-hover:shadow-sm"
                >
                  <span
                    className="text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-colors duration-500 text-slate-500 group-hover:text-[var(--accent)]"
                    style={{ "--accent": supporter.accent } as CSSProperties}
                  >
                    {supporter.short === "TM" ? (
                      <span className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] tracking-[0.28em] text-slate-400 group-hover:text-[#0B3C5D]">
                          Tourism
                        </span>
                        <span className="group-hover:text-[#1F7A53]">Malaysia</span>
                      </span>
                    ) : supporter.short === "MCMC" ? (
                      <span className="text-sm sm:text-base group-hover:text-[#1F7A53]">
                        MCMC
                      </span>
                    ) : supporter.short === "MDEC" ? (
                      <span className="text-sm sm:text-base group-hover:text-[#C41E3A]">
                        MDEC
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-slate-400 group-hover:text-[#D4A017]">
                        MyCEO Education
                      </span>
                    )}
                  </span>
                </div>
                <span className="sr-only">{supporter.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Bottom Bar ── */}
      <section
        className="relative"
        style={{ background: "#F3F2ED" }}
        aria-label="Copyright and legal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs text-slate-500 tracking-wide order-2 md:order-1">
              © 2026 MyLENS Malaysia Unseen
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-serif italic tracking-wide order-1 md:order-2">
              Celebrating Malaysia&apos;s Stories
            </p>

            <div className="flex items-center gap-5 order-3">
              <a
                href="#"
                className="text-[11px] tracking-[0.16em] uppercase text-slate-500 hover:text-slate-800 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-slate-300 text-xs" aria-hidden>
                |
              </span>
              <a
                href="#"
                className="text-[11px] tracking-[0.16em] uppercase text-slate-500 hover:text-slate-800 transition-colors"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
