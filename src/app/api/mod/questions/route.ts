import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      take: 100, // Limit to 100 most recent
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("[MOD_QUESTIONS]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
