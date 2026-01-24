"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FeedbackModal } from "./FeedbackModal";

export function FeedbackButton() {
  const { data: session } = useSession();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Floating button removed - feedback now handled via contact form */}
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
