import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import { sendNewUserNotification } from "./email";
import bcrypt from "bcryptjs";

// Debug logging
console.log("[Auth] Initializing NextAuth...");
console.log("[Auth] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
console.log("[Auth] RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length || 0);
console.log("[Auth] EMAIL_FROM:", process.env.EMAIL_FROM);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@example.com",
      maxAge: 60 * 60, // 1 hour (in seconds)
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
                        <table width="100%" style="max-width: 500px; background-color: #FFFFFF; border: 3px solid #0A0A0A;">
                          <!-- Header -->
                          <tr>
                            <td style="padding: 32px 40px; text-align: center; border-bottom: 3px solid #0A0A0A;">
                              <img src="https://thedramaturgy.com/logo.png" alt="The Dramaturgy" width="140" height="46" style="display: inline-block; max-width: 140px; height: auto;" />
                            </td>
                          </tr>
                          <!-- Content -->
                          <tr>
                            <td style="padding: 40px; text-align: center;">
                              <h1 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 900; color: #0A0A0A;">
                                Sign in to The Dramaturgy
                              </h1>
                              <p style="margin: 0 0 28px 0; font-size: 16px; color: #333; line-height: 1.5;">
                                Click the button below to securely sign in to your account.
                              </p>
                              <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #C8372D; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 16px; border: 3px solid #0A0A0A;">
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
                                This link expires in 1 hour.
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
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch additional user data
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            trustLevel: true,
            username: true,
            hasCompletedOnboarding: true,
          },
        });
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.trustLevel = dbUser.trustLevel;
          session.user.username = dbUser.username;
          session.user.hasCompletedOnboarding = dbUser.hasCompletedOnboarding;
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

        // Notify admin about new registration
        await sendNewUserNotification({
          userName: user.name,
          userEmail: user.email,
          userId: user.id,
        });
      }
    },
  },
});
