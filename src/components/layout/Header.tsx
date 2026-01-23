"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/toolkits", label: "Toolkits" },
  { href: "/blog", label: "Blog" },
  { href: "/guidelines", label: "Guidelines" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-3 border-foreground bg-background">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="square" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center">
              <span className="text-lg md:text-xl font-black uppercase tracking-tight">
                THE DRAMATURGY
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-10 w-10 animate-pulse bg-muted" />
            ) : session?.user ? (
              <>
                <Button asChild size="lg" className="hidden md:flex font-bold">
                  <Link href="/submit">Ask Question</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-10 w-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <Avatar className="h-10 w-10 border-2 border-foreground">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.name || ""}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-2 border-foreground">
                    <div className="flex items-center justify-start gap-2 p-3">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user.name && (
                          <p className="font-bold">{session.user.name}</p>
                        )}
                        {session.user.email && (
                          <p className="truncate text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/me" className="font-medium">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/me/settings" className="font-medium">Settings</Link>
                    </DropdownMenuItem>
                    {(session.user.role === "EXPERT" ||
                      session.user.role === "MODERATOR" ||
                      session.user.role === "ADMIN") && (
                      <>
                        <DropdownMenuSeparator />
                        {session.user.role === "EXPERT" && (
                          <DropdownMenuItem asChild>
                            <Link href="/expert" className="font-medium">Expert Queue</Link>
                          </DropdownMenuItem>
                        )}
                        {(session.user.role === "MODERATOR" ||
                          session.user.role === "ADMIN") && (
                          <DropdownMenuItem asChild>
                            <Link href="/mod" className="font-medium">Moderation</Link>
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium text-primary cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="lg" className="hidden sm:flex font-bold">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="lg" className="font-bold">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-foreground text-background transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-background/20">
            <span className="text-base font-black uppercase tracking-tight">
              THE DRAMATURGY
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 w-10 flex items-center justify-center hover:bg-background/10 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="square" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Nav */}
          <nav className="flex-1 flex flex-col justify-center px-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="group py-4 border-b border-background/10 last:border-b-0"
              >
                <span className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-3xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="px-8 py-8 border-t border-background/20">
            {session?.user ? (
              <div className="space-y-4">
                <Link
                  href="/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 border-3 border-background bg-background text-foreground text-center font-bold text-lg hover:bg-foreground hover:text-background transition-all"
                >
                  Ask a Question
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-background/30">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{session.user.name || session.user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 border-3 border-background bg-background text-foreground text-center font-bold text-lg hover:bg-foreground hover:text-background transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 border-3 border-background text-background text-center font-bold text-lg hover:bg-background hover:text-foreground transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
