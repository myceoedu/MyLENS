export default function DashboardLoading({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label={label}>
      <div className="h-10 w-48 animate-pulse rounded-xl bg-[#ebe6db]" />
      <div className="overflow-hidden rounded-[1.75rem] border border-[#dfd9cd] bg-[#fbfbf8] p-6 sm:p-8">
        <div className="h-4 w-28 animate-pulse rounded bg-[#ebe6db]" />
        <div className="mt-4 h-8 w-64 max-w-full animate-pulse rounded bg-[#ebe6db]" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-[#f0ebe1]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-[#f0ebe1]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[#f0ebe1]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[#f0ebe1]" />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
