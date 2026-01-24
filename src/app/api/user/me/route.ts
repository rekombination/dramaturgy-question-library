import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        expertiseAreas: true,
        instagramUrl: true,
        tiktokUrl: true,
        youtubeUrl: true,
        vimeoUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
        profileVisibility: true,
        showActivity: true,
        showStats: true,
        showSocialLinks: true,
        emailNotifications: true,
        showInLeaderboards: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
