import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH update flag status (moderators only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await request.json();
    const { id: flagId } = await params;

    if (!status || !["RESOLVED", "DISMISSED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const flag = await prisma.flag.update({
      where: { id: flagId },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedById: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      flag,
    });
  } catch (error) {
    console.error("[MOD_FLAG_PATCH]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
