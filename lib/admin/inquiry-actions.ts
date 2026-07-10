"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/types/contact-inquiry";

export type InquiryActionResult = { ok: true } | { ok: false; error: string };

async function requireAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    redirect("/dashboard");
  }

  return supabase;
}

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: InquiryStatus
): Promise<InquiryActionResult> {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin/inquiries");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}

export async function deleteInquiryAction(inquiryId: string): Promise<InquiryActionResult> {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("contact_inquiries").delete().eq("id", inquiryId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin/inquiries");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}

export async function updatePartnershipInquiryStatusAction(
  inquiryId: string,
  status: InquiryStatus
): Promise<InquiryActionResult> {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("partnership_inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin/inquiries");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}

export async function deletePartnershipInquiryAction(
  inquiryId: string
): Promise<InquiryActionResult> {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("partnership_inquiries").delete().eq("id", inquiryId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin/inquiries");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}
