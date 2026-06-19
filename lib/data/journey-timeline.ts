import { School, Compass, Film, Share2, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface JourneyStep {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const journeySteps: JourneyStep[] = [
  {
    id: "join",
    label: "Schools Join",
    description: "Students across Malaysia register to become storytellers.",
    icon: School,
  },
  {
    id: "explore",
    label: "Explore",
    description: "Teams venture into their states to discover hidden gems.",
    icon: Compass,
  },
  {
    id: "film",
    label: "Film",
    description: "45-second stories are crafted with heart and local pride.",
    icon: Film,
  },
  {
    id: "share",
    label: "Share",
    description: "Stories are published for Malaysia and the world to see.",
    icon: Share2,
  },
  {
    id: "showcase",
    label: "National Showcase",
    description: "The finest films rise to the Grand Finale stage.",
    icon: Trophy,
  },
];
