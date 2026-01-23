"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconX, IconCheck, IconStar } from "@tabler/icons-react";
import Image from "next/image";

interface QuestionPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
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
  };
  authorName?: string;
}

const contextTypeLabels: Record<string, string> = {
  REHEARSAL: "Rehearsal",
  SHOW: "Show",
  TOURING: "Touring",
  FUNDING: "Funding",
  TEAM: "Team",
  AUDIENCE: "Audience",
  OTHER: "Other",
};

export function QuestionPreviewModal({
  open,
  onOpenChange,
  data,
  authorName,
}: QuestionPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Question Preview</DialogTitle>
          <DialogDescription>
            This is how your question will appear to others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl font-black flex-1">{data.title}</h1>
              <span className="shrink-0 px-3 py-1 bg-foreground text-background text-xs font-bold uppercase tracking-wider">
                {contextTypeLabels[data.contextType] || data.contextType}
              </span>
            </div>

            {/* Tags/Indicators */}
            <div className="flex flex-wrap gap-2">
              {data.isPrivate && (
                <span className="px-3 py-1 bg-muted border-2 border-foreground text-xs font-bold uppercase">
                  Private
                </span>
              )}
              {data.requestExpert && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                  <IconStar size={14} />
                  Expert Requested
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="border-2 border-foreground p-6 bg-muted/30">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Details
            </h3>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{data.body}</p>
          </div>

          {/* Media */}
          {((data.images && data.images.length > 0) || (data.videos && data.videos.length > 0)) && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Attached Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.images?.map((url, index) => (
                  <div key={url} className="border-2 border-foreground overflow-hidden">
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
                {data.videos?.map((url, index) => (
                  <div key={url} className="border-2 border-foreground overflow-hidden">
                    <video
                      src={url}
                      controls
                      className="w-full h-auto"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Fields */}
          {data.stakes && (
            <div className="border-2 border-foreground p-6 bg-muted/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                What&apos;s at Stake?
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{data.stakes}</p>
            </div>
          )}

          {data.constraints && (
            <div className="border-2 border-foreground p-6 bg-muted/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Constraints
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{data.constraints}</p>
            </div>
          )}

          {data.tried && (
            <div className="border-2 border-foreground p-6 bg-muted/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                What We&apos;ve Tried
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{data.tried}</p>
            </div>
          )}

          {data.isPrivate && data.sensitivityNote && (
            <div className="border-2 border-foreground p-6 bg-destructive/10">
              <h3 className="font-bold text-sm uppercase tracking-wider text-destructive mb-3">
                Sensitivity Note (Visible to Moderators Only)
              </h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{data.sensitivityNote}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-foreground">
            <p className="text-sm text-muted-foreground">
              Posted by {authorName || "You"}
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary text-primary-foreground font-bold"
            >
              <IconCheck className="mr-2" size={18} />
              Looks Good
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
