import type { InquiryStatus } from "@/types/contact-inquiry";

export type { InquiryStatus };

export type PartnershipInquiry = {
  id: string;
  company_name: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  website: string | null;
  message: string;
  consent_given: boolean;
  status: InquiryStatus;
  created_at: string;
};
