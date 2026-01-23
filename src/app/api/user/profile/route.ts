import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      bio,
      expertiseAreas,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      vimeoUrl,
      linkedinUrl,
      websiteUrl,
    } = body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        bio: bio || null,
        expertiseAreas: expertiseAreas || [],
        instagramUrl: instagramUrl || null,
        tiktokUrl: tiktokUrl || null,
        youtubeUrl: youtubeUrl || null,
        vimeoUrl: vimeoUrl || null,
        linkedinUrl: linkedinUrl || null,
        websiteUrl: websiteUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
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
