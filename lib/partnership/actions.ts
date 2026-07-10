"use server";

import { createAnonymousClient } from "@/lib/supabase/server";

export type PartnershipSubmitResult = { ok: true } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s\-()]{8,20}$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]*)?$/i;

export async function submitPartnershipInquiryAction(input: {
  companyName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  countryCode: string;
  phone: string;
  website: string;
  message: string;
  consent: boolean;
}): Promise<PartnershipSubmitResult> {
  const company_name = input.companyName.trim();
  const full_name = input.fullName.trim();
  const job_title = input.jobTitle.trim();
  const email = input.email.trim().toLowerCase();
  const countryCode = input.countryCode.trim();
  const phoneLocal = input.phone.trim().replace(/\s+/g, " ");
  const phone = `${countryCode} ${phoneLocal}`.trim();
  const websiteRaw = input.website.trim();
  const message = input.message.trim();

  if (!company_name || company_name.length < 2) {
    return { ok: false, error: "Please enter your company or organization name." };
  }
  if (!full_name || full_name.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (!job_title || job_title.length < 2) {
    return { ok: false, error: "Please enter your job title." };
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid business email address." };
  }
  if (!phoneLocal || phoneLocal.length < 6) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { ok: false, error: "Please enter a valid phone number with country code." };
  }
  if (websiteRaw) {
    const withProtocol = websiteRaw.startsWith("http") ? websiteRaw : `https://${websiteRaw}`;
    if (!WEBSITE_PATTERN.test(withProtocol)) {
      return { ok: false, error: "Please enter a valid website URL or leave it blank." };
    }
  }
  if (!message || message.length < 20) {
    return {
      ok: false,
      error: "Please describe your partnership interest (at least 20 characters).",
    };
  }
  if (message.length > 3000) {
    return { ok: false, error: "Message is too long. Please keep it under 3000 characters." };
  }
  if (!input.consent) {
    return { ok: false, error: "Please agree to be contacted by the MYLENS partnership team." };
  }

  const website = websiteRaw
    ? websiteRaw.startsWith("http")
      ? websiteRaw
      : `https://${websiteRaw}`
    : null;

  const supabase = createAnonymousClient();
  const { error } = await supabase.from("partnership_inquiries").insert({
    company_name,
    full_name,
    job_title,
    email,
    phone,
    website,
    message,
    consent_given: true,
    status: "new",
  });

  if (error) {
    console.error("partnership_inquiries insert failed:", error.message);
    return {
      ok: false,
      error: "We couldn't submit your inquiry right now. Please try again or contact us by email.",
    };
  }

  return { ok: true };
}
