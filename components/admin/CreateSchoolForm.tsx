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
      className="inline-flex items-center gap-2 rounded-lg bg-[#0F3A2C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#175a44] disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Create school and generate token
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
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
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
