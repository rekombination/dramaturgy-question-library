"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    bio: "",
    expertiseAreas: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await update();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => {
        router.push("/me");
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/me"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="display-text">Settings</h1>
        </div>

        {/* Settings Form */}
        <div className="border-3 border-foreground p-8 md:p-12 bg-background">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Information */}
            <section>
              <h2 className="text-2xl font-black mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-3 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={session.user.email || ""}
                    disabled
                    className="w-full px-4 py-3 border-3 border-foreground bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-bold mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-3 border-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Brief description for your profile
                  </p>
                </div>

                {/* Expertise Areas */}
                <div>
                  <label htmlFor="expertise" className="block text-sm font-bold mb-2">
                    Expertise Areas
                  </label>
                  <input
                    type="text"
                    id="expertise"
                    placeholder="e.g., Directing, Dramaturgy, Movement (comma-separated)"
                    className="w-full px-4 py-3 border-3 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expertiseAreas: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Separate multiple areas with commas
                  </p>
                </div>
              </div>
            </section>

            {/* Account Information */}
            <section className="border-t-3 border-foreground pt-8">
              <h2 className="text-2xl font-black mb-6">Account Information</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted">
                  <div>
                    <div className="font-bold">Role</div>
                    <div className="text-sm text-muted-foreground">
                      {session.user.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted">
                  <div>
                    <div className="font-bold">Member Since</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.user.createdAt || "").toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Message */}
            {message && (
              <div
                className={`p-4 border-3 ${
                  message.type === "success"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-destructive bg-destructive/10 text-destructive"
                } font-bold`}
              >
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="submit" disabled={isLoading} size="lg" className="font-bold">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="font-bold"
                onClick={() => router.push("/me")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 border-3 border-destructive p-8 bg-destructive/5">
          <h2 className="text-2xl font-black text-destructive mb-4">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button variant="destructive" size="lg" className="font-bold">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
