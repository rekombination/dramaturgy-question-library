import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Temporary admin promotion endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, secret } = await request.json();

    // Simple secret key protection
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.email} promoted to ADMIN`,
      user: {
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Admin promotion error:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
}
