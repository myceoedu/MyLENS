"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { states } from "@/lib/data/states";
import { createSchoolAction, type ActionResult } from "@/lib/admin/actions";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth/errors";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-medium rounded-xl py-3 px-6 transition-all shadow-sm inline-flex items-center gap-2"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      Create School & Generate Token
    </button>
  );
}

export default function CreateSchoolForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    createSchoolAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          School created with a new access token. View it in the schools list.
        </div>
      )}

      <div>
        <label htmlFor="name" className={AUTH_LABEL_CLASS}>
          School Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g., SMK Victoria"
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label htmlFor="state_id" className={AUTH_LABEL_CLASS}>
          State / Territory
        </label>
        <select
          id="state_id"
          name="state_id"
          required
          className={AUTH_INPUT_CLASS}
          style={{ fontFamily: "var(--font-inter)" }}
          defaultValue=""
        >
          <option value="" disabled>
            Select state
          </option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-inter)" }}>
        A unique event access token (e.g. MYLENS-KL-42) will be generated automatically. Share it
        with the school coordinator for student registration.
      </p>

      <SubmitButton />
    </form>
  );
}
