"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingButtons } from "@/components/reply/VotingButtons";
import {
  IconCornerDownRight,
  IconPencil,
  IconTrash,
  IconDots,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VoteType } from "@prisma/client";
import Link from "next/link";

interface CommentAuthor {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  role: string;
}

interface CommentCardProps {
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    editedAt: Date | null;
    voteCount: number;
    author: CommentAuthor;
    parentCommentId: string | null;
    childComments?: any[];
    votes?: Array<{ type: VoteType; userId: string }>;
  };
  replyId: string;
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  onReply?: (commentId: string) => void;
}

export function CommentCard({
  comment,
  replyId,
  currentUserId,
  depth = 0,
  maxDepth = 2,
  onReply,
}: CommentCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAuthor = currentUserId === comment.author.id;
  const canReply = depth < maxDepth;

  // Calculate user's vote
  const userVote = comment.votes?.find((v) => v.userId === currentUserId)?.type || null;
  const helpfulCount = comment.votes?.filter((v) => v.type === "HELPFUL").length || 0;
  const insightfulCount = comment.votes?.filter((v) => v.type === "INSIGHTFUL").length || 0;

  const handleEdit = async () => {
    if (editBody.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      toast.success("Comment updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      toast.success("Comment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBody(comment.body);
    setIsEditing(false);
  };

  return (
    <div className={`${depth > 0 ? "ml-6 md:ml-12 border-l-2 border-muted pl-4" : ""}`}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={comment.author.image || ""}
                alt={comment.author.name || ""}
              />
              <AvatarFallback className="bg-muted text-xs font-bold">
                {comment.author.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {comment.author.username ? (
              <Link
                href={`/profile/${comment.author.username}`}
                className="text-sm font-bold hover:text-primary transition-colors"
              >
                {comment.author.username}
              </Link>
            ) : (
              <span className="text-sm font-bold">{comment.author.name || "Anonymous"}</span>
            )}

            {comment.author.role !== "USER" && (
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-bold uppercase">
                {comment.author.role}
              </span>
            )}

            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>

            {comment.editedAt && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>

          {isAuthor && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-muted transition-colors">
                  <IconDots size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-2 border-foreground">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="font-medium cursor-pointer"
                >
                  <IconPencil className="mr-2" size={16} />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="font-medium cursor-pointer text-destructive"
                >
                  <IconTrash className="mr-2" size={16} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Body */}
        {isEditing ? (
          <div className="space-y-2 ml-8">
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="min-h-[80px] text-sm border-2 border-foreground"
              placeholder="Edit your comment..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                disabled={isSaving}
                size="sm"
                className="h-8 px-3 text-xs font-bold"
              >
                <IconCheck size={14} className="mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold border-2"
              >
                <IconX size={14} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm ml-8 mb-2 whitespace-pre-wrap">{comment.body}</p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-3 ml-8">
            <VotingButtons
              targetType="comment"
              targetId={comment.id}
              initialHelpfulCount={helpfulCount}
              initialInsightfulCount={insightfulCount}
              userVote={userVote}
              compact
            />

            {canReply && onReply && currentUserId && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <IconCornerDownRight size={14} />
                Reply
              </button>
            )}
          </div>
        )}

        {/* Child Comments */}
        {comment.childComments && comment.childComments.length > 0 && (
          <div className="mt-3">
            {comment.childComments.map((child) => (
              <CommentCard
                key={child.id}
                comment={child}
                replyId={replyId}
                currentUserId={currentUserId}
                depth={depth + 1}
                maxDepth={maxDepth}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
