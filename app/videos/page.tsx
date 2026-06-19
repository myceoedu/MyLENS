import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideosPageHero from "@/components/sections/VideosPageHero";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";

export const metadata = {
  title: "Watch The Stories | MyLENS 2026",
  description:
    "Browse 300+ authentic short videos created by student teams across every state and territory — nature, food, culture, heritage, adventure and hidden gems.",
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
