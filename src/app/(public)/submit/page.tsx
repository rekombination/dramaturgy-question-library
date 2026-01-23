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
import { IconX, IconPhoto, IconVideo, IconEye } from "@tabler/icons-react";
import { QuestionPreviewModal } from "@/components/question/QuestionPreviewModal";

const contextTypes = [
  { value: "REHEARSAL", label: "Rehearsal" },
  { value: "SHOW", label: "Show" },
  { value: "TOURING", label: "Touring" },
  { value: "FUNDING", label: "Funding" },
  { value: "TEAM", label: "Team" },
  { value: "AUDIENCE", label: "Audience" },
  { value: "OTHER", label: "Other" },
];

interface UploadedFile {
  url: string;
  type: "image" | "video";
  size: number;
  name: string;
}

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
  images?: string[];
  videos?: string[];
}

const STORAGE_KEY = "pending_question_draft";

export default function SubmitPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    images: [],
    videos: [],
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = 15 * 1024 * 1024; // 15MB
    const filesToUpload = Array.from(files);

    // Check file sizes first
    const oversizedFiles = filesToUpload.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`${oversizedFiles.length} file(s) exceed 15MB limit`, {
        description: oversizedFiles.map((f) => f.name).join(", "),
      });
      // Continue with valid files
      const validFiles = filesToUpload.filter((file) => file.size <= maxSize);
      if (validFiles.length === 0) {
        e.target.value = "";
        return;
      }
    }

    const validFiles = filesToUpload.filter((file) => file.size <= maxSize);
    setIsUploading(true);

    try {
      // Upload files sequentially
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data: UploadedFile = await response.json();
        setUploadedFiles((prev) => [...prev, data]);

        // Update form data
        if (data.type === "image") {
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), data.url],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            videos: [...(prev.videos || []), data.url],
          }));
        }
      }

      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeFile = (url: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.url !== url));
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((u) => u !== url) || [],
      videos: prev.videos?.filter((u) => u !== url) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check auth status
    if (status === "loading") {
      return;
    }

    if (!session) {
      // Save current form data and redirect to sign up
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      router.push(`/signup?callbackUrl=${encodeURIComponent("/submit")}`);
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

      // Redirect immediately
      router.push("/explore");
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
      <section className="border-b-2 border-foreground bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Ask a Question
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
            Share your dramaturgical challenge with the community. Be specific about your context for better responses.
          </p>
        </div>
      </section>

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
                className="h-14 text-lg border-2 border-foreground px-4"
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
                <SelectTrigger className="h-14 text-lg border-2 border-foreground px-4">
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
                className="text-base border-2 border-foreground p-4 resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Include relevant details about your production, timeline, or constraints. (Minimum 50 characters, currently: {formData.body.length})
              </p>
            </div>

            {/* Media Upload */}
            <div className="space-y-3">
              <Label className="text-lg font-bold">
                Images & Videos <span className="text-muted-foreground font-normal">(Optional, max 15MB each)</span>
              </Label>

              <div className="border-2 border-dashed border-foreground/30 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={isUploading}
                    variant="outline"
                    className="border-2 border-foreground font-bold"
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <IconPhoto className="mr-2" size={18} />
                        Upload Files
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Select multiple images or videos (max 15MB each)
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.url}
                        className="relative border-2 border-foreground bg-background overflow-hidden group"
                      >
                        {/* Preview */}
                        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                          {file.type === "image" ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={file.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="p-3 border-t-2 border-foreground">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(file.url)}
                              className="shrink-0 p-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                              aria-label="Remove file"
                            >
                              <IconX size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                className="text-base border-2 border-foreground p-4 resize-none"
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
                className="text-base border-2 border-foreground p-4 resize-none"
              />
            </div>


            {/* Privacy Toggle */}
            <div className="border-2 border-foreground p-6 space-y-4 bg-muted/30">
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
            <div className="bg-muted border-2 border-foreground p-6">
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
                onClick={() => setShowPreview(true)}
                disabled={!isFormValid}
                className="h-14 px-8 text-lg font-bold border-2 border-foreground hover:bg-foreground hover:text-background"
              >
                <IconEye className="mr-2" size={20} />
                Preview
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-14 px-8 text-lg font-bold border-2 border-foreground hover:bg-foreground hover:text-background"
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

      {/* Preview Modal */}
      <QuestionPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        data={formData}
        authorName={session?.user?.name || session?.user?.email || "You"}
      />
    </div>
  );
}
