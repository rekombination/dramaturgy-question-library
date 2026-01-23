"use client";

import { useEffect, useState } from "react";
import { getRandomQuote, type Quote } from "@/data/quotes";

export function RandomQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Get a random quote on client-side mount
    setQuote(getRandomQuote());
  }, []);

  if (!quote) {
    // Return placeholder to avoid layout shift
    return (
      <div className="relative">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary" />
        <div className="relative bg-foreground text-background p-12">
          <blockquote className="text-2xl font-bold leading-relaxed">
            <span className="opacity-0">Loading...</span>
          </blockquote>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary" />
      <div className="relative bg-foreground text-background p-12">
        <blockquote className="text-2xl font-bold leading-relaxed">
          „{quote.text}"
        </blockquote>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-background/30" />
          <div className="text-right">
            <div className="text-sm font-bold">{quote.author}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
