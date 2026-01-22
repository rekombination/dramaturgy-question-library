import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t-3 border-foreground bg-foreground text-background", className)}>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="The Dramaturgy"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-background/70 max-w-xs">
              A community platform for dramaturgical questions, insights, and knowledge sharing.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/explore" className="text-background/70 hover:text-primary transition-colors">
                  Explore Questions
                </Link>
              </li>
              <li>
                <Link href="/toolkits" className="text-background/70 hover:text-primary transition-colors">
                  Toolkits
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-background/70 hover:text-primary transition-colors">
                  Browse Tags
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-background/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Community</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/guidelines" className="text-background/70 hover:text-primary transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/70 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-background/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-background/70 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} The Dramaturgy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/submit"
              className="text-sm font-bold text-primary hover:text-background transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold text-background hover:text-primary transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
