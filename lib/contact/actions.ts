"use server";

import { createAnonymousClient } from "@/lib/supabase/server";

export type ContactSubmitResult = { ok: true } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactInquiryAction(input: {
  name: string;
  email: string;
  school: string;
  message: string;
}): Promise<ContactSubmitResult> {
  const full_name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const school_name = input.school.trim();
  const message = input.message.trim();

  if (!full_name || full_name.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!school_name || school_name.length < 2) {
    return { ok: false, error: "Please enter your school name." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Please write a short message (at least 10 characters)." };
  }
  if (message.length > 2000) {
    return { ok: false, error: "Message is too long. Please keep it under 2000 characters." };
  }

  const supabase = createAnonymousClient();
  const { error } = await supabase.from("contact_inquiries").insert({
    full_name,
    email,
    school_name,
    message,
    status: "new",
  });

  if (error) {
    console.error("contact_inquiries insert failed:", error.message);
    return {
      ok: false,
      error: "We couldn't send your message right now. Please try again or email us directly.",
    };
  }

  return { ok: true };
}
