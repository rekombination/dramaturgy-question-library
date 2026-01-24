import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;
    const { body } = await request.json();

    // Validate input
    if (!body || body.trim().length < 10) {
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

    // Check if comment exists and user is the author
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        body,
        editedAt: new Date(),
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

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    console.error("Edit comment error:", error);
    return NextResponse.json(
      { error: "Failed to edit comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;

    // Check if comment exists and user is the author or admin
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        childComments: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const isAuthor = comment.authorId === session.user.id;
    const isAdmin = ["ADMIN", "MODERATOR"].includes(session.user.role);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Count total comments to delete (including children)
    const deleteCount = 1 + comment.childComments.length;

    // Delete the comment (cascades to children and votes)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Decrement the reply's comment count
    await prisma.reply.update({
      where: { id: comment.replyId },
      data: { commentCount: { decrement: deleteCount } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
