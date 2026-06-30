import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WhyMyLENSSection from "@/components/sections/WhyMyLENSSection";
import StudentGainsSection from "@/components/sections/StudentGainsSection";
import JourneySection from "@/components/sections/JourneySection";
import YouthCreatorAwardsSection from "@/components/sections/YouthCreatorAwardsSection";
import MalaysiaMapSection from "@/components/sections/MalaysiaMapSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";
import WhySchoolsJoinSection from "@/components/sections/WhySchoolsJoinSection";
import ContactSection from "@/components/sections/ContactSection";
import PartnersAndSponsorsSections from "@/components/sections/PartnersAndSponsors";
import FAQSection from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf7]">
      <Navbar />

      <main className="flex-1">
        {/* ── Phase 1: Complete ── */}
        <HeroSection />
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
