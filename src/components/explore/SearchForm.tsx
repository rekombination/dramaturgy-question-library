"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  // Sync with URL params on mount and when they change
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      // Clear existing timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Debounce: wait 400ms before updating URL
      const newTimeout = setTimeout(() => {
        updateSearchParams(value);
      }, 400);

      setTimeoutId(newTimeout);
    },
    [timeoutId, updateSearchParams]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    if (timeoutId) clearTimeout(timeoutId);
    updateSearchParams("");
  }, [timeoutId, updateSearchParams]);

  return (
    <div className="relative max-w-xl">
      <IconSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
        stroke={1.5}
      />
      <Input
        type="search"
        placeholder="Search questions..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-14 text-lg border-2 border-foreground pl-12 pr-12 placeholder:text-muted-foreground"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <IconX size={20} stroke={1.5} />
        </button>
      )}
    </div>
  );
}
