import type { Video, VideoCategory } from "@/lib/data/videos";
import { extractYouTubeId } from "@/lib/youtube";

type CuratedStorySource = {
  id: string;
  /** Full YouTube video title — shown in modal only. */
  title: string;
  /** Short accurate label for cards (derived from the video, not invented). */
  cardTitle: string;
  youtubeUrl: string;
  creator: string;
  school: string;
  stateId: string;
  state: string;
  category: VideoCategory;
  thumbnail: string;
  featured: boolean;
  sortOrder: number;
};

const CURATED_STORY_SOURCES: CuratedStorySource[] = [
  {
    id: "v1",
    title: "TAMAN NEGARA, Malaysia: Jungle Trek & CANOPY WALK + Elephants and Waterfalls",
    cardTitle: "Taman Negara",
    youtubeUrl: "https://youtu.be/WtxOIrCNPUM",
    creator: "Wout of the World",
    school: "",
    stateId: "pahang",
    state: "Pahang",
    category: "Nature",
    thumbnail: "nature1",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "v2",
    title: "Kellie's Castle, Perak | Aerial Drone Video | DJI Mini 3",
    cardTitle: "Kellie's Castle",
    youtubeUrl: "https://youtu.be/sCRfk_Q6RN4",
    creator: "Remy Roma",
    school: "",
    stateId: "perak",
    state: "Perak",
    category: "Heritage",
    thumbnail: "heritage2",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "v3",
    title: "Sipadan Island The Dive Mecca",
    cardTitle: "Sipadan Island",
    youtubeUrl: "https://youtu.be/0C12M7zFpJQ",
    creator: "Sabah Tourism",
    school: "",
    stateId: "sabah",
    state: "Sabah",
    category: "Adventure",
    thumbnail: "adventure1",
    featured: false,
    sortOrder: 3,
  },
  {
    id: "v4",
    title: "White Water Rafting with Nomad Adventure, Gopeng, Malaysia",
    cardTitle: "White Water Rafting, Gopeng",
    youtubeUrl: "https://youtu.be/fdzXOvUd1bQ",
    creator: "Nomad Adventure Malaysia",
    school: "",
    stateId: "perak",
    state: "Perak",
    category: "Adventure",
    thumbnail: "adventure2",
    featured: true,
    sortOrder: 4,
  },
  {
    id: "v5",
    title: "ILLUMINATING THE DARKNESS - MEDIA CAMPAIGN OF GUA KELAM 1 & 2, PERLIS",
    cardTitle: "Gua Kelam, Perlis",
    youtubeUrl: "https://youtu.be/PNJWgv_Zlhc",
    creator: "Kelam Seekers",
    school: "",
    stateId: "perlis",
    state: "Perlis",
    category: "Heritage",
    thumbnail: "heritage3",
    featured: false,
    sortOrder: 5,
  },
  {
    id: "v6",
    title: "FLYING AROUND BIDONG ISLAND 4K",
    cardTitle: "Bidong Island",
    youtubeUrl: "https://youtu.be/JBGzxCHufVg",
    creator: "Tan YL",
    school: "",
    stateId: "terengganu",
    state: "Terengganu",
    category: "Hidden Gems",
    thumbnail: "hidden1",
    featured: false,
    sortOrder: 6,
  },
];

function toShowcaseVideo(source: CuratedStorySource): Video {
  const youtubeVideoId = extractYouTubeId(source.youtubeUrl) ?? undefined;
  return {
    id: source.id,
    title: source.title,
    cardTitle: source.cardTitle,
    creator: source.creator,
    school: source.school,
    stateId: source.stateId,
    state: source.state,
    category: source.category,
    views: 100_000 - source.sortOrder,
    likes: 0,
    duration: "Short",
    thumbnail: source.thumbnail,
    featured: source.featured,
    youtubeVideoId,
  };
}

export const showcaseVideos: Video[] = CURATED_STORY_SOURCES.map(toShowcaseVideo);
