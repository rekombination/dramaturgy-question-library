import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Question already bookmarked" },
        { status: 400 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        user: { connect: { id: session.user.id } },
        question: { connect: { id: questionId } },
      },
    });

    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error("Create bookmark error:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Find and delete bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        question: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                role: true,
              },
            },
            _count: {
              select: {
                replies: true,
                votes: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to get bookmarks" },
      { status: 500 }
    );
  }
}
