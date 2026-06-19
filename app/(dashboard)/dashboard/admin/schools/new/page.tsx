import Link from "next/link";
import CreateSchoolForm from "@/components/admin/CreateSchoolForm";

export default function NewSchoolPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/schools"
          className="text-sm text-emerald-800 hover:text-emerald-950"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to schools
        </Link>
        <h1
          className="text-2xl font-bold text-emerald-950 mt-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Add School
        </h1>
        <p className="text-zinc-600 text-sm mt-1" style={{ fontFamily: "var(--font-inter)" }}>
          Create a school and generate its event access token for student registration.
        </p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm">
        <CreateSchoolForm />
      </div>
    </div>
  );
}
