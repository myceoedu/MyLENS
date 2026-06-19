import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import MalaysiaMapSection from "@/components/sections/MalaysiaMapSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";
import CompetitionHubSection from "@/components/sections/CompetitionHubSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf7]">
      <Navbar />

      <main className="flex-1">
        {/* ── Phase 1: Complete ── */}
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />

        {/* ── Phase 2: Complete ── */}
        <MalaysiaMapSection />
        <VideoShowcaseSection preview />
        <CompetitionHubSection />

        {/* ── Contact: Complete ── */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
