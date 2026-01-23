"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const contextTypes = [
  { value: "REHEARSAL", label: "Rehearsal" },
  { value: "SHOW", label: "Show" },
  { value: "TOURING", label: "Touring" },
  { value: "FUNDING", label: "Funding" },
  { value: "TEAM", label: "Team" },
  { value: "AUDIENCE", label: "Audience" },
  { value: "OTHER", label: "Other" },
];

interface QuestionDraft {
  title: string;
  body: string;
  contextType: string;
  stakes?: string;
  constraints?: string;
  tried?: string;
  sensitivityNote?: string;
  isPrivate: boolean;
  requestExpert: boolean;
}

const STORAGE_KEY = "pending_question_draft";

export default function SubmitPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const [formData, setFormData] = useState<QuestionDraft>({
    title: "",
    body: "",
    contextType: "",
    stakes: "",
    constraints: "",
    tried: "",
    sensitivityNote: "",
    isPrivate: false,
    requestExpert: false,
  });

  // Load draft from sessionStorage on mount
  useEffect(() => {
    const savedDraft = sessionStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
        toast.info("Draft restored", {
          description: "Your previous question draft has been restored.",
        });
      } catch (error) {
        console.error("Failed to parse saved draft", error);
      }
    }
  }, []);

  // Auto-save draft to sessionStorage
  useEffect(() => {
    if (formData.title || formData.body) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const updateField = <K extends keyof QuestionDraft>(
    field: K,
    value: QuestionDraft[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check auth status
    if (status === "loading") {
      return;
    }

    if (!session) {
      // Save current form data and show auth prompt
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setShowAuthPrompt(true);
      toast.error("Authentication required", {
        description: "Please sign in to post your question. Your draft will be saved.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit question");
      }

      // Clear draft from sessionStorage
      sessionStorage.removeItem(STORAGE_KEY);

      toast.success("Question submitted!", {
        description: data.message || "Your question has been submitted for review.",
      });

      // Redirect after short delay
      setTimeout(() => {
        router.push("/explore");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.length >= 10 && formData.body.length >= 50 && formData.contextType;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-3 border-foreground bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Ask a Question
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
            Share your dramaturgical challenge with the community. Be specific about your context for better responses.
          </p>
        </div>
      </section>

      {/* Auth Prompt */}
      {showAuthPrompt && !session && (
        <div className="border-b-3 border-foreground bg-foreground text-background">
          <div className="container py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">Sign in to post your question</h3>
                <p className="text-background/80 mt-1">
                  Your draft has been saved and will be restored after you sign in.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent("/submit")}`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push(`/signup?callbackUrl=${encodeURIComponent("/submit")}`)}
                  variant="outline"
                  className="border-3 border-background text-background hover:bg-background hover:text-foreground"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-bold">
                Question Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="What's your dramaturgical question?"
                required
                minLength={10}
                maxLength={200}
                className="h-14 text-lg border-3 border-foreground px-4"
              />
              <p className="text-sm text-muted-foreground">
                Be specific and imagine you&apos;re asking another dramaturg. ({formData.title.length}/200)
              </p>
            </div>

            {/* Context Type */}
            <div className="space-y-3">
              <Label htmlFor="context" className="text-lg font-bold">
                Context Type *
              </Label>
              <Select value={formData.contextType} onValueChange={(value) => updateField("contextType", value)} required>
                <SelectTrigger className="h-14 text-lg border-3 border-foreground px-4">
                  <SelectValue placeholder="Select context type" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  {contextTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-base">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This helps others understand your situation better.
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3">
              <Label htmlFor="body" className="text-lg font-bold">
                Details *
              </Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => updateField("body", e.target.value)}
                placeholder="Describe your situation, what you've already considered, and what kind of perspectives you're looking for..."
                required
                minLength={50}
                rows={8}
                className="text-base border-3 border-foreground p-4 resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Include relevant details about your production, timeline, or constraints. (Minimum 50 characters, currently: {formData.body.length})
              </p>
            </div>

            {/* Optional: Stakes */}
            <div className="space-y-3">
              <Label htmlFor="stakes" className="text-lg font-bold">
                What&apos;s at Stake? <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="stakes"
                value={formData.stakes}
                onChange={(e) => updateField("stakes", e.target.value)}
                placeholder="What's important about this? What might be gained or lost?"
                rows={3}
                className="text-base border-3 border-foreground p-4 resize-none"
              />
            </div>

            {/* Optional: Constraints */}
            <div className="space-y-3">
              <Label htmlFor="constraints" className="text-lg font-bold">
                Constraints <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="constraints"
                value={formData.constraints}
                onChange={(e) => updateField("constraints", e.target.value)}
                placeholder="Budget, time, space, or other limitations..."
                rows={3}
                className="text-base border-3 border-foreground p-4 resize-none"
              />
            </div>

            {/* Optional: What have you tried */}
            <div className="space-y-3">
              <Label htmlFor="tried" className="text-lg font-bold">
                What Have You Tried? <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="tried"
                value={formData.tried}
                onChange={(e) => updateField("tried", e.target.value)}
                placeholder="What approaches have you already considered or attempted?"
                rows={3}
                className="text-base border-3 border-foreground p-4 resize-none"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="border-3 border-foreground p-6 space-y-4 bg-muted/30">
              <h3 className="font-bold text-lg">Privacy & Expert Options</h3>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => updateField("isPrivate", checked === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="isPrivate" className="font-bold cursor-pointer">
                    Make this question private
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only you and moderators will be able to see this question. Use this for sensitive topics or if you need to protect confidential production details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="requestExpert"
                  checked={formData.requestExpert}
                  onCheckedChange={(checked) => updateField("requestExpert", checked === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="requestExpert" className="font-bold cursor-pointer">
                    Request expert perspective
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Signal that you&apos;re specifically looking for input from experienced practitioners or subject matter experts.
                  </p>
                </div>
              </div>

              {formData.isPrivate && (
                <div className="space-y-3 pt-2">
                  <Label htmlFor="sensitivityNote" className="text-base font-bold">
                    Sensitivity Note <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="sensitivityNote"
                    value={formData.sensitivityNote}
                    onChange={(e) => updateField("sensitivityNote", e.target.value)}
                    placeholder="Any additional context for moderators about why this question is private..."
                    rows={2}
                    className="text-sm border-2 border-foreground p-3 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Guidelines reminder */}
            <div className="bg-muted border-3 border-foreground p-6">
              <h3 className="font-bold text-lg">Before you post</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary mt-2 shrink-0" />
                  <span>Check if a similar question already exists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary mt-2 shrink-0" />
                  <span>Questions are moderated before being published</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary mt-2 shrink-0" />
                  <span>Read our <Link href="/guidelines" className="text-primary font-medium hover:underline">community guidelines</Link></span>
                </li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : session ? "Post Question" : "Continue to Sign In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-14 px-8 text-lg font-bold border-3 border-foreground hover:bg-foreground hover:text-background"
              >
                Cancel
              </Button>
            </div>

            {!session && (
              <p className="text-sm text-muted-foreground">
                You&apos;ll be asked to sign in before posting. Your draft will be saved automatically.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
