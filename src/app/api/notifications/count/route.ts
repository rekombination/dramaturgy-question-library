import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    let count = 0;

    // For experts: count published questions that are not solved
    if (userRole === "EXPERT" || userRole === "MODERATOR" || userRole === "ADMIN") {
      count = await prisma.question.count({
        where: {
          status: "PUBLISHED",
          isSolved: false,
        },
      });
    } else {
      // For regular users: count new replies on their questions from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      count = await prisma.reply.count({
        where: {
          question: {
            authorId: userId,
          },
          authorId: {
            not: userId, // Don't count their own replies
          },
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get notification count:", error);
    return NextResponse.json(
      { error: "Failed to get notification count" },
      { status: 500 }
    );
  }
}
