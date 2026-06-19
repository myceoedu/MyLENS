"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Ultra-subtle topographic texture overlay — pair with section-textured in globals.css */
export function SectionTextureLayer() {
  return <div className="section-topo-texture" aria-hidden="true" />;
}

/** Faint lens rings + organic leaf silhouette behind section headers */
export function DecorativeHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Lens rings */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(360px,90vw)] h-[min(360px,90vw)] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(46,139,87,0.07)" }}
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(240px,70vw)] h-[min(240px,70vw)] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(46,139,87,0.05)" }}
        aria-hidden
      />

      {/* Tropical leaf silhouette */}
      <svg
        className="absolute -right-4 sm:right-8 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 pointer-events-none opacity-[0.035]"
        viewBox="0 0 120 120"
        fill="currentColor"
        style={{ color: "#2E8B57" }}
        aria-hidden
      >
        <path d="M60 8C35 28 18 52 22 78c2 14 12 26 28 32-8-18-2-38 10-52-14 6-24 18-26 34C48 72 72 48 92 24 78 38 68 58 60 8z" />
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Scroll-driven fade-in-up wrapper for headers and grids */
export function ScrollReveal({
  children,
  className,
  variants = fadeInUp,
  delay,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={delay !== undefined ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered scroll reveal for card grids */
export function ScrollRevealGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
