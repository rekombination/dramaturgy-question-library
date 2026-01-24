"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconCheck, IconArrowRight, IconEye, IconEyeOff, IconUsers } from "@tabler/icons-react";
import { ProfileVisibility } from "@prisma/client";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    profileVisibility: "PUBLIC" as ProfileVisibility,
    showActivity: true,
    showStats: true,
    showSocialLinks: true,
    emailNotifications: true,
    showInLeaderboards: true,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      // Update session
      await update();

      // Redirect to dashboard
      router.push("/me");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted border-2 border-foreground">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="border-2 border-foreground p-8 md:p-12 bg-background">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-4">
                  Welcome to The Dramaturgy!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Let's set up your profile in just a few steps. This will only take a minute.
                </p>
              </div>

              <div className="space-y-4 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <IconCheck size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Create Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a username and tell us about yourself
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <IconCheck size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile and activity
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <IconCheck size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Start Contributing</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions and share your knowledge
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full font-bold"
                size="lg"
              >
                Get Started
                <IconArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-2">
                  Create Your Profile
                </h2>
                <p className="text-muted-foreground">
                  This information will be visible on your public profile
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Display Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-bold mb-2">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase() })
                    }
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your-username"
                    minLength={3}
                    maxLength={30}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your profile will be at: /profile/{formData.username || "username"}
                  </p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-bold mb-2">
                    Bio <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="font-bold"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (!formData.name || !formData.username) {
                      setError("Please fill in all required fields");
                      return;
                    }
                    if (formData.username.length < 3) {
                      setError("Username must be at least 3 characters");
                      return;
                    }
                    setError(null);
                    setStep(3);
                  }}
                  className="flex-1 font-bold"
                  disabled={isLoading}
                >
                  Continue
                  <IconArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Privacy Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-2">
                  Privacy Settings
                </h2>
                <p className="text-muted-foreground">
                  Control who can see your profile and activity
                </p>
              </div>

              <div className="space-y-6">
                {/* Profile Visibility */}
                <div>
                  <label className="block text-sm font-bold mb-3">
                    Who can view your profile?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border-2 border-foreground cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="PUBLIC"
                        checked={formData.profileVisibility === "PUBLIC"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileVisibility: e.target.value as ProfileVisibility,
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <IconEye size={18} />
                          Public
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Anyone can view your profile, including non-logged in users
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border-2 border-foreground cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="MEMBERS_ONLY"
                        checked={formData.profileVisibility === "MEMBERS_ONLY"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileVisibility: e.target.value as ProfileVisibility,
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <IconUsers size={18} />
                          Members Only
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Only logged-in users can view your profile
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border-2 border-foreground cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="PRIVATE"
                        checked={formData.profileVisibility === "PRIVATE"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileVisibility: e.target.value as ProfileVisibility,
                          })
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <IconEyeOff size={18} />
                          Private
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Only you can view your profile
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Privacy Options */}
                <div className="pt-4 border-t-2 border-foreground space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showActivity}
                      onChange={(e) =>
                        setFormData({ ...formData, showActivity: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold">Show my questions and replies</div>
                      <p className="text-sm text-muted-foreground">
                        Display your questions and replies on your profile
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showStats}
                      onChange={(e) =>
                        setFormData({ ...formData, showStats: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold">Show statistics</div>
                      <p className="text-sm text-muted-foreground">
                        Display question count, reply count, and other stats
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) =>
                        setFormData({ ...formData, emailNotifications: e.target.checked })
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold">Email notifications</div>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about replies and mentions
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="font-bold"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Completing..." : "Complete Setup"}
                  {!isLoading && <IconCheck className="ml-2" size={20} />}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Skip Option (only on step 1) */}
        {step === 1 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/me")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
