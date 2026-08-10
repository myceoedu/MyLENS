import CreateSchoolForm from "@/components/admin/CreateSchoolForm";
import {
  AdminBreadcrumbs,
  AdminCard,
  AdminPage,
  AdminPageHeader,
} from "@/components/admin/AdminUI";

export default function NewSchoolPage() {
  return (
    <AdminPage>
      <AdminBreadcrumbs
        items={[
          { label: "Schools", href: "/dashboard/admin/schools" },
          { label: "Add school" },
        ]}
      />

      <AdminPageHeader
        eyebrow="Campaign operations"
        title="Add school"
        description="Create a school and generate its event access token for student registration."
      />

      <AdminCard className="max-w-3xl p-6 sm:p-8">
        <CreateSchoolForm />
      </AdminCard>
    </AdminPage>
  );
}
