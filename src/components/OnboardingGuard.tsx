"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export function OnboardingGuard() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only run if session is loaded
    if (status === "loading") return;

    // If user is authenticated
    if (session?.user) {
      const hasCompletedOnboarding = session.user.hasCompletedOnboarding;

      // If not completed onboarding and not already on onboarding page
      if (!hasCompletedOnboarding && pathname !== "/onboarding") {
        // Don't redirect if they're on API routes or auth pages
        if (
          !pathname.startsWith("/api") &&
          !pathname.startsWith("/login") &&
          !pathname.startsWith("/register")
        ) {
          router.push("/onboarding");
        }
      }

      // If completed onboarding and trying to access onboarding page, redirect to dashboard
      if (hasCompletedOnboarding && pathname === "/onboarding") {
        router.push("/me");
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
