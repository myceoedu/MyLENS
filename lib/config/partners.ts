import { partnerLogos } from "@/lib/data/campaign-images";

export type PartnerId = "tourismMalaysia" | "mdec" | "myceo";

/**
 * Flip to `true` when a partnership is officially confirmed.
 * All partner data stays in code — only visibility changes.
 */
export const PARTNER_VISIBILITY: Record<PartnerId, boolean> = {
  tourismMalaysia: false,
  mdec: false,
  myceo: true,
};

export type StrategicPartner = {
  id: PartnerId;
  name: string;
  role: string;
  logo: (typeof partnerLogos)[keyof typeof partnerLogos];
};

export type FooterSupporter = {
  id: PartnerId;
  name: string;
  short: "TM" | "MDEC" | "MyCEO";
  accent: string;
};

const STRATEGIC_PARTNERS: StrategicPartner[] = [
  {
    id: "tourismMalaysia",
    name: "Tourism Malaysia",
    role: "National Tourism Heritage Partner",
    logo: partnerLogos.tourismMalaysia,
  },
  {
    id: "mdec",
    name: "MDEC",
    role: "Digital Acceleration & Innovation Lead",
    logo: partnerLogos.mdec,
  },
  {
    id: "myceo",
    name: "MyCEO Education",
    role: "Academic Excellence & Talent Framework",
    logo: partnerLogos.myceo,
  },
];

const FOOTER_SUPPORTERS: FooterSupporter[] = [
  { id: "tourismMalaysia", name: "Tourism Malaysia", short: "TM", accent: "#0B3C5D" },
  { id: "mdec", name: "MDEC", short: "MDEC", accent: "#C41E3A" },
  { id: "myceo", name: "MyCEO Education", short: "MyCEO", accent: "#D4A017" },
];

function isPartnerVisible(id: PartnerId): boolean {
  return PARTNER_VISIBILITY[id];
}

export function getVisiblePartners(): StrategicPartner[] {
  return STRATEGIC_PARTNERS.filter((p) => isPartnerVisible(p.id));
}

export function getVisibleSupporters(): FooterSupporter[] {
  return FOOTER_SUPPORTERS.filter((s) => isPartnerVisible(s.id));
}

function formatPartnerList(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function partnerGridColsClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
}

export function supporterGridColsClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-2 lg:grid-cols-3";
}

export function getHeroKickerText(): string {
  if (PARTNER_VISIBILITY.tourismMalaysia) {
    return "Supported by Tourism Malaysia";
  }
  return "A Nationwide Youth Storytelling Initiative";
}

export function getSponsorBackingCopy(): string {
  const names = getVisiblePartners().map((p) => p.name);
  const tail =
    "Your organisation gains CSR impact, brand visibility across events and digital media, and meaningful engagement with Malaysia's next generation of creators.";

  if (names.length === 0) {
    return `Sponsor a national youth storytelling programme with MyLENS. ${tail}`;
  }

  return `Sponsor a national youth storytelling programme backed by ${formatPartnerList(names)}. ${tail}`;
}

export function getSiteDescription(): string {
  const support = PARTNER_VISIBILITY.tourismMalaysia ? " supported by Tourism Malaysia" : "";
  return `MyLENS: MALAYSIA UNSEEN 2026 is a nationwide youth tourism content competition${support}. Students from 75 schools across every state and territory create 45-second videos showcasing Malaysia's hidden gems.`;
}

export function getSiteKeywords(): string[] {
  const keywords = [
    "MyLENS 2026",
    "Malaysia tourism",
    "hidden gems Malaysia",
    "youth content competition",
    "Malaysia Unseen",
    "young visionaries",
    "Malaysian schools",
    "short video competition",
  ];

  if (PARTNER_VISIBILITY.tourismMalaysia) keywords.push("Tourism Malaysia");
  if (PARTNER_VISIBILITY.mdec) keywords.push("MDEC");

  return keywords;
}

export function getPartnersTeaserText(): string {
  const names = getVisiblePartners().map((p) => p.name);
  if (names.length === 0) {
    return "Government agencies and creative industry allies.";
  }
  return `${formatPartnerList(names)}, and other creative industry allies.`;
}

export function getPartnersImageAlt(): string {
  const names = getVisiblePartners().map((p) => p.name);
  if (names.length === 0) return "Programme partners";
  return `${formatPartnerList(names)} partners`;
}
