import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { replyId, body, parentCommentId } = await request.json();

    // Validate input
    if (!replyId || !body) {
      return NextResponse.json(
        { error: "Reply ID and body are required" },
        { status: 400 }
      );
    }

    if (body.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (body.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be less than 1000 characters" },
        { status: 400 }
      );
    }

    // Check if reply exists
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // If parentCommentId is provided, check depth limit
    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId },
        include: {
          parentComment: true,
        },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }

      // Check depth: if parent has a parent, we're at max depth (2 levels)
      if (parentComment.parentCommentId) {
        return NextResponse.json(
          { error: "Maximum comment nesting depth reached" },
          { status: 400 }
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        body,
        reply: { connect: { id: replyId } },
        author: { connect: { id: session.user.id } },
        ...(parentCommentId && {
          parentComment: { connect: { id: parentCommentId } },
        }),
      },
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
        childComments: {
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
          },
        },
        votes: true,
      },
    });

    // Increment the reply's comment count
    await prisma.reply.update({
      where: { id: replyId },
      data: { commentCount: { increment: 1 } },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
