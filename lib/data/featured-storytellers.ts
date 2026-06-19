export interface FeaturedStoryteller {
  id: string;
  name: string;
  state: string;
  quote: string;
  portrait: string;
  accent: string;
}

export const featuredStorytellers: FeaturedStoryteller[] = [
  {
    id: "st1",
    name: "Joshua Sinajin",
    state: "Sabah",
    quote:
      "Every sunrise on Kinabalu tells a story our grandparents never had the chance to share.",
    portrait: "/images/creator-spotlight.jpg",
    accent: "#1F7A53",
  },
  {
    id: "st2",
    name: "Rayner Bong",
    state: "Sarawak",
    quote:
      "Our longhouse traditions deserve to be seen by the world — not just remembered at home.",
    portrait:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80&auto=format&fit=crop",
    accent: "#0B3C5D",
  },
  {
    id: "st3",
    name: "Xavier Lim",
    state: "Pulau Pinang",
    quote:
      "George Town's walls whisper histories in a dozen languages. I just point the camera.",
    portrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
    accent: "#D4A017",
  },
  {
    id: "st4",
    name: "Aisyah Marzuki",
    state: "Pahang",
    quote:
      "The rainforest taught me patience — and gave me stories worth filming in 45 seconds.",
    portrait:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop",
    accent: "#1F7A53",
  },
  {
    id: "st5",
    name: "Nik Hafizi",
    state: "Kelantan",
    quote:
      "Wayang kulit isn't shadow play. It's our soul projected onto a screen for the world.",
    portrait:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop",
    accent: "#0B3C5D",
  },
];
