import { createClient } from "@/lib/supabase/server";
import AdminInquiriesHub from "@/components/admin/AdminInquiriesHub";
import type { ContactInquiry } from "@/types/contact-inquiry";
import type { PartnershipInquiry } from "@/types/partnership-inquiry";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const { data: schoolData, error: schoolError } = await supabase
    .from("contact_inquiries")
    .select("id, full_name, email, school_name, message, status, created_at")
    .order("created_at", { ascending: false });

  const { data: partnershipData, error: partnershipError } = await supabase
    .from("partnership_inquiries")
    .select(
      "id, company_name, full_name, job_title, email, phone, website, message, consent_given, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (schoolError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-red-800 font-medium mb-2">Could not load school inquiries</p>
        <p className="text-sm text-red-600">
          Run migration <code className="font-mono text-xs">010_contact_inquiries.sql</code> in
          Supabase, then refresh this page.
        </p>
      </div>
    );
  }

  const schoolInquiries = (schoolData ?? []) as ContactInquiry[];
  const partnershipInquiries = (partnershipData ?? []) as PartnershipInquiry[];

  const partnershipLoadError = partnershipError
    ? `Run migration 011_partnership_inquiries.sql in Supabase. (${partnershipError.message})`
    : null;

  return (
    <AdminInquiriesHub
      schoolInquiries={schoolInquiries}
      partnershipInquiries={partnershipInquiries}
      partnershipLoadError={partnershipLoadError}
    />
  );
}
