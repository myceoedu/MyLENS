import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardPaginationProps {
  pathname: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  query?: Record<string, string | undefined>;
}

export default function DashboardPagination({
  pathname,
  currentPage,
  pageSize,
  totalItems,
  query,
}: DashboardPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) return null;

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4 sm:px-6"
    >
      <p className="text-xs text-zinc-500">
        Showing {firstItem}–{lastItem} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={pageHref(currentPage - 1)}
            className="inline-flex items-center gap-1 border border-[#ddd8ce] bg-white px-3 py-2 text-xs font-medium text-[#10271c] transition-colors hover:border-[#bba978]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs text-zinc-400">
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </span>
        )}
        <span className="px-1 text-xs text-zinc-500">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={pageHref(currentPage + 1)}
            className="inline-flex items-center gap-1 border border-[#ddd8ce] bg-white px-3 py-2 text-xs font-medium text-[#10271c] transition-colors hover:border-[#bba978]"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs text-zinc-400">
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
