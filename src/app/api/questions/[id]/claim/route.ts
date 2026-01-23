import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendExpertClaimNotification } from "@/lib/email";

// POST claim question as expert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is an expert
    const isExpert = ["EXPERT", "MODERATOR", "ADMIN"].includes(session.user.role);
    if (!isExpert) {
      return NextResponse.json(
        { error: "Only experts can claim questions" },
        { status: 403 }
      );
    }

    const { id: questionId } = await params;

    // Check if question exists and has expert request
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        requestExpert: true,
        expertClaimedById: true,
        isSolved: true,
        status: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (!question.requestExpert) {
      return NextResponse.json(
        { error: "This question does not have an expert request" },
        { status: 400 }
      );
    }

    if (question.expertClaimedById) {
      return NextResponse.json(
        { error: "This question has already been claimed by another expert" },
        { status: 400 }
      );
    }

    if (question.isSolved) {
      return NextResponse.json(
        { error: "This question is already solved" },
        { status: 400 }
      );
    }

    if (question.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Cannot claim unpublished question" },
        { status: 400 }
      );
    }

    // Claim the question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        expertClaimedById: session.user.id,
        expertClaimedAt: new Date(),
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Send email notification to question author
    if (updatedQuestion.author.email) {
      await sendExpertClaimNotification({
        questionAuthorEmail: updatedQuestion.author.email,
        questionAuthorName: updatedQuestion.author.name || "there",
        questionTitle: updatedQuestion.title,
        questionId: updatedQuestion.id,
        expertName: session.user.name || "An expert",
      });
    }

    return NextResponse.json({
      success: true,
      question: {
        id: updatedQuestion.id,
        expertClaimedById: updatedQuestion.expertClaimedById,
        expertClaimedAt: updatedQuestion.expertClaimedAt,
      },
    });
  } catch (error) {
    console.error("[QUESTION_CLAIM]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// DELETE unclaim question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: questionId } = await params;

    // Check if question exists and is claimed by this user
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        expertClaimedById: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.expertClaimedById !== session.user.id) {
      return NextResponse.json(
        { error: "You have not claimed this question" },
        { status: 403 }
      );
    }

    // Unclaim the question
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        expertClaimedById: null,
        expertClaimedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      question: {
        id: updatedQuestion.id,
        expertClaimedById: updatedQuestion.expertClaimedById,
      },
    });
  } catch (error) {
    console.error("[QUESTION_UNCLAIM]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
