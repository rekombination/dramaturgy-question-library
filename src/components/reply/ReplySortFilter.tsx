"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  IconArrowsSort,
  IconTrophy,
  IconClock,
  IconStar,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "best" | "newest" | "expert";

interface ReplySortFilterProps {
  currentSort?: SortOption;
}

export function ReplySortFilter({ currentSort = "best" }: ReplySortFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "best", label: "Best", icon: IconTrophy },
    { value: "newest", label: "Newest", icon: IconClock },
    { value: "expert", label: "Expert Answers", icon: IconStar },
  ] as const;

  const currentOption = sortOptions.find((opt) => opt.value === currentSort) || sortOptions[0];

  const handleSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams);

    if (value === "best") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 font-bold border-2 border-foreground hover:bg-muted transition-colors">
          <IconArrowsSort size={18} />
          <span className="hidden sm:inline">{currentOption.label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-2 border-foreground">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSort(option.value as SortOption)}
              className={`font-medium cursor-pointer ${
                currentSort === option.value ? "bg-muted" : ""
              }`}
            >
              <Icon className="mr-2" size={16} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
