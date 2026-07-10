import { extractYouTubeId } from "@/lib/youtube";

/** Maximum student creators allowed per participating school (active + pending). */
export const MAX_CREATORS_PER_SCHOOL = 4;

/** Maximum participating schools per state/region in the campaign. */
export const MAX_SCHOOLS_PER_STATE = 5;

/** Each school submits one cinematic video. */
export const VIDEOS_PER_SCHOOL = 1;

/** Separate still for pre-play cover. */
export const CAMPAIGN_TEASER_POSTER_SRC = "/images/Thumbnail.png";

/**
 * Campaign teaser on YouTube — set in `.env.local`:
 * NEXT_PUBLIC_CAMPAIGN_TEASER_YOUTUBE=https://www.youtube.com/watch?v=YOUR_VIDEO_ID
 * (URL or 11-character video ID both work)
 */
export function getCampaignTeaserYouTubeId(): string | null {
  const raw = process.env.NEXT_PUBLIC_CAMPAIGN_TEASER_YOUTUBE?.trim() ?? "";
  if (!raw) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return extractYouTubeId(raw);
}

export function getCampaignMapStats(regionCount: number) {
  const totalSchools = regionCount * MAX_SCHOOLS_PER_STATE;
  const totalVideos = totalSchools * VIDEOS_PER_SCHOOL;

  return {
    regions: regionCount,
    totalSchools,
    totalCreators: totalSchools * MAX_CREATORS_PER_SCHOOL,
    totalVideos,
  };
}
