export type ParticipatingSchool = {
  id: string;
  name: string;
  points: number;
  videoCount: number;
  creatorCount: number;
};

export type PublicMapData = {
  schoolsByState: Record<string, ParticipatingSchool[]>;
};
