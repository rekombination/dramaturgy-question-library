import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ProfileVisibility } from "@prisma/client";

const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores"),
  bio: z.string().max(500).optional(),
  profileVisibility: z.enum(["PUBLIC", "MEMBERS_ONLY", "PRIVATE"]),
  showActivity: z.boolean(),
  showStats: z.boolean(),
  showSocialLinks: z.boolean(),
  emailNotifications: z.boolean(),
  showInLeaderboards: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Check if username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username.toLowerCase(),
          mode: "insensitive",
        },
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        username: validatedData.username.toLowerCase(),
        bio: validatedData.bio || null,
        profileVisibility: validatedData.profileVisibility as ProfileVisibility,
        showActivity: validatedData.showActivity,
        showStats: validatedData.showStats,
        showSocialLinks: validatedData.showSocialLinks,
        emailNotifications: validatedData.emailNotifications,
        showInLeaderboards: validatedData.showInLeaderboards,
        hasCompletedOnboarding: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[ONBOARDING]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
