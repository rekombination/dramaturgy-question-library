"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconHandStop, IconTrash } from "@tabler/icons-react";

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
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  const handleDeleteQuestion = async () => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete question");
      }

      toast.success("Question deleted successfully");
      router.push("/explore");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete question");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
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
      {isAuthor && (
        <Button
          onClick={handleDeleteQuestion}
          disabled={isDeleteLoading}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold"
        >
          <IconTrash className="mr-2" size={18} />
          {isDeleteLoading ? "Deleting..." : "Delete Question"}
        </Button>
      )}
    </div>
  );
}
