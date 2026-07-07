import { showcaseVideos } from "./curated-stories";

export type VideoCategory = "Nature" | "Food" | "Culture" | "Heritage" | "Adventure" | "Hidden Gems";

export interface Video {
  id: string;
  title: string;
  creator: string;
  school: string;
  stateId: string;
  state: string;
  category: VideoCategory;
  views: number;
  likes: number;
  duration: string;
  thumbnail: string;
  featured: boolean;
  /** Short label on cards; full `title` is shown in the player modal. */
  cardTitle?: string;
  /** When set, cards and modal use YouTube thumbnail + embed. */
  youtubeVideoId?: string;
}

// Placeholder thumbnail gradient configs (will be replaced with real images)
/** Real destination photography for story cards */
export const storyDestinationImages: Record<string, string> = {
  nature1:    "/images/about-nature.jpg",
  nature2:    "/images/home-bg.jpg",
  nature3:    "/images/banner-landscape.jpg",
  food1:      "/images/creator-spotlight.jpg",
  food2:      "/images/banner-landscape.jpg",
  food3:      "/images/about-nature.jpg",
  culture1:   "/images/creator-spotlight.jpg",
  culture2:   "/images/batik.jpg",
  culture3:   "/images/home-bg.jpg",
  heritage1:  "/images/banner-landscape.jpg",
  heritage2:  "/images/about-nature.jpg",
  heritage3:  "/images/creator-spotlight.jpg",
  adventure1: "/images/home-bg.jpg",
  adventure2: "/images/about-nature.jpg",
  adventure3: "/images/banner-landscape.jpg",
  hidden1:    "/images/about-nature.jpg",
  hidden2:    "/images/home-bg.jpg",
  hidden3:    "/images/banner-landscape.jpg",
};

export const thumbnailGradients: Record<string, string> = {
  nature1:    "linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)",
  nature2:    "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
  nature3:    "linear-gradient(135deg, #40916C 0%, #74C69D 100%)",
  food1:      "linear-gradient(135deg, #E8A020 0%, #F5B942 100%)",
  food2:      "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)",
  food3:      "linear-gradient(135deg, #E8A020 0%, #C0392B 100%)",
  culture1:   "linear-gradient(135deg, #1B3A6B 0%, #2A5CA0 100%)",
  culture2:   "linear-gradient(135deg, #8B2FC9 0%, #1B3A6B 100%)",
  culture3:   "linear-gradient(135deg, #C0392B 0%, #8B2FC9 100%)",
  heritage1:  "linear-gradient(135deg, #5C4033 0%, #8B6355 100%)",
  heritage2:  "linear-gradient(135deg, #8B6355 0%, #E8A020 100%)",
  heritage3:  "linear-gradient(135deg, #1B3A6B 0%, #5C4033 100%)",
  adventure1: "linear-gradient(135deg, #0A7B8A 0%, #1B3A6B 100%)",
  adventure2: "linear-gradient(135deg, #0A7B8A 0%, #2D6A4F 100%)",
  adventure3: "linear-gradient(135deg, #1B3A6B 0%, #0A7B8A 100%)",
  hidden1:    "linear-gradient(135deg, #E8A020 0%, #2D6A4F 100%)",
  hidden2:    "linear-gradient(135deg, #0A7B8A 0%, #E8A020 100%)",
  hidden3:    "linear-gradient(135deg, #2D6A4F 0%, #1B3A6B 100%)",
};

export const videos = showcaseVideos;

export const videoCategories: VideoCategory[] = [
  "Nature", "Food", "Culture", "Heritage", "Adventure", "Hidden Gems"
];

export const categoryColors: Record<VideoCategory, { color: string; bg: string }> = {
  "Nature":      { color: "#2D6A4F", bg: "#EDF5F0" },
  "Food":        { color: "#E8A020", bg: "#FDF0D0" },
  "Culture":     { color: "#1B3A6B", bg: "#EBF3FA" },
  "Heritage":    { color: "#8B6355", bg: "#F5EDE8" },
  "Adventure":   { color: "#0A7B8A", bg: "#D8F0F3" },
  "Hidden Gems": { color: "#C0392B", bg: "#FDECEA" },
};
