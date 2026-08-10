import AdminSubTabs from "@/components/admin/AdminSubTabs";

export default function LearningWorkspaceNav({
  active,
  reviewCount = 0,
}: {
  active: "lessons" | "assignments" | "reviews";
  reviewCount?: number;
}) {
  return (
    <AdminSubTabs
      tabs={[
        {
          href: "/dashboard/admin/learning",
          label: "Lessons",
          active: active === "lessons",
        },
        {
          href: "/dashboard/admin/learning/assignments",
          label: "Assignments",
          active: active === "assignments",
        },
        {
          href: "/dashboard/admin/learning/tasks",
          label: "Reviews",
          count: reviewCount,
          active: active === "reviews",
        },
      ]}
    />
  );
}
