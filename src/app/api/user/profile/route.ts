import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileVisibility } from "@prisma/client";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      username,
      image,
      bio,
      expertiseAreas,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      vimeoUrl,
      linkedinUrl,
      websiteUrl,
      // Privacy settings
      profileVisibility,
      showActivity,
      showStats,
      showSocialLinks,
      emailNotifications,
      showInLeaderboards,
    } = body;

    // If username is being updated, validate it
    if (username !== undefined) {
      const trimmedUsername = username.trim().toLowerCase();

      // Validate username via the check-username endpoint logic
      if (trimmedUsername) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username: {
              equals: trimmedUsername,
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
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        username: username !== undefined ? username.trim().toLowerCase() || null : undefined,
        image: image || session.user.image,
        bio: bio || null,
        expertiseAreas: expertiseAreas || [],
        instagramUrl: instagramUrl || null,
        tiktokUrl: tiktokUrl || null,
        youtubeUrl: youtubeUrl || null,
        vimeoUrl: vimeoUrl || null,
        linkedinUrl: linkedinUrl || null,
        websiteUrl: websiteUrl || null,
        // Privacy settings (only update if provided)
        ...(profileVisibility !== undefined && { profileVisibility: profileVisibility as ProfileVisibility }),
        ...(showActivity !== undefined && { showActivity }),
        ...(showStats !== undefined && { showStats }),
        ...(showSocialLinks !== undefined && { showSocialLinks }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(showInLeaderboards !== undefined && { showInLeaderboards }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        image: updatedUser.image,
        bio: updatedUser.bio,
        expertiseAreas: updatedUser.expertiseAreas,
        instagramUrl: updatedUser.instagramUrl,
        tiktokUrl: updatedUser.tiktokUrl,
        youtubeUrl: updatedUser.youtubeUrl,
        vimeoUrl: updatedUser.vimeoUrl,
        linkedinUrl: updatedUser.linkedinUrl,
        websiteUrl: updatedUser.websiteUrl,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
