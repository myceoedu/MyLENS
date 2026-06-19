/**
 * Official Tourism Malaysia–style campaign imagery paths & grading.
 * Place local assets in /public/images/ — terrain map: peta-malaysia-terrain.jpg
 */

export const CANVAS_OFF_WHITE = "#FBFBFA";

/** Unified warm organic grade — apply via .campaign-photo-grade */
export const campaignPhotoGradeStyle = {
  filter: "saturate(0.88) contrast(1.14) brightness(0.94) sepia(0.1) hue-rotate(-6deg)",
} as const;

export const campaignImages = {
  /** Local campaign photography — /public/images */
  aboutNature: "/images/about-nature.jpg",
  bannerLandscape: "/images/banner-landscape.jpg",
  creatorSpotlight: "/images/creator-spotlight.jpg",
  batikTexture: "/images/batik.jpg",
  malaysiaLandmark: "/images/malaysia-landmark.jpg",
  /** Monochromatic / 3D terrain peta — replace file in public/images */
  mapTerrain: "/images/peta-malaysia-terrain.jpg",
  /** Hero — Cameron Highlands tea terraces, Pahang, Malaysia */
  heroBackground: "/images/home-bg.jpg",
  heroBackgroundAlt: "Emerald tea plantations in Cameron Highlands, Pahang, Malaysia",
  /** About section — Malaysia diversity collage */
  aboutCollage: {
    kinabalu: "/images/hero-background.jpg",
    georgeTown:
      "https://images.unsplash.com/photo-1583417319070-4a2ad2cec700?w=900&q=80&auto=format&fit=crop",
    sarawak:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&q=80&auto=format&fit=crop",
    food: "/images/creator-spotlight.jpg",
    rainforest: "/images/about-nature.jpg",
  },
  sneakPeek: {
    creators: "/images/creator-spotlight.jpg",
    leaderboard:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop",
    awards:
      "https://images.unsplash.com/photo-1517456793572-1e8ae0c5df99?w=800&q=80&auto=format&fit=crop",
    sponsors:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80&auto=format&fit=crop",
    gallery:
      "https://images.unsplash.com/photo-1493863641943-9b67192f0d0a?w=800&q=80&auto=format&fit=crop",
  },
} as const;
