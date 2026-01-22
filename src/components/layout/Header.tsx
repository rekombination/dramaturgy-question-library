"use client";

import Link from "next/link";
import Image from "next/image";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b-3 border-foreground bg-background">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="square"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r-3 border-foreground">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Image
                    src="/logo.png"
                    alt="The Dramaturgy"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                <Link
                  href="/explore"
                  className="text-xl font-bold hover:text-primary transition-colors py-3 border-b border-border"
                >
                  Explore
                </Link>
                <Link
                  href="/toolkits"
                  className="text-xl font-bold hover:text-primary transition-colors py-3 border-b border-border"
                >
                  Toolkits
                </Link>
                <Link
                  href="/tags"
                  className="text-xl font-bold hover:text-primary transition-colors py-3 border-b border-border"
                >
                  Tags
                </Link>
                <Link
                  href="/guidelines"
                  className="text-xl font-bold hover:text-primary transition-colors py-3 border-b border-border"
                >
                  Guidelines
                </Link>
                {!session?.user && (
                  <div className="mt-6 space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-2 border-foreground" size="lg">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="The Dramaturgy"
              width={160}
              height={53}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/explore"
              className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/toolkits"
              className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
            >
              Toolkits
            </Link>
            <Link
              href="/tags"
              className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/guidelines"
              className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors"
            >
              Guidelines
            </Link>
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
                  <Button variant="ghost" className="relative h-10 w-10 p-0">
                    <Avatar className="h-10 w-10 border-2 border-foreground">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
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
              <Button asChild variant="ghost" className="hidden sm:flex font-bold">
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
  );
}
