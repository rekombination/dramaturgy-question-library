"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IconSortDescending } from "@tabler/icons-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "votes", label: "Most Votes" },
  { value: "replies", label: "Most Replies" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <IconSortDescending size={18} className="text-muted-foreground" stroke={1.5} />
      <div className="flex border-2 border-foreground">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSort(value)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              currentSort === value
                ? "bg-foreground text-background"
                : "bg-background hover:bg-muted"
            } ${value !== "newest" ? "border-l-2 border-foreground" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
