"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconHandStop } from "@tabler/icons-react";

interface QuestionActionsProps {
  questionId: string;
  isAuthor: boolean;
  canClaim: boolean;
  hasClaimed: boolean;
  isSolved: boolean;
}

export function QuestionActions({
  questionId,
  isAuthor,
  canClaim,
  hasClaimed,
  isSolved,
}: QuestionActionsProps) {
  const router = useRouter();
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const handleClaimQuestion = async () => {
    setIsClaimLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}/claim`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to claim question");
      }

      toast.success("You have claimed this question");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to claim question");
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {canClaim && (
        <Button
          onClick={handleClaimQuestion}
          disabled={isClaimLoading}
          className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
        >
          <IconHandStop className="mr-2" size={18} />
          {isClaimLoading ? "Claiming..." : "I'll Answer This"}
        </Button>
      )}
      {hasClaimed && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary font-bold text-sm">
          <IconHandStop size={18} />
          You have claimed this question
        </span>
      )}
    </div>
  );
}
