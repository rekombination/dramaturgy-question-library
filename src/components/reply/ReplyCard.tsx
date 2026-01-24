"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingButtons } from "./VotingButtons";
import { SolutionBadge } from "./SolutionBadge";
import { ReplyActionsDropdown } from "./ReplyActionsDropdown";
import { CommentThread } from "@/components/comments/CommentThread";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconCheck, IconX, IconMessageCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { VoteType } from "@prisma/client";

interface ReplyAuthor {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  role: string;
}

interface ReplyCardProps {
  reply: {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    editedAt: Date | null;
    isExpertPerspective: boolean;
    voteCount: number;
    commentCount: number;
    author: ReplyAuthor;
    votes?: Array<{ type: VoteType; userId: string }>;
    comments?: any[];
  };
  isSolution?: boolean;
  isAuthor?: boolean;
  currentUserId?: string;
}

export function ReplyCard({
  reply,
  isSolution = false,
  isAuthor = false,
  currentUserId,
}: ReplyCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComments, setShowComments] = useState(reply.commentCount > 0);

  // Calculate vote counts
  const userVote = reply.votes?.find((v) => v.userId === currentUserId)?.type || null;
  const helpfulCount = reply.votes?.filter((v) => v.type === "HELPFUL").length || 0;
  const insightfulCount = reply.votes?.filter((v) => v.type === "INSIGHTFUL").length || 0;

  const handleEdit = async () => {
    if (editBody.trim().length < 10) {
      toast.error("Reply must be at least 10 characters");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/replies/${reply.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit reply");
      }

      toast.success("Reply updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update reply");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/replies/${reply.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to delete reply");
        setIsDeleting(false);
        return;
      }

      toast.success("Reply deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete reply");
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBody(reply.body);
    setIsEditing(false);
  };

  return (
    <div className="border-2 border-foreground bg-background">
      {/* Solution Badge */}
      {isSolution && <SolutionBadge />}

      {/* Reply Content */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={reply.author.image || ""}
                alt={reply.author.name || ""}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {reply.author.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                {reply.author.username ? (
                  <Link
                    href={`/profile/${reply.author.username}`}
                    className="font-bold hover:text-primary transition-colors"
                  >
                    {reply.author.username}
                  </Link>
                ) : (
                  <span className="font-bold">{reply.author.name || "Anonymous"}</span>
                )}

                {reply.author.role !== "USER" && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold uppercase">
                    {reply.author.role}
                  </span>
                )}

                {reply.isExpertPerspective && (
                  <span className="px-2 py-0.5 bg-foreground text-background text-xs font-bold uppercase">
                    Expert Answer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>
                  {new Date(reply.createdAt).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {reply.editedAt && <span className="italic">(edited)</span>}
              </div>
            </div>
          </div>

          {isAuthor && !isEditing && (
            <ReplyActionsDropdown
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </div>

        {/* Body */}
        {isEditing ? (
          <div className="space-y-3 mb-4">
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="min-h-[150px] border-2 border-foreground"
              placeholder="Edit your reply..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                disabled={isSaving}
                className="font-bold"
              >
                <IconCheck size={16} className="mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="font-bold border-2"
              >
                <IconX size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none mb-6">
            <p className="whitespace-pre-wrap">{reply.body}</p>
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t-2 border-foreground">
            <VotingButtons
              targetType="reply"
              targetId={reply.id}
              initialHelpfulCount={helpfulCount}
              initialInsightfulCount={insightfulCount}
              userVote={userVote}
            />

            {reply.commentCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <IconMessageCircle size={18} />
                {reply.commentCount} {reply.commentCount === 1 ? "Comment" : "Comments"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comments */}
      {!isEditing && showComments && (
        <div className="px-6 md:px-8 pb-6 border-t-2 border-foreground">
          <CommentThread
            replyId={reply.id}
            comments={reply.comments || []}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}
