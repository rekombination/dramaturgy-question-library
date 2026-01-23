"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconCheck, IconUser, IconStar } from "@tabler/icons-react";

interface Reply {
  id: string;
  body: string;
  isExpertPerspective: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  _count: {
    votes: number;
  };
}

interface ReplyListProps {
  replies: Reply[];
  questionId: string;
  isQuestionAuthor: boolean;
  isSolved: boolean;
  solvedReplyId: string | null;
  currentUserId?: string;
}

export function ReplyList({
  replies,
  questionId,
  isQuestionAuthor,
  isSolved,
  solvedReplyId,
  currentUserId,
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
    <div className="space-y-6">
      {replies.map((reply) => {
        const isSolution = solvedReplyId === reply.id;
        const isAuthor = currentUserId === reply.author.id;

        return (
          <div
            key={reply.id}
            className={`border-2 ${
              isSolution
                ? "border-primary bg-primary/5"
                : "border-foreground"
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b-2 ${
              isSolution ? "border-primary bg-primary/10" : "border-foreground bg-muted"
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <IconUser size={18} />
                    <span className="font-bold">{reply.author.name || "Anonymous"}</span>
                    {reply.author.role !== "USER" && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold uppercase">
                        {reply.author.role}
                      </span>
                    )}
                    {reply.isExpertPerspective && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-foreground text-background text-xs font-bold uppercase">
                        <IconStar size={14} />
                        Expert
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {new Date(reply.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>

                {isSolution && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                    <IconCheck size={16} />
                    This Helped
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {reply.body}
              </p>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t-2 ${
              isSolution ? "border-primary" : "border-foreground"
            } bg-muted flex items-center justify-between`}>
              <div className="text-sm text-muted-foreground">
                {reply._count.votes} votes
              </div>

              {isQuestionAuthor && !isSolved && (
                <Button
                  onClick={() => handleMarkAsHelpful(reply.id)}
                  disabled={solvingReplyId === reply.id}
                  size="sm"
                  className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                >
                  <IconCheck className="mr-2" size={16} />
                  {solvingReplyId === reply.id ? "Marking..." : "This Helped Me"}
                </Button>
              )}

              {isQuestionAuthor && isSolution && (
                <Button
                  onClick={handleUnmarkHelpful}
                  size="sm"
                  variant="outline"
                  className="border-2 border-foreground font-bold"
                >
                  Unmark
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
