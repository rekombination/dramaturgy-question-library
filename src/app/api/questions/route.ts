import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendExpertRequestNotification } from "@/lib/email";

const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200, "Title must be less than 200 characters"),
  body: z.string().min(50, "Please provide more details (at least 50 characters)"),
  contextType: z.enum(["REHEARSAL", "SHOW", "TOURING", "FUNDING", "TEAM", "AUDIENCE", "OTHER"]),
  stakes: z.string().optional(),
  constraints: z.string().optional(),
  tried: z.string().optional(),
  sensitivityNote: z.string().optional(),
  isPrivate: z.boolean().default(false),
  requestExpert: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be signed in to post a question" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = questionSchema.parse(body);

    // Get user to check email verification status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerified: true },
    });

    // Determine status: PUBLISHED if email verified, DRAFT if not
    const questionStatus = user?.emailVerified ? "PUBLISHED" : "DRAFT";

    // Create question
    const question = await prisma.question.create({
      data: {
        title: validatedData.title,
        body: validatedData.body,
        contextType: validatedData.contextType,
        stakes: validatedData.stakes,
        constraints: validatedData.constraints,
        tried: validatedData.tried,
        sensitivityNote: validatedData.sensitivityNote,
        isPrivate: validatedData.isPrivate,
        requestExpert: validatedData.requestExpert,
        status: questionStatus,
        authorId: session.user.id,
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

    // Send email to experts if expert request and published
    if (questionStatus === "PUBLISHED" && validatedData.requestExpert) {
      const experts = await prisma.user.findMany({
        where: {
          role: { in: ["EXPERT", "MODERATOR", "ADMIN"] },
          emailVerified: { not: null },
        },
        select: { email: true },
      });

      const expertEmails = experts.map(e => e.email).filter(Boolean) as string[];

      if (expertEmails.length > 0) {
        await sendExpertRequestNotification({
          expertEmails,
          questionTitle: validatedData.title,
          questionId: question.id,
          questionAuthorName: question.author.name || "A community member",
        });
      }
    }

    const message = questionStatus === "PUBLISHED"
      ? "Question published successfully!"
      : "Question saved as draft. Please verify your email to publish it.";

    return NextResponse.json({
      success: true,
      question,
      message,
      status: questionStatus,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("[QUESTIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PUBLISHED";
    const contextType = searchParams.get("contextType");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {
      status,
    };

    // Only show public questions OR private questions owned by current user
    if (session?.user?.id) {
      where.OR = [
        { isPrivate: false },
        { isPrivate: true, authorId: session.user.id },
      ];
    } else {
      where.isPrivate = false;
    }

    if (contextType) {
      where.contextType = contextType;
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              replies: true,
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("[QUESTIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal error", message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
