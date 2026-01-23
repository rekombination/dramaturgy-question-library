import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all flags (moderators only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status: status as any } : {};

    const flags = await prisma.flag.findMany({
      where,
      include: {
        reporter: {
          select: {
            name: true,
            email: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
          },
        },
        reply: {
          select: {
            id: true,
            body: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("[MOD_FLAGS_GET]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
