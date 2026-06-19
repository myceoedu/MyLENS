import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SchoolsSection from "@/components/sections/SchoolsSection";
import SchoolsPageHero from "@/components/sections/SchoolsPageHero";

export const metadata: Metadata = {
  title: "Participating Schools | MyLENS: MALAYSIA UNSEEN 2026",
  description:
    "Browse 75 participating schools from across every state and territory in MyLENS 2026. Filter by state, category, and explore student creator teams.",
};

export default function SchoolsPage() {
  return (
    <div className="flex flex-col min-h-screen section-off-white">
      <Navbar />
      <main className="flex-1">
        <SchoolsPageHero />
        <SchoolsSection standalone />
      </main>
      <Footer />
    </div>
  );
}
