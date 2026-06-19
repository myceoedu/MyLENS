"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigateTo } from "@/lib/navigation";

const navLinks = [
  { label: "About",        href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Videos",       href: "/videos" },
  { label: "Schools",      href: "/schools" },
  { label: "Competition",  href: "#competition" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const solidNav = !isHome || scrolled;
  useEffect(() => {
    let mounted = true;

    const handleScroll = () => {
      if (mounted) setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const frame = requestAnimationFrame(handleScroll);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    navigateTo(href, pathname, router);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          solidNav
            ? "bg-white/97 backdrop-blur-sm shadow-[0_2px_20px_rgba(45,55,72,0.08)] py-3 border-b border-[rgba(45,55,72,0.06)]"
            : "bg-emerald-950/10 backdrop-blur-md border-b border-white/10 py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300"
                  style={{
                    background: solidNav
                      ? "linear-gradient(135deg, #2E8B57 0%, #52B788 100%)"
                      : "rgba(255,255,255,0.15)",
                    border: solidNav ? "none" : "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>

                <div className="text-left">
                  <span
                    className="block font-bold text-lg leading-none tracking-wide transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: solidNav ? "#1A2332" : "#FFFFFF",
                      fontWeight: 700,
                    }}
                  >
                    My
                    <span style={{ color: solidNav ? "#2E8B57" : "#A8DABD" }}>LENS</span>
                  </span>
                  <span
                    className="block text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5 transition-colors duration-300"
                    style={{ color: solidNav ? "#8A98B0" : "rgba(255,255,255,0.55)" }}
                  >
                    Malaysia Unseen
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-200 group rounded-lg",
                    solidNav
                      ? "text-[#2D3748] hover:text-[#2E8B57] hover:bg-[rgba(46,139,87,0.06)]"
                      : "text-white/80 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]",
                    pathname === link.href && "text-[#2E8B57]"
                  )}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-3/4"
                    style={{ background: solidNav ? "#2E8B57" : "rgba(168,218,189,0.8)" }}
                  />
                </button>
              ))}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className={cn(
                  "hidden sm:inline-flex text-sm font-medium px-4 py-2.5 rounded-full transition-all duration-300",
                  solidNav
                    ? "text-[#2D3748] border border-zinc-200/80 hover:border-emerald-300 hover:text-[#2E8B57] bg-white"
                    : "text-white/90 border border-white/35 hover:bg-white/15 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                )}
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Login
              </Link>

              <motion.button
                onClick={() => handleNavClick("#contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "btn-journey-glow hidden sm:flex items-center gap-2 text-sm px-5 py-2.5 rounded-full font-semibold transition-all duration-300",
                  solidNav
                    ? "bg-emerald-800 text-white hover:bg-emerald-900 shadow-md shadow-emerald-900/20 transition-colors"
                    : "bg-white/15 text-white border border-white/40 hover:bg-white/25 btn-journey-glow-ghost"
                )}
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Join The Journey
              </motion.button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors",
                  solidNav
                    ? "text-[#1A2332] hover:bg-[rgba(46,139,87,0.07)]"
                    : "text-white hover:bg-white/10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                )}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-8"
          >
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045 }}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "text-left text-xl font-semibold py-4 border-b text-[#1A2332] hover:text-[#2E8B57] transition-colors",
                    pathname === link.href && "text-[#2E8B57]"
                  )}
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 600,
                    borderColor: "rgba(45,55,72,0.07)",
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <Link
              href="/login"
              className="text-left text-xl font-semibold py-4 border-b text-[#1A2332] hover:text-[#2E8B57] transition-colors"
              style={{
                fontFamily: "var(--font-poppins)",
                fontWeight: 600,
                borderColor: "rgba(45,55,72,0.07)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              onClick={() => handleNavClick("#contact")}
              className="btn-journey-glow mt-8 text-center text-base font-semibold rounded-full py-4 text-white bg-emerald-800 hover:bg-emerald-900 transition-colors"
              style={{
                boxShadow: "0 6px 20px rgba(21,128,61,0.28)",
              }}
            >
              Join The Journey
            </motion.button>

            <p
              className="mt-auto text-center text-xs tracking-widest uppercase"
              style={{ color: "#8A98B0", fontFamily: "var(--font-inter)" }}
            >
              Malaysia Through Young Visionaries
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
