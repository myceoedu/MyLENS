"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight } from "lucide-react";
import {
  videos,
  videoCategories,
  storyDestinationImages,
  categoryColors,
  type Video,
  type VideoCategory,
} from "@/lib/data/videos";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";
import { SectionTextureLayer, DecorativeHeader } from "@/components/ui/SectionDecor";
import { cn } from "@/lib/utils";

function getStoryImage(video: Video) {
  return storyDestinationImages[video.thumbnail] ?? "/images/about-nature.jpg";
}

/* ─── Category badge ───────────────────────────────────────────────────────── */
function CategoryBadge({
  category,
  size = "md",
}: {
  category: VideoCategory;
  size?: "sm" | "md";
}) {
  const colors = categoryColors[category];
  return (
    <span
      className={cn(
        "inline-block font-semibold uppercase tracking-[0.14em] backdrop-blur-sm",
        size === "sm" ? "px-2 py-0.5 text-[8px]" : "px-2.5 py-1 text-[9px]"
      )}
      style={{
        color: colors.color,
        backgroundColor: "rgba(255,255,255,0.92)",
        border: `1px solid ${colors.color}22`,
      }}
    >
      {category}
    </span>
  );
}

/* ─── Cinematic play icon ──────────────────────────────────────────────────── */
function CinematicPlayIcon({
  size = "md",
  persistent = false,
}: {
  size?: "sm" | "md" | "lg";
  persistent?: boolean;
}) {
  const dim = size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-9 h-9";
  const icon = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3 h-3";

  return (
    <div
      className={cn(
        dim,
        "rounded-full border border-white/70 bg-black/25 backdrop-blur-sm flex items-center justify-center",
        "transition-all duration-400",
        persistent
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
      )}
    >
      <Play className={cn(icon, "text-white fill-white ml-0.5")} strokeWidth={1} />
    </div>
  );
}

/* ─── Story player modal ───────────────────────────────────────────────────── */
function StoryPlayerModal({ story, onClose }: { story: Video; onClose: () => void }) {
  const image = getStoryImage(story);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#0B1A14]/94 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={story.title}
            fill
            className="object-cover campaign-photo-grade"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-white/60 bg-black/30 backdrop-blur-sm flex items-center justify-center mb-4">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" strokeWidth={1} />
            </div>
            <p className="text-white/55 text-[10px] tracking-[0.28em] uppercase">
              Story preview coming soon
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <CategoryBadge category={story.category} />
            <h3 className="font-serif font-bold text-white text-2xl sm:text-3xl leading-snug mt-3 tracking-tight">
              {story.title}
            </h3>
            <p className="text-white/65 text-xs tracking-[0.18em] uppercase mt-2">
              {story.state} · {story.creator} · {story.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="bg-[#F9F8F4] px-6 py-5 border-t border-slate-200/60">
          <p className="text-xs tracking-[0.16em] uppercase text-slate-500 mb-1">
            {story.state}
          </p>
          <p className="text-slate-800 font-medium">{story.creator}</p>
          <p className="text-gray-600 text-sm mt-1">{story.school}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Featured story card (2× footprint) ───────────────────────────────────── */
function FeaturedStoryCard({
  story,
  onPlay,
  className,
}: {
  story: Video;
  onPlay: () => void;
  className?: string;
}) {
  const image = getStoryImage(story);

  return (
    <button
      type="button"
      onClick={onPlay}
      className={cn(
        "card-lift card-float group block w-full h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[480px] text-left cursor-pointer rounded-sm overflow-hidden",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={image}
          alt={story.title}
          fill
          className="object-cover campaign-photo-grade transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="absolute top-4 left-4 z-20">
          <CategoryBadge category={story.category} />
        </div>
        <div className="absolute top-4 right-4 z-20">
          <span className="px-2.5 py-1 text-[9px] tracking-[0.18em] uppercase font-medium text-white/90 border border-white/25 bg-black/30 backdrop-blur-sm">
            {story.duration}
          </span>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <CinematicPlayIcon size="lg" persistent />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 lg:p-8">
          <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-white/60 mb-2">
            {story.state}
          </p>
          <h3 className="font-serif font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-[1.12] tracking-tight mb-3 max-w-lg">
            {story.title}
          </h3>
          <p className="text-sm text-white/75 tracking-wide">
            {story.creator}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ─── Standard story card ──────────────────────────────────────────────────── */
function StoryCard({
  story,
  onPlay,
  className,
}: {
  story: Video;
  onPlay: () => void;
  className?: string;
}) {
  const image = getStoryImage(story);

  return (
    <button
      type="button"
      onClick={onPlay}
      className={cn(
        "card-lift group block w-full min-w-0 text-left cursor-pointer rounded-sm overflow-hidden",
        className
      )}
    >
      <div className="relative overflow-hidden aspect-[4/3] w-full">
        <Image
          src={image}
          alt={story.title}
          fill
          className="object-cover campaign-photo-grade transition-transform duration-600 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-transparent" />

        <div className="absolute top-2.5 left-2.5 z-20">
          <CategoryBadge category={story.category} size="sm" />
        </div>
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="px-1.5 py-0.5 text-[8px] tracking-[0.14em] uppercase text-white/85 border border-white/20 bg-black/25 backdrop-blur-sm">
            {story.duration}
          </span>
        </div>

        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <CinematicPlayIcon size="sm" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/55 mb-1 truncate">
            {story.state}
          </p>
          <h3 className="font-serif font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2">
            {story.title}
          </h3>
        </div>
      </div>
    </button>
  );
}

/* ─── Category filter pills ────────────────────────────────────────────────── */
function StoryCategoryPills({
  active,
  onChange,
}: {
  active: VideoCategory | "All";
  onChange: (cat: VideoCategory | "All") => void;
}) {
  const tabs: { id: VideoCategory | "All"; label: string }[] = [
    { id: "All", label: "All Stories" },
    ...videoCategories.map((cat) => ({ id: cat, label: cat })),
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      role="tablist"
      aria-label="Story categories"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-[11px] tracking-[0.14em] uppercase font-medium transition-all duration-300",
              isActive
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-gray-600 border border-zinc-200/60 hover:border-zinc-300 hover:text-slate-800"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Homepage storytelling gallery ────────────────────────────────────────── */
const HOMEPAGE_STORY_COUNT = 5;

function getHomepageStories(category: VideoCategory | "All"): Video[] {
  const pool =
    category === "All"
      ? [...videos].filter((v) => v.featured).sort((a, b) => b.views - a.views)
      : videos.filter((v) => v.category === category);

  if (pool.length >= HOMEPAGE_STORY_COUNT) {
    return pool.slice(0, HOMEPAGE_STORY_COUNT);
  }

  const featured = [...videos]
    .filter((v) => v.featured)
    .sort((a, b) => b.views - a.views);

  const merged = [...pool];
  for (const v of featured) {
    if (merged.length >= HOMEPAGE_STORY_COUNT) break;
    if (!merged.find((m) => m.id === v.id)) merged.push(v);
  }
  return merged.slice(0, HOMEPAGE_STORY_COUNT);
}

function HomeStoryGallery({ onBrowseAll }: { onBrowseAll: () => void }) {
  const [activeCategory, setActiveCategory] = useState<VideoCategory | "All">("All");
  const [activeStory, setActiveStory] = useState<Video | null>(null);
  const picks = getHomepageStories(activeCategory);
  const [hero, ...supporting] = picks;

  if (!hero) return null;

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeInUp} className="mb-10">
          <StoryCategoryPills active={activeCategory} onChange={setActiveCategory} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-fr"
          >
            <motion.div
              variants={scaleIn}
              className="col-span-2 row-span-2 min-h-[320px] sm:min-h-[380px] lg:min-h-[480px]"
            >
              <FeaturedStoryCard story={hero} onPlay={() => setActiveStory(hero)} />
            </motion.div>

            {supporting.map((story, i) => (
              <motion.div key={story.id} variants={scaleIn} custom={i} className="min-w-0">
                <StoryCard story={story} onPlay={() => setActiveStory(story)} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div variants={fadeInUp} className="mt-12 lg:mt-14 text-center">
          <h3 className="text-slate-900 font-serif font-bold text-2xl sm:text-3xl tracking-tight mb-6">
            Explore Malaysia Through Student Eyes
          </h3>
          <button
            onClick={onBrowseAll}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold tracking-wide transition-colors shadow-lg"
          >
            View All Stories
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {activeStory && (
          <StoryPlayerModal story={activeStory} onClose={() => setActiveStory(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Full gallery: legacy cinematic card (gradients) ──────────────────────── */
function CinematicVideoCard({
  video,
  variant = "standard",
  className,
  onPlay,
}: {
  video: Video;
  variant?: "hero" | "standard" | "compact";
  className?: string;
  onPlay: () => void;
}) {
  const image = getStoryImage(video);
  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <button
      type="button"
      onClick={onPlay}
      className={cn("card-lift group block w-full min-w-0 text-left cursor-pointer rounded-sm overflow-hidden", className)}
    >
      <div className={cn("relative overflow-hidden w-full", isHero ? "aspect-[16/10]" : "aspect-video")}>
        <Image
          src={image}
          alt={video.title}
          fill
          className="object-cover campaign-photo-grade transition-transform duration-600 ease-out group-hover:scale-105"
          sizes={isHero ? "50vw" : "33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

        <div className="absolute top-2 left-2 z-20">
          <CategoryBadge category={video.category} size={isCompact ? "sm" : "md"} />
        </div>
        <div className="absolute top-2 right-2 z-20">
          <span
            className={cn(
              "tracking-[0.16em] uppercase text-white/90 border border-white/25 bg-black/25 backdrop-blur-sm",
              isCompact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[9px]"
            )}
          >
            {video.duration}
          </span>
        </div>

        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <CinematicPlayIcon size={isHero ? "lg" : isCompact ? "sm" : "md"} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 mb-1 truncate">
            {video.state} · {video.creator}
          </p>
          <h3
            className={cn(
              "font-serif text-white leading-snug",
              isHero
                ? "font-bold text-xl sm:text-2xl line-clamp-2"
                : isCompact
                  ? "font-semibold text-sm line-clamp-2"
                  : "font-semibold text-base line-clamp-2"
            )}
          >
            {video.title}
          </h3>
        </div>
      </div>
    </button>
  );
}

function EditorialCategoryTabs({
  active,
  onChange,
  showCounts = false,
}: {
  active: VideoCategory | "All";
  onChange: (cat: VideoCategory | "All") => void;
  showCounts?: boolean;
}) {
  const tabs: { id: VideoCategory | "All"; label: string; count?: number }[] = [
    { id: "All", label: "All", count: videos.length },
    ...videoCategories.map((cat) => ({
      id: cat,
      label: cat,
      count: videos.filter((v) => v.category === cat).length,
    })),
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-slate-200/70 pb-px"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-3 text-sm tracking-wide transition-colors duration-300",
              isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span className={cn(isActive && "font-semibold")}>
              {tab.label}
              {showCounts && tab.count !== undefined && (
                <span className="ml-1.5 text-[10px] tracking-wider text-slate-400 font-normal">
                  {tab.count}
                </span>
              )}
            </span>
            <span
              className={cn(
                "absolute bottom-0 left-0 right-0 h-px bg-slate-900 transition-transform duration-300 origin-left",
                isActive ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function CategoryRow({
  category,
  videoList,
  onPlay,
}: {
  category: VideoCategory;
  videoList: Video[];
  onPlay: (video: Video) => void;
}) {
  const filtered = videoList.filter((v) => v.category === category);
  if (!filtered.length) return null;

  return (
    <div className="mb-16">
      <div className="flex items-baseline justify-between mb-6 border-b border-slate-200/60 pb-4">
        <h3 className="text-slate-800 font-sans font-semibold text-xl tracking-tight">
          {category}
        </h3>
        <span className="text-[10px] tracking-[0.22em] uppercase text-slate-400">
          {filtered.length} stories
        </span>
      </div>

      <div
        className="flex gap-5 overflow-x-auto pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {filtered.map((video) => (
          <div key={video.id} className="flex-shrink-0 w-72 sm:w-80">
            <CinematicVideoCard video={video} onPlay={() => onPlay(video)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedStrip({
  featuredVideos,
  onPlay,
}: {
  featuredVideos: Video[];
  onPlay: (video: Video) => void;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-16"
    >
      <motion.div
        variants={fadeInUp}
        className="flex items-baseline justify-between mb-6 border-b border-slate-200/60 pb-4"
      >
        <h3 className="text-slate-800 font-sans font-semibold text-xl tracking-tight">
          Featured Destinations
        </h3>
        <span className="text-[10px] tracking-[0.22em] uppercase text-slate-400">
          Editor&apos;s Selection
        </span>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {featuredVideos.slice(0, 4).map((video, i) => (
          <motion.div key={video.id} variants={scaleIn} custom={i}>
            <CinematicVideoCard video={video} onPlay={() => onPlay(video)} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main export ──────────────────────────────────────────────────────────── */
export default function VideoShowcaseSection({ preview = false }: { preview?: boolean }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<VideoCategory | "All">("All");
  const [modalVideo, setModalVideo] = useState<Video | null>(null);
  const featuredVideos = videos.filter((v) => v.featured);

  const goToVideos = () => router.push("/videos");

  const filteredByCategory =
    activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory);

  const sectionHeader = (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-12 lg:mb-14"
    >
      <DecorativeHeader>
        <motion.p variants={fadeInUp} className="section-label-dark mb-4">
          {preview ? "Malaysia Unseen" : "Story Gallery"}
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight"
        >
          {preview ? "Stories Across Malaysia" : "Every Story, Every State"}
        </motion.h2>
        <motion.div variants={fadeInUp} className="accent-line-center mb-7" />
        <motion.p
          variants={fadeInUp}
          className="text-gray-600 font-sans text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          {preview
            ? "From rainforest canopies to hidden villages — student creators capture the destinations, cultures, and untold beauty of Malaysia."
            : "Authentic stories by student creators across every state and territory nationwide."}
        </motion.p>
      </DecorativeHeader>
    </motion.div>
  );

  if (preview) {
    return (
      <section
        id="videos"
        className="section-off-white section-textured relative overflow-hidden py-20 lg:py-28"
        style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
      >
        <SectionTextureLayer />
        <div
          className="absolute inset-0 opacity-[0.015] bg-[url('/images/batik.jpg')] bg-cover bg-center pointer-events-none filter grayscale"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <HomeStoryGallery onBrowseAll={goToVideos} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="videos"
      className="section-off-white section-textured relative overflow-hidden py-24 lg:py-36"
      style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
    >
      <SectionTextureLayer />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionHeader}
        <FeaturedStrip featuredVideos={featuredVideos} onPlay={setModalVideo} />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <EditorialCategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
            showCounts
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {activeCategory === "All" ? (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {videoCategories.map((cat) => (
                <CategoryRow key={cat} category={cat} videoList={videos} onPlay={setModalVideo} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            >
              {filteredByCategory.map((video) => (
                <CinematicVideoCard key={video.id} video={video} onPlay={() => setModalVideo(video)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center">
          <h3 className="text-slate-900 font-serif font-bold text-2xl tracking-tight mb-6">
            Explore Malaysia Through Student Eyes
          </h3>
        </div>
      </div>

      <AnimatePresence>
        {modalVideo && (
          <StoryPlayerModal story={modalVideo} onClose={() => setModalVideo(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
