import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: questionId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the question to check ownership
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Only the author or admins can delete
    const isAuthor = question.authorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MODERATOR";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to delete this question" },
        { status: 403 }
      );
    }

    // Delete the question (cascade will delete replies, votes, etc.)
    await prisma.question.delete({
      where: { id: questionId },
    });

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("[QUESTION_DELETE]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
