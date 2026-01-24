import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VoteType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetType, targetId, voteType } = await request.json();

    // Validate input
    if (!["reply", "comment", "question"].includes(targetType)) {
      return NextResponse.json(
        { error: "Invalid target type" },
        { status: 400 }
      );
    }

    if (!["HELPFUL", "INSIGHTFUL"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type" },
        { status: 400 }
      );
    }

    // Build where clause based on target type
    const whereClause: any = {
      userId: session.user.id,
    };

    if (targetType === "reply") {
      whereClause.replyId = targetId;
    } else if (targetType === "comment") {
      whereClause.commentId = targetId;
    } else if (targetType === "question") {
      whereClause.questionId = targetId;
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: whereClause,
    });

    let action: "created" | "updated" | "removed";
    let vote;

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Same vote type - remove the vote (toggle off)
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        action = "removed";
        vote = null;

        // Decrement vote count
        if (targetType === "reply") {
          await prisma.reply.update({
            where: { id: targetId },
            data: { voteCount: { decrement: 1 } },
          });
        } else if (targetType === "comment") {
          await prisma.comment.update({
            where: { id: targetId },
            data: { voteCount: { decrement: 1 } },
          });
        } else if (targetType === "question") {
          await prisma.question.update({
            where: { id: targetId },
            data: { voteCount: { decrement: 1 } },
          });
        }
      } else {
        // Different vote type - update the vote
        vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: voteType as VoteType },
        });
        action = "updated";
      }
    } else {
      // No existing vote - create new vote
      const voteData: any = {
        type: voteType as VoteType,
        user: { connect: { id: session.user.id } },
      };

      if (targetType === "reply") {
        voteData.reply = { connect: { id: targetId } };
      } else if (targetType === "comment") {
        voteData.comment = { connect: { id: targetId } };
      } else if (targetType === "question") {
        voteData.question = { connect: { id: targetId } };
      }

      vote = await prisma.vote.create({
        data: voteData,
      });
      action = "created";

      // Increment vote count
      if (targetType === "reply") {
        await prisma.reply.update({
          where: { id: targetId },
          data: { voteCount: { increment: 1 } },
        });
      } else if (targetType === "comment") {
        await prisma.comment.update({
          where: { id: targetId },
          data: { voteCount: { increment: 1 } },
        });
      } else if (targetType === "question") {
        await prisma.question.update({
          where: { id: targetId },
          data: { voteCount: { increment: 1 } },
        });
      }
    }

    // Get updated vote counts by type
    const votes = await prisma.vote.findMany({
      where: {
        ...(targetType === "reply" && { replyId: targetId }),
        ...(targetType === "comment" && { commentId: targetId }),
        ...(targetType === "question" && { questionId: targetId }),
      },
    });

    const newCount = {
      helpful: votes.filter((v) => v.type === "HELPFUL").length,
      insightful: votes.filter((v) => v.type === "INSIGHTFUL").length,
    };

    return NextResponse.json({ action, newCount, vote });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
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
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {
      userId: session.user.id,
    };

    if (targetType === "reply") {
      whereClause.replyId = targetId;
    } else if (targetType === "comment") {
      whereClause.commentId = targetId;
    } else if (targetType === "question") {
      whereClause.questionId = targetId;
    }

    const vote = await prisma.vote.findFirst({
      where: whereClause,
    });

    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    await prisma.vote.delete({
      where: { id: vote.id },
    });

    // Decrement vote count
    if (targetType === "reply") {
      await prisma.reply.update({
        where: { id: targetId },
        data: { voteCount: { decrement: 1 } },
      });
    } else if (targetType === "comment") {
      await prisma.comment.update({
        where: { id: targetId },
        data: { voteCount: { decrement: 1 } },
      });
    } else if (targetType === "question") {
      await prisma.question.update({
        where: { id: targetId },
        data: { voteCount: { decrement: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vote error:", error);
    return NextResponse.json(
      { error: "Failed to delete vote" },
      { status: 500 }
    );
  }
}
