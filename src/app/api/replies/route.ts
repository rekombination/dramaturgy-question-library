import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendNewReplyNotification } from "@/lib/email";

// POST create a new reply
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { questionId, body, isExpertPerspective } = await request.json();

    if (!questionId || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if question exists and is not solved
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        isSolved: true,
        status: true,
        isPrivate: true,
        requestExpert: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.isSolved) {
      return NextResponse.json(
        { error: "Cannot reply to a solved question" },
        { status: 400 }
      );
    }

    if (question.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Cannot reply to unpublished question" },
        { status: 400 }
      );
    }

    // If it's a private expert question, only experts can answer
    if (question.isPrivate && question.requestExpert) {
      const isExpert = ["EXPERT", "MODERATOR", "ADMIN"].includes(session.user.role);
      if (!isExpert) {
        return NextResponse.json(
          { error: "Only experts can answer this question" },
          { status: 403 }
        );
      }
    }

    // Only experts can mark replies as expert perspective
    const shouldMarkAsExpert =
      isExpertPerspective &&
      ["EXPERT", "MODERATOR", "ADMIN"].includes(session.user.role);

    // Create the reply
    const reply = await prisma.reply.create({
      data: {
        body: body.trim(),
        questionId,
        authorId: session.user.id,
        status: "PUBLISHED",
        isExpertPerspective: shouldMarkAsExpert,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Get question author details and increment reply count
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        replyCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Create in-app notification for question author (if not replying to their own question)
    if (updatedQuestion.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: updatedQuestion.authorId,
          type: "NEW_REPLY",
          questionId: updatedQuestion.id,
          replyId: reply.id,
          actorId: session.user.id,
        },
      });
    }

    // Send email notification to question author (if not replying to their own question)
    if (updatedQuestion.authorId !== session.user.id && updatedQuestion.author.email) {
      await sendNewReplyNotification({
        questionAuthorEmail: updatedQuestion.author.email,
        questionAuthorName: updatedQuestion.author.name || "there",
        questionTitle: updatedQuestion.title,
        questionId: updatedQuestion.id,
        replyAuthorName: reply.author.name || "Someone",
      });
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("[REPLY_POST]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
