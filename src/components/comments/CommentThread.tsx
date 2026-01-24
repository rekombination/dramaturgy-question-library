"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommentCard } from "./CommentCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  IconMessagePlus,
  IconChevronDown,
  IconChevronUp,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface CommentThreadProps {
  replyId: string;
  comments: any[];
  currentUserId?: string;
  collapsed?: boolean;
}

export function CommentThread({
  replyId,
  comments,
  currentUserId,
  collapsed = false,
}: CommentThreadProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(collapsed && comments.length > 5);
  const [showForm, setShowForm] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topLevelComments = comments.filter((c) => !c.parentCommentId);
  const displayedComments = isCollapsed ? topLevelComments.slice(0, 3) : topLevelComments;

  const handleSubmit = async (parentCommentId: string | null = null) => {
    if (commentBody.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyId,
          body: commentBody,
          parentCommentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post comment");
      }

      toast.success("Comment posted");
      setCommentBody("");
      setShowForm(false);
      setReplyingToId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingToId(commentId);
    setShowForm(false); // Close main form if open
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setCommentBody("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setCommentBody("");
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h4>

        {comments.length > 5 && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            {isCollapsed ? (
              <>
                <IconChevronDown size={14} />
                Show all
              </>
            ) : (
              <>
                <IconChevronUp size={14} />
                Collapse
              </>
            )}
          </button>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        {displayedComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            replyId={replyId}
            currentUserId={currentUserId}
            depth={0}
            maxDepth={2}
            onReply={handleReply}
          />
        ))}
      </div>

      {/* Add Comment Button/Form */}
      {currentUserId && (
        <div className="mt-4">
          {!showForm && !replyingToId ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 border-foreground hover:bg-muted transition-colors"
            >
              <IconMessagePlus size={16} />
              Add Comment
            </button>
          ) : (
            showForm && (
              <div className="border-2 border-foreground p-4 bg-muted">
                <Textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  className="min-h-[80px] mb-3 border-2 border-foreground"
                  placeholder="Write a comment..."
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmit(null)}
                    disabled={isSubmitting || commentBody.trim().length < 10}
                    size="sm"
                    className="font-bold"
                  >
                    <IconSend size={14} className="mr-2" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="font-bold border-2"
                  >
                    <IconX size={14} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
