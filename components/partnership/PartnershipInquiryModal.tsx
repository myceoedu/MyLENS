"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Loader2, X } from "lucide-react";
import { submitPartnershipInquiryAction } from "@/lib/partnership/actions";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+60", label: "MY +60" },
  { code: "+65", label: "SG +65" },
  { code: "+62", label: "ID +62" },
  { code: "+66", label: "TH +66" },
  { code: "+63", label: "PH +63" },
  { code: "+673", label: "BN +673" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+86", label: "CN +86" },
  { code: "+91", label: "IN +91" },
  { code: "+81", label: "JP +81" },
  { code: "+82", label: "KR +82" },
] as const;

type FormState = {
  companyName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  countryCode: string;
  phone: string;
  website: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState | "form", string>>;

const EMPTY_FORM: FormState = {
  companyName: "",
  fullName: "",
  jobTitle: "",
  email: "",
  countryCode: "+60",
  phone: "",
  website: "",
  message: "",
  consent: false,
};

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-700 tracking-wide";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function validateClient(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.companyName.trim()) errors.companyName = "Company or organization name is required.";
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.jobTitle.trim()) errors.jobTitle = "Job title is required.";
  if (!form.email.trim()) errors.email = "Business email is required.";
  else if (!emailPattern.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.message.trim()) errors.message = "Message is required.";
  else if (form.message.trim().length < 20)
    errors.message = "Please write at least 20 characters.";
  if (!form.consent) errors.consent = "Consent is required to submit this inquiry.";

  return errors;
}

type PartnershipInquiryModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function PartnershipInquiryModal({ open, onClose }: PartnershipInquiryModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleClose = useCallback(() => {
    if (pending) return;
    onClose();
    window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setErrors({});
      setSuccess(false);
    }, 280);
  }, [onClose, pending]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, pending, handleClose]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrors = validateClient(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await submitPartnershipInquiryAction(form);
      if (!result.ok) {
        setErrors({ form: result.error });
        return;
      }
      setSuccess(true);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="partnership-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={handleClose}
            aria-label="Close dialog"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Formal header */}
            <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                      <Building2 className="h-4 w-4 text-slate-600" strokeWidth={1.5} />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Partnership Inquiry
                    </p>
                  </div>
                  <h2
                    id="partnership-modal-title"
                    className="font-serif text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.35rem]"
                  >
                    Let&apos;s Build Malaysia&apos;s Next Generation of Storytellers
                  </h2>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600">
                    Organizations interested in supporting MYLENS: Malaysia Unseen 2026 may submit
                    their details below. Our partnership team will respond within 2–3 business days.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={pending}
                  className="shrink-0 rounded-md border border-slate-200 p-2 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto bg-white px-6 py-6 sm:px-8 sm:py-7">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-slate-200 bg-white px-6 py-10 text-center sm:py-12"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-6 w-6 text-emerald-700" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Inquiry Received
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                    Thank you for your interest in partnering with MYLENS: Malaysia Unseen 2026.
                    Our partnership team has received your inquiry and will contact you within 2–3
                    business days to discuss potential collaboration opportunities.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-7 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="pi-company" className={labelClass}>
                      Company / Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pi-company"
                      type="text"
                      value={form.companyName}
                      onChange={(e) => update("companyName", e.target.value)}
                      className={cn(inputClass, errors.companyName && "border-red-300 focus:border-red-400 focus:ring-red-50")}
                      placeholder="e.g. Tourism Malaysia"
                      disabled={pending}
                      autoComplete="organization"
                    />
                    <FieldError message={errors.companyName} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="pi-name" className={labelClass}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pi-name"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        className={cn(inputClass, errors.fullName && "border-red-300 focus:border-red-400 focus:ring-red-50")}
                        placeholder="Your full name"
                        disabled={pending}
                        autoComplete="name"
                      />
                      <FieldError message={errors.fullName} />
                    </div>
                    <div>
                      <label htmlFor="pi-title" className={labelClass}>
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pi-title"
                        type="text"
                        value={form.jobTitle}
                        onChange={(e) => update("jobTitle", e.target.value)}
                        className={cn(inputClass, errors.jobTitle && "border-red-300 focus:border-red-400 focus:ring-red-50")}
                        placeholder="e.g. Head of Partnerships"
                        disabled={pending}
                        autoComplete="organization-title"
                      />
                      <FieldError message={errors.jobTitle} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pi-email" className={labelClass}>
                      Business Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pi-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={cn(inputClass, errors.email && "border-red-300 focus:border-red-400 focus:ring-red-50")}
                      placeholder="name@organization.gov.my"
                      disabled={pending}
                      autoComplete="email"
                    />
                    <FieldError message={errors.email} />
                  </div>

                  <div>
                    <label htmlFor="pi-phone" className={labelClass}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={form.countryCode}
                        onChange={(e) => update("countryCode", e.target.value)}
                        disabled={pending}
                        className={cn(inputClass, "w-[6.5rem] shrink-0 px-2 sm:w-28")}
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        id="pi-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={cn(
                          inputClass,
                          "min-w-0 flex-1",
                          errors.phone && "border-red-300 focus:border-red-400 focus:ring-red-50"
                        )}
                        placeholder="12 345 6789"
                        disabled={pending}
                        autoComplete="tel-national"
                      />
                    </div>
                    <FieldError message={errors.phone} />
                  </div>

                  <div>
                    <label htmlFor="pi-website" className={labelClass}>
                      Company Website{" "}
                      <span className="font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      id="pi-website"
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      className={inputClass}
                      placeholder="https://www.example.com"
                      disabled={pending}
                      autoComplete="url"
                    />
                  </div>

                  <div>
                    <label htmlFor="pi-message" className={labelClass}>
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="pi-message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={5}
                      className={cn(
                        inputClass,
                        "min-h-[7.5rem] resize-y leading-relaxed",
                        errors.message && "border-red-300 focus:border-red-400 focus:ring-red-50"
                      )}
                      placeholder="Describe your organization, objectives, CSR initiatives, marketing goals, or how you would like to collaborate with MYLENS."
                      disabled={pending}
                    />
                    <FieldError message={errors.message} />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      disabled={pending}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                    />
                    <span className="text-sm leading-relaxed text-slate-600">
                      I agree to be contacted by the MYLENS partnership team regarding this inquiry.
                    </span>
                  </label>
                  <FieldError message={errors.consent} />

                  {errors.form && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errors.form}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-2.5 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={pending}
                      className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit Partnership Inquiry"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
