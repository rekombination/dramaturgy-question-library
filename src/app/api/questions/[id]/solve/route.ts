import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendQuestionSolvedNotification } from "@/lib/email";

// POST mark question as solved
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

    const { replyId } = await request.json();

    if (!replyId) {
      return NextResponse.json(
        { error: "Missing replyId" },
        { status: 400 }
      );
    }

    const { id: questionId } = await params;

    // Check if user is the question author
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true, isSolved: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the question author can mark it as solved" },
        { status: 403 }
      );
    }

    if (question.isSolved) {
      return NextResponse.json(
        { error: "Question is already marked as solved" },
        { status: 400 }
      );
    }

    // Verify the reply exists and belongs to this question
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { questionId: true },
    });

    if (!reply || reply.questionId !== questionId) {
      return NextResponse.json(
        { error: "Reply not found or does not belong to this question" },
        { status: 400 }
      );
    }

    // Mark question as solved and get reply author details
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        isSolved: true,
        solvedAt: new Date(),
        solvedByReplyId: replyId,
      },
    });

    // Get reply author details for notification
    const replyWithAuthor = await prisma.reply.findUnique({
      where: { id: replyId },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Send email notification to reply author
    if (replyWithAuthor?.author.email) {
      await sendQuestionSolvedNotification({
        replyAuthorEmail: replyWithAuthor.author.email,
        replyAuthorName: replyWithAuthor.author.name || "there",
        questionTitle: updatedQuestion.title,
        questionId: updatedQuestion.id,
      });
    }

    return NextResponse.json({
      success: true,
      question: {
        id: updatedQuestion.id,
        isSolved: updatedQuestion.isSolved,
        solvedAt: updatedQuestion.solvedAt,
      },
    });
  } catch (error) {
    console.error("[QUESTION_SOLVE]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// DELETE unmark question as solved
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

    // Check if user is the question author
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true, isSolved: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the question author can unmark it as solved" },
        { status: 403 }
      );
    }

    if (!question.isSolved) {
      return NextResponse.json(
        { error: "Question is not marked as solved" },
        { status: 400 }
      );
    }

    // Unmark question as solved
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        isSolved: false,
        solvedAt: null,
        solvedByReplyId: null,
      },
    });

    return NextResponse.json({
      success: true,
      question: {
        id: updatedQuestion.id,
        isSolved: updatedQuestion.isSolved,
      },
    });
  } catch (error) {
    console.error("[QUESTION_UNSOLVE]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
