import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const questionUpdateSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  body: z.string().min(50).optional(),
  contextType: z.enum(["REHEARSAL", "SHOW", "TOURING", "FUNDING", "TEAM", "AUDIENCE", "OTHER"]).optional(),
  stakes: z.string().optional(),
  constraints: z.string().optional(),
  tried: z.string().optional(),
  sensitivityNote: z.string().optional(),
  isPrivate: z.boolean().optional(),
  requestExpert: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export async function PATCH(
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

    const body = await request.json();
    const validatedData = questionUpdateSchema.parse(body);

    // Check if question exists and user is the author
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (existingQuestion.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden", message: "You can only edit your own questions" },
        { status: 403 }
      );
    }

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: validatedData,
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

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[QUESTION_UPDATE]", error);
    return NextResponse.json(
      { error: "Internal error" },
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
