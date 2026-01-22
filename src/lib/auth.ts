import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { prisma } from "./db";

// Debug logging
console.log("[Auth] Initializing NextAuth...");
console.log("[Auth] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
console.log("[Auth] RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length || 0);
console.log("[Auth] EMAIL_FROM:", process.env.EMAIL_FROM);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@example.com",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        console.log("[Auth] sendVerificationRequest called");
        console.log("[Auth] Sending email to:", email);
        console.log("[Auth] Magic link URL:", url);
        console.log("[Auth] Provider from:", provider.from);

        try {
          const { Resend: ResendClient } = await import("resend");
          const resend = new ResendClient(process.env.RESEND_API_KEY);

          console.log("[Auth] Resend client created, sending email...");

          const result = await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: "Sign in to The Dramaturgy",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0A0A0A;">Sign in to The Dramaturgy</h1>
                <p>Click the button below to sign in:</p>
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #C8372D; color: white; text-decoration: none; font-weight: bold;">
                  Sign In
                </a>
                <p style="margin-top: 24px; color: #666;">
                  If you didn't request this email, you can safely ignore it.
                </p>
                <p style="color: #666;">
                  This link expires in 24 hours.
                </p>
              </div>
            `,
          });

          console.log("[Auth] Email send result:", JSON.stringify(result));
        } catch (error) {
          console.error("[Auth] Error sending email:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch additional user data
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, trustLevel: true },
        });
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.trustLevel = dbUser.trustLevel;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Initialize new user with default trust level
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { trustLevel: "NEW" },
        });
      }
    },
  },
});
