"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandVimeo,
  IconBrandLinkedin,
  IconWorld,
  IconCheck,
  IconX,
  IconLoader2
} from "@tabler/icons-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    username: session?.user?.username || "",
    image: session?.user?.image || "",
    bio: "",
    expertiseAreas: [] as string[],
    instagramUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    vimeoUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
  });

  const [usernameValidation, setUsernameValidation] = useState<{
    checking: boolean;
    valid: boolean | null;
    message: string;
  }>({
    checking: false,
    valid: null,
    message: "",
  });

  // Username validation
  useEffect(() => {
    const originalUsername = session?.user?.username || "";

    // Skip validation if username hasn't changed or is empty
    if (!formData.username || formData.username === originalUsername) {
      setUsernameValidation({ checking: false, valid: null, message: "" });
      return;
    }

    if (formData.username.length < 3) {
      setUsernameValidation({ checking: false, valid: null, message: "" });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setUsernameValidation({ checking: true, valid: null, message: "" });
      try {
        const response = await fetch("/api/user/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            currentUserId: session?.user?.id
          }),
        });

        const data = await response.json();
        setUsernameValidation({
          checking: false,
          valid: data.valid,
          message: data.message,
        });
      } catch (error) {
        setUsernameValidation({
          checking: false,
          valid: false,
          message: "Failed to validate username",
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.username, session?.user?.id, session?.user?.username]);

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

        {/* Sticky Save Button */}
        <div className="sticky top-4 z-10 mb-6 border-2 border-foreground bg-background p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-muted-foreground">
              Don&apos;t forget to save your changes
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-bold"
                onClick={() => router.push("/me")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="sm"
                className="font-bold"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
          {message && (
            <div
              className={`mt-3 p-3 border-2 ${
                message.type === "success"
                  ? "border-green-600 bg-green-50 text-green-800"
                  : "border-destructive bg-destructive/10 text-destructive"
              } font-bold text-sm`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Settings Form */}
        <div className="border-2 border-foreground p-8 md:p-12 bg-background">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Information */}
            <section>
              <h2 className="text-2xl font-black mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Profile Image */}
                <ProfileImageUpload
                  currentImage={formData.image}
                  userName={session.user.name}
                  onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                />

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
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-bold mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                      className="w-full px-4 py-3 pr-10 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your-username"
                      minLength={3}
                      maxLength={30}
                    />
                    {usernameValidation.checking && (
                      <IconLoader2
                        className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
                        size={20}
                      />
                    )}
                    {!usernameValidation.checking && usernameValidation.valid === true && (
                      <IconCheck
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    )}
                    {!usernameValidation.checking && usernameValidation.valid === false && (
                      <IconX
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
                        size={20}
                      />
                    )}
                  </div>
                  {usernameValidation.message && (
                    <p
                      className={`text-sm mt-1 font-medium ${
                        usernameValidation.valid ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {usernameValidation.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Your username will be used in your profile URL: /profile/{formData.username || "username"}
                  </p>
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
                    className="w-full px-4 py-3 border-2 border-foreground bg-muted text-muted-foreground cursor-not-allowed"
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
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

            {/* Social Media Links */}
            <section className="border-t-2 border-foreground pt-8">
              <h2 className="text-2xl font-black mb-6">Social Media Links</h2>

              <div className="space-y-6">
                {/* Instagram */}
                <div>
                  <label htmlFor="instagram" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconBrandInstagram size={20} />
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                {/* TikTok */}
                <div>
                  <label htmlFor="tiktok" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconBrandTiktok size={20} />
                    TikTok
                  </label>
                  <input
                    type="url"
                    id="tiktok"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://tiktok.com/@username"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label htmlFor="youtube" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconBrandYoutube size={20} />
                    YouTube
                  </label>
                  <input
                    type="url"
                    id="youtube"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://youtube.com/@username"
                  />
                </div>

                {/* Vimeo */}
                <div>
                  <label htmlFor="vimeo" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconBrandVimeo size={20} />
                    Vimeo
                  </label>
                  <input
                    type="url"
                    id="vimeo"
                    value={formData.vimeoUrl}
                    onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://vimeo.com/username"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedin" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconBrandLinkedin size={20} />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="flex items-center gap-2 text-sm font-bold mb-2">
                    <IconWorld size={20} />
                    Website / Portfolio
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </section>

            {/* Account Information */}
            <section className="border-t-2 border-foreground pt-8">
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
                    <div className="font-bold">Account Status</div>
                    <div className="text-sm text-muted-foreground">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions - Bottom */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-foreground">
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
        <div className="mt-12 border-2 border-destructive p-8 bg-destructive/5">
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
