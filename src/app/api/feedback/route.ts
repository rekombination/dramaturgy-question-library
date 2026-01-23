import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, description, url } = body;

    // Validation
    if (!type || !title || !description) {
      return NextResponse.json(
        { error: "Type, title, and description are required" },
        { status: 400 }
      );
    }

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: "Title must be between 5 and 200 characters" },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        type,
        title,
        description,
        url: url || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      feedback: {
        id: feedback.id,
        type: feedback.type,
        title: feedback.title,
      },
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
