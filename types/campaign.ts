export interface CampaignResource {
  id: string;
  title: string;
  description: string | null;
  resource_type: "link" | "pdf" | "video";
  url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampaignSettings {
  id: string;
  submission_opens_at: string | null;
  submission_closes_at: string | null;
  updated_at: string;
}

export type CampaignStepId = "register" | "team" | "class" | "capture" | "submit";

export interface CampaignStep {
  id: CampaignStepId;
  label: string;
  description: string;
  status: "complete" | "current" | "upcoming" | "locked";
}
