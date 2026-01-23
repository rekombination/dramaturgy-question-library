"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FeedbackModal } from "./FeedbackModal";
import { IconMessageCircle } from "@tabler/icons-react";

export function FeedbackButton() {
  const { data: session } = useSession();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 active:scale-95 transition-all flex items-center justify-center"
        aria-label="Send Feedback"
      >
        <IconMessageCircle size={24} />
      </button>

      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
