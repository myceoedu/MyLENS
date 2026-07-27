/** Lightweight state picker options — avoids shipping full tourism metadata into forms. */
export const STATE_OPTIONS = [
  { id: "johor", name: "Johor" },
  { id: "kedah", name: "Kedah" },
  { id: "kelantan", name: "Kelantan" },
  { id: "melaka", name: "Melaka" },
  { id: "negerisembilan", name: "Negeri Sembilan" },
  { id: "pahang", name: "Pahang" },
  { id: "perak", name: "Perak" },
  { id: "perlis", name: "Perlis" },
  { id: "penang", name: "Penang" },
  { id: "sabah", name: "Sabah" },
  { id: "sarawak", name: "Sarawak" },
  { id: "selangor", name: "Selangor" },
  { id: "terengganu", name: "Terengganu" },
  { id: "kualalumpur", name: "Kuala Lumpur" },
  { id: "labuan", name: "Labuan" },
] as const;

export type StateOption = (typeof STATE_OPTIONS)[number];
