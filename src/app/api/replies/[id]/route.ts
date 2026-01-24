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

    const { id: replyId } = await params;
    const { body } = await request.json();

    // Validate input
    if (!body || body.trim().length < 10) {
      return NextResponse.json(
        { error: "Reply body must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Check if reply exists and user is the author
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    if (reply.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own replies" },
        { status: 403 }
      );
    }

    // Update the reply
    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
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
      },
    });

    return NextResponse.json({ reply: updatedReply });
  } catch (error) {
    console.error("Edit reply error:", error);
    return NextResponse.json(
      { error: "Failed to edit reply" },
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

    const { id: replyId } = await params;

    // Check if reply exists and user is the author or admin
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: {
        question: true,
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    const isAuthor = reply.authorId === session.user.id;
    const isAdmin = ["ADMIN", "MODERATOR"].includes(session.user.role);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own replies" },
        { status: 403 }
      );
    }

    // Check if this reply is marked as the solution
    if (reply.question.solvedByReplyId === replyId) {
      return NextResponse.json(
        { error: "Cannot delete a reply that is marked as the solution" },
        { status: 400 }
      );
    }

    // Delete the reply (cascades to votes, comments, etc.)
    await prisma.reply.delete({
      where: { id: replyId },
    });

    // Decrement the question's reply count
    await prisma.question.update({
      where: { id: reply.questionId },
      data: { replyCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
