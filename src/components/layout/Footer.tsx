import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconMessageCircle } from "@tabler/icons-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t-2 border-foreground bg-foreground text-background dark:bg-muted dark:text-foreground dark:border-border", className)}>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="brand-title text-2xl text-background dark:text-foreground font-semibold">The Dramaturgy</span>
            </Link>
            <p className="mt-4 text-sm text-background/90 dark:text-muted-foreground max-w-xs">
              A community platform for dramaturgical questions, insights, and knowledge sharing.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-background dark:text-foreground">Platform</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/explore" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Explore Questions
                </Link>
              </li>
              <li>
                <Link href="/toolkits" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Toolkits
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Browse Tags
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-background dark:text-foreground">Community</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/guidelines" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-background dark:text-foreground">Legal</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-background/90 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20 dark:border-foreground/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/70 dark:text-muted-foreground">
            &copy; {new Date().getFullYear()} The Dramaturgy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="text-sm font-bold text-background dark:text-foreground hover:underline transition-colors inline-flex items-center gap-2"
            >
              <IconMessageCircle size={18} />
              Send Feedback
            </Link>
            <Link
              href="/submit"
              className="text-sm font-bold text-background dark:text-foreground hover:underline transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold text-background dark:text-foreground hover:underline transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
