"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // redirect: false prevents NextAuth from redirecting, we handle UI ourselves
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/"
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="container max-w-md">
          <div className="border-3 border-foreground p-8 md:p-12 text-center">
            <div className="text-6xl font-black text-primary mb-6">✓</div>
            <h1 className="text-2xl md:text-3xl font-bold">Check your email</h1>
            <p className="mt-4 text-muted-foreground">
              We&apos;ve sent a magic link to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Click the link in your email to sign in. The link will expire in 24 hours.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="mt-8 text-sm font-bold text-primary hover:underline"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-0 max-w-5xl mx-auto">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center bg-foreground text-background p-12 xl:p-16">
            <Image
              src="/logo.png"
              alt="The Dramaturgy"
              width={180}
              height={60}
              className="h-auto w-40 brightness-0 invert"
            />
            <h1 className="mt-8 text-4xl xl:text-5xl font-black leading-tight">
              Welcome
              <br />
              <span className="text-primary">back.</span>
            </h1>
            <p className="mt-6 text-lg text-background/70">
              Sign in to continue your dramaturgical journey. Ask questions, share insights, and connect with the community.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="border-3 border-foreground lg:border-l-0 p-8 md:p-12">
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-black">Welcome back</h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full h-14 text-base font-bold border-3 border-foreground hover:bg-foreground hover:text-background"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="w-full h-14 text-base font-bold border-3 border-foreground hover:bg-foreground hover:text-background"
              >
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-bold tracking-wider">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-base border-3 border-foreground px-4"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending link..." : "Send magic link"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
