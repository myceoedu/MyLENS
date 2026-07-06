export interface StateData {
  id: string;
  name: string;
  shortName: string;
  region: "peninsular" | "east";
  schools: number;
  videos: number;
  hiddenGems: string[];
  tourismHighlights: string[];
  description: string;
  color: string;
}

export const states: StateData[] = [
  {
    id: "johor",
    name: "Johor",
    shortName: "JHR",
    region: "peninsular",
    schools: 5,
    videos: 25,
    hiddenGems: ["Endau-Rompin National Park", "Muar Riverfront", "Kukup Floating Village"],
    tourismHighlights: ["Desaru Beach", "Legoland Malaysia", "Sultan Abu Bakar State Museum"],
    description:
      "Malaysia's southern gateway, Johor blends modern city life with ancient rainforests, untouched beaches, and rich Malay heritage along the Johor Strait.",
    color: "#1B3A6B",
  },
  {
    id: "kedah",
    name: "Kedah",
    shortName: "KDH",
    region: "peninsular",
    schools: 5,
    videos: 23,
    hiddenGems: ["Pedu Lake", "Sik Waterfall", "Kota Kuala Muda"],
    tourismHighlights: ["Langkawi Island", "Gunung Jerai", "Lembah Bujang"],
    description:
      "The Rice Bowl of Malaysia, Kedah is home to Langkawi's duty-free paradise, ancient Hindu-Buddhist ruins at Lembah Bujang, and lush paddy fields stretching to the horizon.",
    color: "#2D6A4F",
  },
  {
    id: "kelantan",
    name: "Kelantan",
    shortName: "KEL",
    region: "peninsular",
    schools: 5,
    videos: 22,
    hiddenGems: ["Gua Musang Caves", "Stong Waterfalls", "Kampung Kraftangan"],
    tourismHighlights: ["Pantai Cahaya Bulan", "Istana Jahar", "Kota Bharu Cultural Centre"],
    description:
      "The Cradle of Malay Culture, Kelantan is where traditional crafts, wayang kulit, and the finest Malay cuisine thrive alongside pristine jungle rivers and cave systems.",
    color: "#0A7B8A",
  },
  {
    id: "melaka",
    name: "Melaka",
    shortName: "MLK",
    region: "peninsular",
    schools: 5,
    videos: 24,
    hiddenGems: ["Alor Gajah Waterfall", "Pulau Upeh", "Kampung Morten"],
    tourismHighlights: ["Jonker Street", "A Famosa Fort", "Baba-Nyonya Heritage Museum"],
    description:
      "A UNESCO World Heritage City, Melaka weaves together Portuguese, Dutch, British, and Chinese influences into one of Southeast Asia's most historically rich destinations.",
    color: "#C0392B",
  },
  {
    id: "negerisembilan",
    name: "Negeri Sembilan",
    shortName: "N9",
    region: "peninsular",
    schools: 5,
    videos: 20,
    hiddenGems: ["Pantai Cinta Berahi", "Gunung Datuk", "Terachi Minangkabau Village"],
    tourismHighlights: ["Sri Menanti Royal Museum", "Pantai Dickson", "Adat Perpatih culture"],
    description:
      "Shaped by Minangkabau heritage, Negeri Sembilan is defined by distinctive curved-roof architecture, lush hill retreats, and a coastline beloved by KL day-trippers.",
    color: "#E8A020",
  },
  {
    id: "pahang",
    name: "Pahang",
    shortName: "PHG",
    region: "peninsular",
    schools: 5,
    videos: 26,
    hiddenGems: ["Sungai Lembing Mushroom Cave", "Lata Berkoh", "Tasik Bera"],
    tourismHighlights: ["Cameron Highlands", "Taman Negara", "Tioman Island"],
    description:
      "Malaysia's largest state, Pahang houses the ancient Taman Negara rainforest, highland tea estates at Cameron Highlands, and the pristine paradise of Tioman Island.",
    color: "#2D6A4F",
  },
  {
    id: "perak",
    name: "Perak",
    shortName: "PRK",
    region: "peninsular",
    schools: 5,
    videos: 24,
    hiddenGems: ["Gua Tempurung", "Belum Rainforest", "Kellie's Castle"],
    tourismHighlights: ["Ipoh Old Town", "Pangkor Island", "Royal Belum State Park"],
    description:
      "From the silver tin-mining heritage of Ipoh's colonial Old Town to the ancient Belum rainforest teeming with wildlife, Perak is a state of extraordinary contrasts.",
    color: "#1B3A6B",
  },
  {
    id: "perlis",
    name: "Perlis",
    shortName: "PLS",
    region: "peninsular",
    schools: 5,
    videos: 18,
    hiddenGems: ["Gua Kelam", "Wang Kelian Sunday Market", "Padang Besar Border Town"],
    tourismHighlights: ["Arau Royal Palace", "Mata Air Chabang Tiga", "Perlis State Park"],
    description:
      "Malaysia's smallest state punches above its weight with limestone cave systems, a wild state park, and quiet paddy fields that feel untouched by time.",
    color: "#0A7B8A",
  },
  {
    id: "penang",
    name: "Pulau Pinang",
    shortName: "PNG",
    region: "peninsular",
    schools: 5,
    videos: 27,
    hiddenGems: ["Penang Hill Eco Park", "Balik Pulau Durian Trail", "Fort Cornwallis"],
    tourismHighlights: ["Georgetown Street Art", "Penang Hill", "Batu Ferringhi Beach"],
    description:
      "The Pearl of the Orient — Penang's UNESCO-listed Georgetown is a living canvas of street art, colonial shophouses, and the most celebrated food scene in all of Asia.",
    color: "#E8A020",
  },
  {
    id: "sabah",
    name: "Sabah",
    shortName: "SBH",
    region: "east",
    schools: 5,
    videos: 28,
    hiddenGems: ["Semporna Reef", "Maliau Basin", "Tip of Borneo"],
    tourismHighlights: ["Mount Kinabalu", "Sipadan Island", "Kinabatangan River"],
    description:
      "The Land Below the Wind, Sabah is home to Mount Kinabalu, the world-famous Sipadan dive site, pygmy elephants along Kinabatangan River, and Bajau Laut sea nomads.",
    color: "#2D6A4F",
  },
  {
    id: "sarawak",
    name: "Sarawak",
    shortName: "SWK",
    region: "east",
    schools: 5,
    videos: 26,
    hiddenGems: ["Bario Highlands", "Niah Caves", "Batang Ai Longhouse"],
    tourismHighlights: ["Mulu Caves", "Kuching Waterfront", "Iban Longhouses"],
    description:
      "The Land of the Hornbills, Sarawak's Mulu Caves contain the world's largest cave chamber, while its rivers lead to indigenous Iban longhouses deep in the Borneo jungle.",
    color: "#C0392B",
  },
  {
    id: "selangor",
    name: "Selangor",
    shortName: "SEL",
    region: "peninsular",
    schools: 5,
    videos: 25,
    hiddenGems: ["Kuala Selangor Fireflies", "Bukit Cahaya Agro Park", "Pulau Ketam"],
    tourismHighlights: ["Batu Caves", "Shah Alam Blue Mosque", "Sunway Lagoon"],
    description:
      "Surrounding the capital, Selangor offers everything from the iconic Batu Caves temple complex to mangrove firefly sanctuaries, coastal fishing villages, and modern theme parks.",
    color: "#1B3A6B",
  },
  {
    id: "terengganu",
    name: "Terengganu",
    shortName: "TRG",
    region: "peninsular",
    schools: 5,
    videos: 25,
    hiddenGems: ["Kenyir Lake", "Bidong Island", "Pulau Perhentian Kecil"],
    tourismHighlights: ["Redang Island", "Perhentian Islands", "Crystal Mosque"],
    description:
      "Terengganu's crystal-clear waters are home to some of Southeast Asia's finest snorkeling and diving, while its interior hides the vast, pristine Kenyir Lake.",
    color: "#0A7B8A",
  },
  {
    id: "kualalumpur",
    name: "W.P. Kuala Lumpur",
    shortName: "KL",
    region: "peninsular",
    schools: 5,
    videos: 27,
    hiddenGems: ["Kampung Baru Heritage Trail", "Kanching Waterfall", "Chow Kit Market"],
    tourismHighlights: ["Petronas Twin Towers", "KLCC Park", "Batu Caves"],
    description:
      "Malaysia's vibrant capital is a city of contrasts — gleaming skyscrapers rise beside colonial heritage buildings, while night markets and street food define the soul of KL.",
    color: "#E8A020",
  },
  {
    id: "labuan",
    name: "W.P. Labuan",
    shortName: "LBN",
    region: "east",
    schools: 5,
    videos: 5,
    hiddenGems: ["Labuan War Cemetery", "Layang Layang Atoll", "Papan Island"],
    tourismHighlights: ["Labuan Marine Park", "Financial Duty-Free Island", "WWII Memorial"],
    description:
      "A federal island territory off the Sabah coast, Labuan is a duty-free haven with world-class wreck diving, WWII history, and tranquil tropical beaches.",
    color: "#2D6A4F",
  },
];

export const totalStats = {
  states: states.length,
  schools: states.reduce((sum, s) => sum + s.schools, 0),
  videos: states.reduce((sum, s) => sum + s.videos, 0),
  creators: states.reduce((sum, s) => sum + s.schools * 4, 0),
};
