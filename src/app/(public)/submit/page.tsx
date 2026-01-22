"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contextTypes = [
  { value: "REHEARSAL", label: "Rehearsal" },
  { value: "SHOW", label: "Show" },
  { value: "TOURING", label: "Touring" },
  { value: "FUNDING", label: "Funding" },
  { value: "TEAM", label: "Team" },
  { value: "AUDIENCE", label: "Audience" },
  { value: "OTHER", label: "Other" },
];

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contextType, setContextType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual submission
    console.log({ title, body, contextType });

    // For now, just redirect
    setTimeout(() => {
      router.push("/explore");
    }, 1000);
  };

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

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-bold">
                Question Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your dramaturgical question?"
                required
                className="h-14 text-lg border-3 border-foreground px-4"
              />
              <p className="text-sm text-muted-foreground">
                Be specific and imagine you&apos;re asking another dramaturg.
              </p>
            </div>

            {/* Context Type */}
            <div className="space-y-3">
              <Label htmlFor="context" className="text-lg font-bold">
                Context Type
              </Label>
              <Select value={contextType} onValueChange={setContextType} required>
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
                Details
              </Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe your situation, what you've already considered, and what kind of perspectives you're looking for..."
                required
                rows={8}
                className="text-base border-3 border-foreground p-4 resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Include relevant details about your production, timeline, or constraints.
              </p>
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
                  <span>Keep confidential production details anonymous</span>
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
                disabled={isSubmitting || !title || !body || !contextType}
                className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : "Post Question"}
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
          </form>
        </div>
      </section>
    </div>
  );
}
