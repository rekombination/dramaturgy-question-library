"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";

interface UsernameModalProps {
  open: boolean;
  userId: string;
}

export function UsernameModal({ open, userId }: UsernameModalProps) {
  const router = useRouter();
  const { update } = useSession();
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationState, setValidationState] = useState<{
    valid: boolean | null;
    message: string;
  }>({ valid: null, message: "" });

  // Debounced username validation
  useEffect(() => {
    if (!username || username.length < 3) {
      setValidationState({ valid: null, message: "" });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      try {
        const response = await fetch("/api/user/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, currentUserId: userId }),
        });

        const data = await response.json();
        setValidationState({
          valid: data.valid,
          message: data.message,
        });
      } catch (error) {
        setValidationState({
          valid: false,
          message: "Failed to validate username",
        });
      } finally {
        setIsChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [username, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validationState.valid) {
      toast.error("Please choose a valid username");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to set username");
      }

      // Update the session with new username
      await update();

      toast.success("Username set successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to set username");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-2 border-foreground"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Choose Your Username</DialogTitle>
          <DialogDescription className="text-base">
            Your username will be visible to the community and used in your profile URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-bold">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="border-2 border-foreground pr-10"
                required
                minLength={3}
                maxLength={30}
                autoFocus
              />
              {isChecking && (
                <IconLoader2
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
                  size={20}
                />
              )}
              {!isChecking && validationState.valid === true && (
                <IconCheck
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                  size={20}
                />
              )}
              {!isChecking && validationState.valid === false && (
                <IconX
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
                  size={20}
                />
              )}
            </div>
            {validationState.message && (
              <p
                className={`text-sm font-medium ${
                  validationState.valid ? "text-green-600" : "text-destructive"
                }`}
              >
                {validationState.message}
              </p>
            )}
          </div>

          <div className="border-2 border-foreground p-4 bg-muted/30 space-y-2">
            <h4 className="font-bold text-sm">Username Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-primary mt-1.5 shrink-0" />
                <span>3-30 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-primary mt-1.5 shrink-0" />
                <span>Only letters, numbers, hyphens, underscores, and periods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-primary mt-1.5 shrink-0" />
                <span>Must start and end with a letter or number</span>
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isChecking || !validationState.valid}
            className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Setting Username..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
