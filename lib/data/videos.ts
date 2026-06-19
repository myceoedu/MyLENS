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
  thumbnail: string; // placeholder gradient id
  featured: boolean;
}

// Placeholder thumbnail gradient configs (will be replaced with real images)
/** Real destination photography for story cards */
export const storyDestinationImages: Record<string, string> = {
  nature1:    "/images/about-nature.jpg",
  nature2:    "/images/hero-background.jpg",
  nature3:    "/images/banner-landscape.jpg",
  food1:      "/images/creator-spotlight.jpg",
  food2:      "/images/banner-landscape.jpg",
  food3:      "/images/about-nature.jpg",
  culture1:   "/images/creator-spotlight.jpg",
  culture2:   "/images/batik.jpg",
  culture3:   "/images/hero-background.jpg",
  heritage1:  "/images/banner-landscape.jpg",
  heritage2:  "/images/about-nature.jpg",
  heritage3:  "/images/creator-spotlight.jpg",
  adventure1: "/images/hero-background.jpg",
  adventure2: "/images/about-nature.jpg",
  adventure3: "/images/banner-landscape.jpg",
  hidden1:    "/images/about-nature.jpg",
  hidden2:    "/images/hero-background.jpg",
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

export const videos: Video[] = [
  // Nature
  { id: "v1",  title: "The Canopy Walk of Taman Negara",      creator: "Aisyah Marzuki",    school: "SMK Dato' Onn",        stateId: "pahang",       state: "Pahang",         category: "Nature",       views: 18400, likes: 1240, duration: "0:45", thumbnail: "nature1",    featured: true  },
  { id: "v2",  title: "Sunrise at Mount Kinabalu's Peak",     creator: "Joshua Sinajin",    school: "SMK Kota Kinabalu",    stateId: "sabah",        state: "Sabah",          category: "Nature",       views: 24100, likes: 1870, duration: "0:45", thumbnail: "nature2",    featured: true  },
  { id: "v3",  title: "Stong Waterfalls Hidden in Jungle",    creator: "Qistina Radhwa",    school: "SMK Kota Bharu",       stateId: "kelantan",     state: "Kelantan",       category: "Nature",       views: 11200, likes: 890,  duration: "0:44", thumbnail: "nature3",    featured: false },
  { id: "v4",  title: "Kuala Selangor's Firefly River",       creator: "Aisha Mya",         school: "SMK Damansara Jaya",   stateId: "selangor",     state: "Selangor",       category: "Nature",       views: 15600, likes: 1120, duration: "0:45", thumbnail: "nature1",    featured: true  },
  { id: "v5",  title: "Belum Rainforest — World's Oldest",    creator: "Faris Irfan",       school: "SMK Dato' Onn",        stateId: "perak",        state: "Perak",          category: "Nature",       views: 9800,  likes: 740,  duration: "0:45", thumbnail: "nature2",    featured: false },
  { id: "v6",  title: "Kenyir Lake — Jewel of Terengganu",    creator: "Ainnur Husna",      school: "SMK Pasir Mas",        stateId: "terengganu",   state: "Terengganu",     category: "Nature",       views: 13400, likes: 980,  duration: "0:45", thumbnail: "nature3",    featured: false },

  // Food
  { id: "v7",  title: "Penang Char Koay Teow at Dawn",        creator: "Xavier Lim",        school: "SMK Jit Sin",          stateId: "penang",       state: "Pulau Pinang",   category: "Food",         views: 31200, likes: 2450, duration: "0:45", thumbnail: "food1",      featured: true  },
  { id: "v8",  title: "Johor's Secret Mee Bandung Maker",     creator: "Amirul Hakim",      school: "SMK Taman Pelangi",    stateId: "johor",        state: "Johor",          category: "Food",         views: 22400, likes: 1680, duration: "0:45", thumbnail: "food2",      featured: true  },
  { id: "v9",  title: "90-Year-Old Nasi Kandar in Alor Setar",creator: "Fadzillah Rauf",    school: "SMK Alor Setar",       stateId: "kedah",        state: "Kedah",          category: "Food",         views: 17800, likes: 1340, duration: "0:44", thumbnail: "food3",      featured: false },
  { id: "v10", title: "Sarawak Laksa — A Morning Ritual",     creator: "Rayner Bong",       school: "SMK Kuching",          stateId: "sarawak",      state: "Sarawak",        category: "Food",         views: 26100, likes: 2020, duration: "0:45", thumbnail: "food1",      featured: true  },
  { id: "v11", title: "Kelantan's Best Nasi Kerabu in 45s",   creator: "Aminuddin Razi",    school: "SMK Kota Bharu",       stateId: "kelantan",     state: "Kelantan",       category: "Food",         views: 19500, likes: 1530, duration: "0:45", thumbnail: "food2",      featured: false },
  { id: "v12", title: "Chow Kit Night Market — Unfiltered",   creator: "Faris Aqil",        school: "SMK Bukit Bintang",    stateId: "kualalumpur",  state: "W.P. Kuala Lumpur", category: "Food",      views: 28700, likes: 2180, duration: "0:45", thumbnail: "food3",      featured: true  },

  // Culture
  { id: "v13", title: "Wayang Kulit — Shadows of Kelantan",   creator: "Nik Hafizi",        school: "SMK Kota Bharu",       stateId: "kelantan",     state: "Kelantan",       category: "Culture",      views: 14200, likes: 1180, duration: "0:45", thumbnail: "culture1",   featured: true  },
  { id: "v14", title: "Minangkabau Village of Negeri Sembilan",creator: "Azan Arif",         school: "SMK NS",               stateId: "negerisembilan",state: "Negeri Sembilan",category: "Culture",     views: 11800, likes: 940,  duration: "0:45", thumbnail: "culture2",   featured: false },
  { id: "v15", title: "Bajau Laut: Life on the Open Sea",     creator: "Joshua Sinajin",    school: "SMK Kota Kinabalu",    stateId: "sabah",        state: "Sabah",          category: "Culture",      views: 20400, likes: 1620, duration: "0:44", thumbnail: "culture3",   featured: true  },
  { id: "v16", title: "Baba-Nyonya: A Heritage Reborn",       creator: "Najwa Husna",       school: "SMK Dato' Jaapar",     stateId: "melaka",       state: "Melaka",         category: "Culture",      views: 16700, likes: 1310, duration: "0:45", thumbnail: "culture1",   featured: false },
  { id: "v17", title: "Mak Yong Dance of the Forest Kingdom", creator: "Nabilah Zulaikha",  school: "SMK Pasir Mas",        stateId: "kelantan",     state: "Kelantan",       category: "Culture",      views: 12500, likes: 990,  duration: "0:45", thumbnail: "culture2",   featured: false },
  { id: "v18", title: "Iban Longhouse Welcome Ceremony",      creator: "Rayner Bong",       school: "SMK Kuching",          stateId: "sarawak",      state: "Sarawak",        category: "Culture",      views: 21300, likes: 1700, duration: "0:45", thumbnail: "culture3",   featured: true  },

  // Heritage
  { id: "v19", title: "Inside Fort Cornwallis — 240 Years",   creator: "Xavier Lim",        school: "SMK Jit Sin",          stateId: "penang",       state: "Pulau Pinang",   category: "Heritage",     views: 14900, likes: 1190, duration: "0:45", thumbnail: "heritage1",  featured: true  },
  { id: "v20", title: "A Famosa's Untold Portuguese Story",   creator: "Aidil Adha",        school: "SMK Sultan Alauddin",  stateId: "melaka",       state: "Melaka",         category: "Heritage",     views: 18200, likes: 1440, duration: "0:45", thumbnail: "heritage2",  featured: true  },
  { id: "v21", title: "Kellie's Castle — Malaysia's Mystery", creator: "Aqilah Maisarah",   school: "SMK Kulim",            stateId: "perak",        state: "Perak",          category: "Heritage",     views: 13600, likes: 1060, duration: "0:44", thumbnail: "heritage3",  featured: false },
  { id: "v22", title: "Lembah Bujang — 2000 Years of History",creator: "Izham Firdaus",     school: "SMK Langkawi",         stateId: "kedah",        state: "Kedah",          category: "Heritage",     views: 10400, likes: 820,  duration: "0:45", thumbnail: "heritage1",  featured: false },
  { id: "v23", title: "Labuan War Memorial — We Remember",    creator: "Arvin Muis",        school: "SMK Sandakan",         stateId: "sabah",        state: "Sabah",          category: "Heritage",     views: 9700,  likes: 780,  duration: "0:45", thumbnail: "heritage2",  featured: false },
  { id: "v24", title: "Niah Caves — 40,000 Years of Life",    creator: "Hanafi Azmi",       school: "SMK Sibu",             stateId: "sarawak",      state: "Sarawak",        category: "Heritage",     views: 15100, likes: 1200, duration: "0:45", thumbnail: "heritage3",  featured: true  },

  // Adventure
  { id: "v25", title: "Sipadan Island — Below the Surface",   creator: "Arvin Muis",        school: "SMK Sandakan",         stateId: "sabah",        state: "Sabah",          category: "Adventure",    views: 29400, likes: 2340, duration: "0:45", thumbnail: "adventure1", featured: true  },
  { id: "v26", title: "White Water Rafting on Sungai Kampar", creator: "Faris Irfan",       school: "SMK Dato' Onn",        stateId: "perak",        state: "Perak",          category: "Adventure",    views: 17200, likes: 1360, duration: "0:45", thumbnail: "adventure2", featured: false },
  { id: "v27", title: "Paragliding Over Cameron Highlands",   creator: "Razana Idris",      school: "SMK Sultanah EA",      stateId: "pahang",       state: "Pahang",         category: "Adventure",    views: 22800, likes: 1790, duration: "0:44", thumbnail: "adventure3", featured: true  },
  { id: "v28", title: "Trekking the Maliau Basin Floor",      creator: "Gindol Rajandran",  school: "SMK Kota Kinabalu",    stateId: "sabah",        state: "Sabah",          category: "Adventure",    views: 19600, likes: 1540, duration: "0:45", thumbnail: "adventure1", featured: false },
  { id: "v29", title: "Night Diving at Pulau Tioman",         creator: "Amirul Hakim",      school: "SMK Taman Pelangi",    stateId: "pahang",       state: "Pahang",         category: "Adventure",    views: 14300, likes: 1120, duration: "0:45", thumbnail: "adventure2", featured: false },
  { id: "v30", title: "Solo Kayak Through Bako National Park",creator: "Rayner Bong",       school: "SMK Kuching",          stateId: "sarawak",      state: "Sarawak",        category: "Adventure",    views: 16800, likes: 1330, duration: "0:45", thumbnail: "adventure3", featured: true  },

  // Hidden Gems
  { id: "v31", title: "Pulau Besar — The Island Nobody Visits",creator: "Najwa Husna",      school: "SMK Dato' Jaapar",     stateId: "melaka",       state: "Melaka",         category: "Hidden Gems",  views: 23700, likes: 1920, duration: "0:45", thumbnail: "hidden1",    featured: true  },
  { id: "v32", title: "Kampung Morten — KL's Last Village",   creator: "Zara Maisarah",     school: "SMK Cheras",           stateId: "kualalumpur",  state: "W.P. Kuala Lumpur", category: "Hidden Gems", views: 19800, likes: 1570, duration: "0:45", thumbnail: "hidden2",   featured: true  },
  { id: "v33", title: "Gua Kelam — Cave Walkway of Perlis",   creator: "Rayhana Amani",     school: "SMK Baling",           stateId: "perlis",       state: "Perlis",         category: "Hidden Gems",  views: 12100, likes: 960,  duration: "0:44", thumbnail: "hidden3",    featured: false },
  { id: "v34", title: "Bidong Island — Malaysia's Best Kept Secret", creator: "Ainnur Husna", school: "SMK Pasir Mas",     stateId: "terengganu",   state: "Terengganu",     category: "Hidden Gems",  views: 17500, likes: 1400, duration: "0:45", thumbnail: "hidden1",    featured: false },
  { id: "v35", title: "Pulau Upeh — The Uninhabited Paradise", creator: "Aidil Adha",       school: "SMK Sultan Alauddin",  stateId: "melaka",       state: "Melaka",         category: "Hidden Gems",  views: 15900, likes: 1270, duration: "0:45", thumbnail: "hidden2",    featured: true  },
  { id: "v36", title: "Wang Kelian Border Night Market",      creator: "Izham Firdaus",     school: "SMK Langkawi",         stateId: "perlis",       state: "Perlis",         category: "Hidden Gems",  views: 11300, likes: 890,  duration: "0:45", thumbnail: "hidden3",    featured: false },
];

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
