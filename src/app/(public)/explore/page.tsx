import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { QuestionCard } from "@/components/question/QuestionCard";
import { Input } from "@/components/ui/input";
import type { QuestionWithRelations, Tag } from "@/types";
import { mockQuestions, mockTags } from "@/lib/mocks/data";

export const metadata = {
  title: "Explore Questions",
  description: "Browse and search dramaturgical questions from the community.",
};

async function getQuestions(): Promise<QuestionWithRelations[]> {
  // Use mock data in local development
  if (process.env.USE_MOCK_DATA === "true") {
    return mockQuestions as any;
  }

  const session = await auth();

  // Build where clause based on user authentication and role
  let whereClause: any = { status: "PUBLISHED" };

  if (!session?.user) {
    // Non-authenticated users: only see public questions
    whereClause.isPrivate = false;
  } else if (session.user.role === "EXPERT" || session.user.role === "MODERATOR" || session.user.role === "ADMIN") {
    // Experts, moderators, and admins: see all published questions (no additional filter)
    // whereClause already has status: "PUBLISHED"
  } else {
    // Regular users: see public questions OR their own questions
    whereClause.OR = [
      { isPrivate: false },
      { authorId: session.user.id },
    ];
  }

  const questions = await prisma.question.findMany({
    where: whereClause,
    include: {
      author: {
        select: { id: true, name: true, image: true, role: true },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { replies: true, votes: true, bookmarks: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return questions as QuestionWithRelations[];
}

async function getTags() {
  // Use mock data in local development
  if (process.env.USE_MOCK_DATA === "true") {
    return mockTags;
  }

  return prisma.tag.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { name: "asc" },
  });
}

function QuestionListSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 bg-muted animate-pulse border-b-3 border-foreground" />
      ))}
    </div>
  );
}

async function QuestionList() {
  const questions = await getQuestions();

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 border-3 border-foreground">
        <div className="text-8xl font-black text-primary">?</div>
        <h3 className="mt-6 text-2xl font-bold">No questions yet</h3>
        <p className="text-muted-foreground mt-2 text-lg">
          Be the first to ask a question!
        </p>
        <Link
          href="/submit"
          className="inline-block mt-8 px-8 py-4 bg-foreground text-background font-bold text-lg hover:bg-primary transition-colors"
        >
          Ask the First Question
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

export default async function ExplorePage() {
  const tags = await getTags();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-3 border-foreground py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                Explore <span className="text-primary">Questions</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
                Browse dramaturgical questions from the community
              </p>
            </div>
            <Link
              href="/submit"
              className="px-8 py-4 bg-foreground text-background font-bold text-lg hover:bg-primary transition-colors self-start lg:self-auto"
            >
              Ask a Question
            </Link>
          </div>

          <div className="mt-8">
            <Input
              placeholder="Search questions..."
              className="max-w-xl h-14 text-lg border-3 border-foreground px-6 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Questions List */}
          <div className="flex-1">
            <Suspense fallback={<QuestionListSkeleton />}>
              <QuestionList />
            </Suspense>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Popular Tags */}
              <div className="border-3 border-foreground p-6">
                <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tags yet</p>
                  ) : (
                    tags.slice(0, 10).map((tag: Tag & { _count: { questions: number } }) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="px-3 py-1.5 border-2 border-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                      >
                        {tag.name}
                        <span className="ml-1 text-muted-foreground">
                          {tag._count.questions}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
                {tags.length > 10 && (
                  <Link
                    href="/tags"
                    className="inline-block mt-4 text-sm font-bold text-primary hover:underline"
                  >
                    View all tags
                  </Link>
                )}
              </div>

              {/* Context Types */}
              <div className="border-3 border-foreground p-6">
                <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
                  Context Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Rehearsal", "Show", "Touring", "Funding", "Team", "Audience"].map((type) => (
                    <button
                      key={type}
                      className="px-3 py-1.5 bg-muted text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-foreground text-background p-6">
                <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
                  Community
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-background/70">Questions</span>
                    <span className="font-bold text-primary">Growing</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-background/70">Members</span>
                    <span className="font-bold">Open</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-background/70">Status</span>
                    <span className="font-bold text-primary">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
