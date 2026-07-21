import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MalaysiaMapSection from "@/components/sections/MalaysiaMapSection";

/**
 * Below-the-fold sections are code-split into separate chunks (still
 * server-rendered — `ssr: true` is the default) so the initial JS payload
 * only includes what's needed for the hero. Output HTML/design is unchanged.
 */
const CinematicTeaserSection = dynamic(() => import("@/components/sections/CinematicTeaserSection"));
const WhyMyLENSSection = dynamic(() => import("@/components/sections/WhyMyLENSSection"));
const StudentGainsSection = dynamic(() => import("@/components/sections/StudentGainsSection"));
const JourneySection = dynamic(() => import("@/components/sections/JourneySection"));
const YouthCreatorAwardsSection = dynamic(() => import("@/components/sections/YouthCreatorAwardsSection"));
const VideoShowcaseSection = dynamic(() => import("@/components/sections/VideoShowcaseSection"));
const WhySchoolsJoinSection = dynamic(() => import("@/components/sections/WhySchoolsJoinSection"));
const PartnersAndSponsorsSections = dynamic(() => import("@/components/sections/PartnersAndSponsors"));
const FAQSection = dynamic(() => import("@/components/sections/FAQSection"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf7]">
      <Navbar />

      <main className="flex-1">
        {/* ── Phase 1: Complete ── */}
        <HeroSection />
        <CinematicTeaserSection />
        <WhyMyLENSSection />
        <StudentGainsSection />
        <JourneySection />
        <YouthCreatorAwardsSection />
        {/* ── Phase 2: Complete ── */}
        <MalaysiaMapSection />
        <VideoShowcaseSection preview />
        <WhySchoolsJoinSection />
        <PartnersAndSponsorsSections />
        <FAQSection />

        {/* ── Contact: Complete ── */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
