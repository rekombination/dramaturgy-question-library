"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconThumbUp, IconBulb } from "@tabler/icons-react";
import { toast } from "sonner";
import { VoteType } from "@prisma/client";

interface VotingButtonsProps {
  targetType: "reply" | "comment" | "question";
  targetId: string;
  initialHelpfulCount: number;
  initialInsightfulCount: number;
  userVote?: VoteType | null;
  compact?: boolean;
}

export function VotingButtons({
  targetType,
  targetId,
  initialHelpfulCount,
  initialInsightfulCount,
  userVote = null,
  compact = false,
}: VotingButtonsProps) {
  const router = useRouter();
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [insightfulCount, setInsightfulCount] = useState(initialInsightfulCount);
  const [currentVote, setCurrentVote] = useState<VoteType | null>(userVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: VoteType) => {
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const wasVoted = currentVote === voteType;
    const previousVote = currentVote;
    const previousHelpful = helpfulCount;
    const previousInsightful = insightfulCount;

    if (wasVoted) {
      // Remove vote
      setCurrentVote(null);
      if (voteType === "HELPFUL") {
        setHelpfulCount((prev) => prev - 1);
      } else {
        setInsightfulCount((prev) => prev - 1);
      }
    } else {
      // Add or change vote
      setCurrentVote(voteType);

      if (previousVote) {
        // Switching vote types
        if (previousVote === "HELPFUL") {
          setHelpfulCount((prev) => prev - 1);
          setInsightfulCount((prev) => prev + 1);
        } else {
          setInsightfulCount((prev) => prev - 1);
          setHelpfulCount((prev) => prev + 1);
        }
      } else {
        // New vote
        if (voteType === "HELPFUL") {
          setHelpfulCount((prev) => prev + 1);
        } else {
          setInsightfulCount((prev) => prev + 1);
        }
      }
    }

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          voteType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const data = await response.json();

      // Update with actual counts from server
      setHelpfulCount(data.newCount.helpful);
      setInsightfulCount(data.newCount.insightful);

      router.refresh();
    } catch (error) {
      // Rollback on error
      setCurrentVote(previousVote);
      setHelpfulCount(previousHelpful);
      setInsightfulCount(previousInsightful);
      toast.error("Failed to vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote("HELPFUL")}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-bold border-2 transition-colors ${
            currentVote === "HELPFUL"
              ? "bg-primary text-primary-foreground border-foreground"
              : "bg-background text-foreground border-foreground hover:bg-muted"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <IconThumbUp size={14} />
          {helpfulCount}
        </button>

        <button
          onClick={() => handleVote("INSIGHTFUL")}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-bold border-2 transition-colors ${
            currentVote === "INSIGHTFUL"
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-foreground hover:bg-muted"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <IconBulb size={14} />
          {insightfulCount}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => handleVote("HELPFUL")}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-bold border-2 border-foreground transition-colors ${
          currentVote === "HELPFUL"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground hover:bg-muted"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <IconThumbUp size={18} />
        <span className="flex items-center gap-2">
          {helpfulCount} <span className="hidden sm:inline">Helpful</span>
        </span>
      </button>

      <button
        onClick={() => handleVote("INSIGHTFUL")}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-bold border-2 border-foreground transition-colors ${
          currentVote === "INSIGHTFUL"
            ? "bg-foreground text-background"
            : "bg-background text-foreground hover:bg-muted"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <IconBulb size={18} />
        <span className="flex items-center gap-2">
          {insightfulCount} <span className="hidden sm:inline">Insightful</span>
        </span>
      </button>
    </div>
  );
}
