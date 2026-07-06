/** Maximum student creators allowed per participating school (active + pending). */
export const MAX_CREATORS_PER_SCHOOL = 4;

/** Maximum participating schools per state/region in the campaign. */
export const MAX_SCHOOLS_PER_STATE = 5;

/** Each school submits one cinematic video. */
export const VIDEOS_PER_SCHOOL = 1;

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
