"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "inquiry", // "inquiry" or "feedback"
    subject: "",
    message: "",
    website: "", // Honeypot field
  });
  const [formStartTime, setFormStartTime] = useState<number>(0);

  // Track when form is loaded (spam protection)
  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

  // Pre-fill with session data if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam protection: Check if honeypot field is filled
    if (formData.website) {
      console.warn("[SPAM] Honeypot field was filled");
      setIsSubmitting(false);
      return;
    }

    // Spam protection: Check if form was submitted too quickly (less than 2 seconds)
    const timeTaken = Date.now() - formStartTime;
    if (timeTaken < 2000) {
      console.warn("[SPAM] Form submitted too fast:", timeTaken, "ms");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          messageType: formData.messageType,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessageSent(true);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (messageSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-8 md:py-0">
        <div className="container max-w-md">
          <div className="border-2 border-foreground p-8 md:p-12 text-center">
            <div className="text-6xl font-black text-primary mb-6">✓</div>
            <h1 className="text-2xl md:text-3xl font-bold">Message sent!</h1>
            <p className="mt-4 text-muted-foreground">
              Thank you for reaching out. We&apos;ve received your message and will get back to you as soon as possible.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              A confirmation email has been sent to <strong className="text-foreground">{formData.email}</strong>
            </p>
            <button
              onClick={() => {
                setMessageSent(false);
                setFormData({
                  name: session?.user?.name || "",
                  email: session?.user?.email || "",
                  messageType: "inquiry",
                  subject: "",
                  message: "",
                  website: "",
                });
                setFormStartTime(Date.now());
              }}
              className="mt-8 text-sm font-bold text-primary hover:underline"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-0 max-w-5xl mx-auto">
          {/* Left Side - Info */}
          <div className="hidden lg:flex flex-col justify-center bg-foreground text-background p-12 xl:p-16">
            <Image
              src="/logo.png"
              alt="The Dramaturgy"
              width={180}
              height={60}
              className="h-auto w-40 brightness-0 invert"
            />
            <h1 className="mt-8 text-4xl xl:text-5xl font-black leading-tight whitespace-nowrap">
              Get in <span className="text-background">Touch.</span>
            </h1>
            <p className="mt-6 text-lg text-background/70">
              Have a question, suggestion, or feedback? We&apos;d love to hear from you. Our team will get back to you as soon as possible.
            </p>
            <div className="mt-10 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Email</h3>
                <a
                  href="mailto:hello@thedramaturgy.com"
                  className="text-background hover:text-background/80 hover:underline text-lg font-bold"
                >
                  hello@thedramaturgy.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Community</h3>
                <p className="text-background/70">
                  Join our platform to connect directly with other dramaturgs
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="border-2 border-foreground lg:border-l-0 p-8 md:p-12">
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-black">Contact Us</h1>
              <p className="mt-2 text-muted-foreground">
                We&apos;d love to hear from you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider">
                  Message Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, messageType: "inquiry" })}
                    className={`h-14 px-4 border-2 border-foreground font-bold text-base transition-colors ${
                      formData.messageType === "inquiry"
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, messageType: "feedback" })}
                    className={`h-14 px-4 border-2 border-foreground font-bold text-base transition-colors ${
                      formData.messageType === "feedback"
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    Feedback
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-14 text-base border-2 border-foreground px-4"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-14 text-base border-2 border-foreground px-4"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="h-14 text-base border-2 border-foreground px-4"
                  placeholder="What is this about?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-bold uppercase tracking-wider">
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[200px] text-base border-2 border-foreground px-4 py-3"
                  placeholder="Your message..."
                />
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                tabIndex={-1}
                autoComplete="off"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                }}
                aria-hidden="true"
              />

              <Button
                type="submit"
                className="w-full h-14 text-base font-bold bg-primary hover:bg-foreground hover:text-background"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
