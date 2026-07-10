export type InquiryStatus = "new" | "contacted" | "closed";

export type ContactInquiry = {
  id: string;
  full_name: string;
  email: string;
  school_name: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
};
