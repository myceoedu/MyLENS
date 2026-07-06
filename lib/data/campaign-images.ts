/**
 * Official Tourism Malaysia–style campaign imagery paths & grading.
 * Place local assets in /public/images/ — map: MALAYSIA.png, landmark: KLCC.png
 */

export const CANVAS_OFF_WHITE = "#FBFBFA";

/** Unified warm organic grade — apply via .campaign-photo-grade */
export const campaignPhotoGradeStyle = {
  filter: "saturate(0.88) contrast(1.14) brightness(0.94) sepia(0.1) hue-rotate(-6deg)",
} as const;

/** Site logo — /public/images/MyLENS Logo.png */
export const MYLENS_LOGO_SRC = "/images/MyLENS%20Logo.png";

export const partnerLogos = {
  tourismMalaysia: {
    src: "/images/Logo-tourism.webp",
    alt: "Tourism Malaysia",
    width: 220,
    height: 72,
  },
  mdec: {
    src: "/images/Logo-MDEC.png",
    alt: "MDEC",
    width: 160,
    height: 64,
  },
  myceo: {
    src: "/images/Logo-MyCeo.png",
    alt: "MyCEO Education",
    width: 180,
    height: 64,
  },
} as const;

export const campaignImages = {
  siteLogo: MYLENS_LOGO_SRC,
  /** Local campaign photography — /public/images */
  aboutNature: "/images/about-nature.jpg",
  bannerLandscape: "/images/banner-landscape.jpg",
  creatorSpotlight: "/images/creator-spotlight.jpg",
  batikTexture: "/images/batik.jpg",
  malaysiaLandmark: "/images/KLCC.png",
  mapTerrain: "/images/MALAYSIA.png",
  /** Hero — Cameron Highlands tea terraces, Pahang, Malaysia */
  heroBackground: "/images/home-bg.jpg",
  heroBackgroundAlt: "Emerald tea plantations in Cameron Highlands, Pahang, Malaysia",
  /** About section — Malaysia diversity collage */
  aboutCollage: {
    kinabalu: "/images/mount-kinabalu.jpg",
    georgeTown: "/images/georgetown-heritage.jpg",
    sarawak: "/images/sarawak-culture.jpg",
    food: "/images/malaysian-food.jpg",
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
