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

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
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
        callbackUrl
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
      <div className="min-h-[80vh] flex items-center justify-center py-8 md:py-0">
        <div className="container max-w-md">
          <div className="border-3 border-foreground p-8 md:p-12 text-center">
            <div className="text-6xl font-black text-primary mb-6">✓</div>
            <h1 className="text-2xl md:text-3xl font-bold">Check your email</h1>
            <p className="mt-4 text-muted-foreground">
              We&apos;ve sent a magic link to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Click the link in your email to sign in. The link will expire in 1 hour.
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
