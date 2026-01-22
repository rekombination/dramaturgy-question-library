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
      sendVerificationRequest: async ({ identifier: email, url }) => {
        console.log("[Auth] Sending magic link to:", email);

        try {
          const { Resend: ResendClient } = await import("resend");
          const resend = new ResendClient(process.env.RESEND_API_KEY);

          const result = await resend.emails.send({
            from: "The Dramaturgy <noreply@thedramaturgy.com>",
            to: email,
            subject: "Sign in to The Dramaturgy",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #FFFEF8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFEF8; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="100%" style="max-width: 500px; background-color: #0A0A0A; border: 3px solid #0A0A0A;">
                          <!-- Header -->
                          <tr>
                            <td style="padding: 40px 40px 30px 40px; text-align: center;">
                              <svg width="120" height="50" viewBox="0 0 431 180" style="display: inline-block;">
                                <circle cx="325" cy="45" r="45" fill="#C8372D"/>
                                <path d="M 0 180 L 0 90 A 90 90 0 0 1 180 90 L 180 180 L 135 180 L 135 90 A 45 45 0 0 0 45 90 L 45 180 Z" fill="#FFFEF8"/>
                                <rect x="220" y="85" width="80" height="20" fill="#FFFEF8"/>
                                <rect x="220" y="120" width="80" height="20" fill="#FFFEF8"/>
                                <rect x="220" y="155" width="80" height="20" fill="#FFFEF8"/>
                              </svg>
                            </td>
                          </tr>
                          <!-- Content -->
                          <tr>
                            <td style="padding: 0 40px 40px 40px; text-align: center;">
                              <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 900; color: #FFFEF8;">
                                Sign in to<br><span style="color: #C8372D;">The Dramaturgy</span>
                              </h1>
                              <p style="margin: 0 0 30px 0; font-size: 16px; color: #A0A0A0; line-height: 1.5;">
                                Click the button below to securely sign in to your account.
                              </p>
                              <a href="${url}" style="display: inline-block; padding: 16px 32px; background-color: #C8372D; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 16px;">
                                Sign In
                              </a>
                            </td>
                          </tr>
                        </table>
                        <!-- Footer -->
                        <table width="100%" style="max-width: 500px;">
                          <tr>
                            <td style="padding: 30px 20px; text-align: center;">
                              <p style="margin: 0 0 10px 0; font-size: 13px; color: #6B6B6B;">
                                This link expires in 24 hours.
                              </p>
                              <p style="margin: 0; font-size: 13px; color: #6B6B6B;">
                                If you didn't request this email, you can safely ignore it.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
          });

          console.log("[Auth] Email sent:", result);
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
