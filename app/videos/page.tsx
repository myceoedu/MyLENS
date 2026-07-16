import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideosPageHero from "@/components/sections/VideosPageHero";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";

export const metadata: Metadata = {
  title: "Watch Malaysia's Stories",
  description:
    "Browse curated short films from the MyLENS Malaysia Unseen showcase — nature, food, culture, heritage, adventure and hidden gems.",
  alternates: {
    canonical: "/videos",
  },
  openGraph: {
    title: "Watch Malaysia's Stories",
    description:
      "Browse curated short films from the MyLENS Malaysia Unseen showcase — nature, food, culture, heritage, adventure and hidden gems.",
    url: "/videos",
  },
};

export default function VideosPage() {
  return (
    <div className="flex flex-col min-h-screen section-off-white">
      <Navbar />
      <main className="flex-1">
        <VideosPageHero />
        <VideoShowcaseSection />
      </main>
      <Footer />
    </div>
  );
}
