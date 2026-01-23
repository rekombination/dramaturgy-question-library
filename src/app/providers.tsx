"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { UsernameModal } from "@/components/onboarding/UsernameModal";

function UsernameCheck() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated" && session?.user?.id && !session?.user?.username) {
    return <UsernameModal open={true} userId={session.user.id} />;
  }

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <UsernameCheck />
      <Toaster />
    </SessionProvider>
  );
}
