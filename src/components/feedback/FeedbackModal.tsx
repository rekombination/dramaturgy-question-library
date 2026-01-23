"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { IconCheck } from "@tabler/icons-react";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const feedbackTypes = [
  { value: "BUG", label: "Bug Report" },
  { value: "FEATURE", label: "Feature Request" },
  { value: "IMPROVEMENT", label: "Improvement" },
  { value: "OTHER", label: "Other" },
];

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          url: formData.url || window.location.href,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      setIsSuccess(true);
      setFormData({
        type: "",
        title: "",
        description: "",
        url: "",
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl border-2 border-foreground max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center">
                <IconCheck size={48} className="text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black">Thank You!</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Your feedback has been received. We appreciate you taking the time to help us improve The Dramaturgy.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="h-12 px-8 font-bold bg-primary text-primary-foreground"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Send Feedback</DialogTitle>
              <DialogDescription className="text-base">
                Help us improve The Dramaturgy by sharing your thoughts, reporting bugs, or suggesting features.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Feedback Type */}
          <div className="space-y-3">
            <Label htmlFor="type" className="text-sm font-bold">
              Feedback Type *
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="h-12 text-base border-2 border-foreground">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground bg-background">
                {feedbackTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-base cursor-pointer focus:bg-primary focus:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-bold">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief summary of your feedback"
              required
              minLength={5}
              maxLength={200}
              className="border-2 border-foreground"
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-bold">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about your feedback. For bugs, include steps to reproduce."
              required
              minLength={10}
              rows={6}
              className="text-base border-2 border-foreground p-4 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters
            </p>
          </div>

          {/* URL (optional) */}
          <div className="space-y-3">
            <Label htmlFor="url" className="text-sm font-bold">
              Page URL <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Leave empty to use current page"
              className="border-2 border-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Current page will be used if left empty
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.type || !formData.title || !formData.description}
              className="flex-1 h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 px-6 font-bold border-2 border-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
