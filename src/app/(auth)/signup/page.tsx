"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGoogle, IconBrandWindows, IconBrandApple } from "@tabler/icons-react";

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
      <div className="min-h-[80vh] flex items-center justify-center py-8 md:py-0">
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
    <div className="min-h-[80vh] flex items-center py-8 md:py-0">
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
                disabled
                className="w-full h-14 text-base font-bold border-3 border-foreground opacity-50 cursor-not-allowed"
              >
                <IconBrandGoogle className="mr-3" size={20} stroke={1.5} />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                disabled
                className="w-full h-14 text-base font-bold border-3 border-foreground opacity-50 cursor-not-allowed"
              >
                <IconBrandWindows className="mr-3" size={20} stroke={1.5} />
                Continue with Microsoft
              </Button>
              <Button
                variant="outline"
                disabled
                className="w-full h-14 text-base font-bold border-3 border-foreground opacity-50 cursor-not-allowed"
              >
                <IconBrandApple className="mr-3" size={20} stroke={1.5} />
                Continue with Apple
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
