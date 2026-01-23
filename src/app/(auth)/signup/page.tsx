"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignUpContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // redirect: false prevents NextAuth from redirecting, we handle UI ourselves
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        console.error("Sign up error:", result.error);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Sign up error:", error);
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
              Click the link in your email to create your account. The link will expire in 24 hours.
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
          <div className="hidden lg:flex flex-col justify-center bg-primary text-primary-foreground p-12 xl:p-16">
            <Image
              src="/logo.png"
              alt="The Dramaturgy"
              width={180}
              height={60}
              className="h-auto w-40 brightness-0 invert"
            />
            <h1 className="mt-8 text-4xl xl:text-5xl font-black leading-tight">
              Join the
              <br />
              conversation.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Create an account to ask questions, share your expertise, and connect with the dramaturgical community.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-foreground text-primary font-black text-sm flex items-center justify-center">
                  ✓
                </span>
                <span>Ask unlimited questions</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-foreground text-primary font-black text-sm flex items-center justify-center">
                  ✓
                </span>
                <span>Share your expertise</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-foreground text-primary font-black text-sm flex items-center justify-center">
                  ✓
                </span>
                <span>Build your collection</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="border-3 border-foreground lg:border-l-0 p-8 md:p-12">
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-black">Create an account</h1>
              <p className="mt-2 text-muted-foreground">
                Join the dramaturgy community
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => signIn("google", { callbackUrl })}
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
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn("microsoft-entra-id", { callbackUrl })}
                className="w-full h-14 text-base font-bold border-3 border-foreground hover:bg-foreground hover:text-background"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Sign up with Microsoft
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn("apple", { callbackUrl })}
                className="w-full h-14 text-base font-bold border-3 border-foreground hover:bg-foreground hover:text-background"
              >
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign up with Apple
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

            <form onSubmit={handleEmailSignUp} className="space-y-6">
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
                {isLoading ? "Sending link..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
