"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
}

export function Pagination({ totalCount, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`/explore?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border-2 border-foreground font-medium transition-colors hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-foreground disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <IconChevronLeft size={20} stroke={2} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-[40px] px-3 py-2 border-2 border-foreground font-bold transition-colors ${
              currentPage === page
                ? "bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border-2 border-foreground font-medium transition-colors hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-foreground disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <IconChevronRight size={20} stroke={2} />
      </button>
    </div>
  );
}
