"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReplyCard } from "@/components/reply/ReplyCard";
import { ReplySortFilter } from "@/components/reply/ReplySortFilter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconCheck } from "@tabler/icons-react";
import { VoteType } from "@prisma/client";

interface Reply {
  id: string;
  body: string;
  isExpertPerspective: boolean;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date | null;
  voteCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    role: string;
  };
  votes?: Array<{ type: VoteType; userId: string }>;
  comments?: any[];
}

interface ReplyListProps {
  replies: Reply[];
  questionId: string;
  isQuestionAuthor: boolean;
  isSolved: boolean;
  solvedReplyId: string | null;
  currentUserId?: string;
  sortOption?: "best" | "newest" | "expert";
}

export function ReplyList({
  replies,
  questionId,
  isQuestionAuthor,
  isSolved,
  solvedReplyId,
  currentUserId,
  sortOption = "best",
}: ReplyListProps) {
  const router = useRouter();
  const [solvingReplyId, setSolvingReplyId] = useState<string | null>(null);

  const handleMarkAsHelpful = async (replyId: string) => {
    setSolvingReplyId(replyId);
    try {
      const response = await fetch(`/api/questions/${questionId}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to mark as helpful");
      }

      toast.success("Marked as helpful!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark as helpful");
    } finally {
      setSolvingReplyId(null);
    }
  };

  const handleUnmarkHelpful = async () => {
    try {
      const response = await fetch(`/api/questions/${questionId}/solve`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unmark");
      }

      toast.success("Unmarked");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unmark");
    }
  };

  if (replies.length === 0) {
    return (
      <div className="border-2 border-foreground p-8 text-center text-muted-foreground">
        No answers yet. Be the first to help!
      </div>
    );
  }

  return (
    <div>
      {/* Sort Filter */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">
          {replies.length} {replies.length === 1 ? "Answer" : "Answers"}
        </h3>
        <ReplySortFilter currentSort={sortOption} />
      </div>

      {/* Replies */}
      <div className="space-y-6">
        {replies.map((reply) => {
          const isSolution = solvedReplyId === reply.id;
          const isAuthor = currentUserId === reply.author.id;

          return (
            <div key={reply.id} className="space-y-3">
              <ReplyCard
                reply={reply}
                isSolution={isSolution}
                isAuthor={isAuthor}
                currentUserId={currentUserId}
              />

              {/* Mark as Helpful Button */}
              {isQuestionAuthor && !isSolved && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleMarkAsHelpful(reply.id)}
                    disabled={solvingReplyId === reply.id}
                    size="sm"
                    className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                  >
                    <IconCheck className="mr-2" size={16} />
                    {solvingReplyId === reply.id ? "Marking..." : "This Helped Me"}
                  </Button>
                </div>
              )}

              {isQuestionAuthor && isSolution && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleUnmarkHelpful}
                    size="sm"
                    variant="outline"
                    className="border-2 border-foreground font-bold"
                  >
                    Unmark Solution
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
