"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface SearchResultsInfoProps {
  totalCount: number;
  hasActiveSearch: boolean;
  hasActiveFilter: boolean;
}

export function SearchResultsInfo({
  totalCount,
  hasActiveSearch,
  hasActiveFilter,
}: SearchResultsInfoProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const context = searchParams.get("context");

  // Don't show anything if no search/filter is active
  if (!hasActiveSearch && !hasActiveFilter) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-sm">
      {totalCount === 0 ? (
        <>
          <span className="text-muted-foreground">
            No results
            {query && (
              <>
                {" "}for "<span className="font-medium text-foreground">{query}</span>"
              </>
            )}
          </span>
          <span className="text-muted-foreground">—</span>
          <Link
            href="/explore"
            className="font-medium text-primary hover:underline"
          >
            clear filters
          </Link>
        </>
      ) : (
        <>
          <span className="font-medium text-foreground">{totalCount}</span>
          <span className="text-muted-foreground">
            {totalCount === 1 ? "question" : "questions"} found
            {query && (
              <>
                {" "}for "<span className="font-medium text-foreground">{query}</span>"
              </>
            )}
            {context && (
              <>
                {" "}in <span className="font-medium text-foreground">{context.charAt(0) + context.slice(1).toLowerCase()}</span>
              </>
            )}
          </span>
        </>
      )}
    </div>
  );
}
