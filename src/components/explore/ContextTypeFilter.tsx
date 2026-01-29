"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CONTEXT_TYPES = [
  { value: "REHEARSAL", label: "Rehearsal" },
  { value: "SHOW", label: "Show" },
  { value: "TOURING", label: "Touring" },
  { value: "FUNDING", label: "Funding" },
  { value: "TEAM", label: "Team" },
  { value: "AUDIENCE", label: "Audience" },
] as const;

export function ContextTypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("context");

  const handleFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === type) {
      params.delete("context");
    } else {
      params.set("context", type);
    }
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CONTEXT_TYPES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleFilter(value)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            selected === value
              ? "bg-foreground text-background"
              : "bg-muted hover:bg-foreground hover:text-background"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
