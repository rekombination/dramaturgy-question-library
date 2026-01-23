"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ReplyFormProps {
  questionId: string;
  isExpert: boolean;
  hasClaimed: boolean;
}

export function ReplyForm({ questionId, isExpert, hasClaimed }: ReplyFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isExpertPerspective, setIsExpertPerspective] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) {
      toast.error("Please write your answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          body: body.trim(),
          isExpertPerspective: isExpert && isExpertPerspective,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit reply");
      }

      toast.success("Your answer has been posted!");
      setBody("");
      setIsExpertPerspective(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reply-body" className="text-sm font-bold uppercase tracking-wider">
          Your Answer
        </Label>
        <Textarea
          id="reply-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your insights, experience, or suggestions..."
          rows={6}
          className="border-2 border-foreground resize-none"
          required
        />
      </div>

      {isExpert && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="expert-perspective"
            checked={isExpertPerspective}
            onCheckedChange={(checked) => setIsExpertPerspective(checked as boolean)}
          />
          <Label
            htmlFor="expert-perspective"
            className="text-sm font-bold cursor-pointer"
          >
            Mark as expert perspective
          </Label>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto h-12 px-8 bg-primary text-primary-foreground font-bold hover:bg-primary/90"
      >
        {isSubmitting ? "Posting..." : "Post Answer"}
      </Button>
    </form>
  );
}
