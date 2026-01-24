"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  questionId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({ questionId, initialBookmarked }: BookmarkButtonProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?questionId=${questionId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove bookmark");
        }

        toast.success("Bookmark removed");
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add bookmark");
        }

        toast.success("Question bookmarked");
      }

      router.refresh();
    } catch (error) {
      // Rollback on error
      setIsBookmarked(previousState);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 font-bold border-2 border-foreground transition-colors ${
        isBookmarked
          ? "bg-foreground text-background"
          : "bg-background text-foreground hover:bg-muted"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isBookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
      <span className="hidden sm:inline">
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </span>
    </button>
  );
}
