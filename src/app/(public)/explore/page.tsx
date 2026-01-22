import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { QuestionCard } from "@/components/question/QuestionCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { QuestionWithRelations, Tag } from "@/types";

export const metadata = {
  title: "Explore Questions",
  description: "Browse and search dramaturgical questions from the community.",
};

async function getQuestions(): Promise<QuestionWithRelations[]> {
  const questions = await prisma.question.findMany({
    where: { status: "PUBLISHED" },
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
  return prisma.tag.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { name: "asc" },
  });
}

function QuestionListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

async function QuestionList() {
  const questions = await getQuestions();

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No questions yet</h3>
        <p className="text-muted-foreground mt-2">
          Be the first to ask a question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

export default async function ExplorePage() {
  const tags = await getTags();

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Explore Questions</h1>
              <p className="text-muted-foreground mt-1">
                Browse dramaturgical questions from the community
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Input
              placeholder="Search questions..."
              className="max-w-md"
            />
          </div>

          <Separator className="my-6" />

          <Suspense fallback={<QuestionListSkeleton />}>
            <QuestionList />
          </Suspense>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-20">
            <h3 className="font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              ) : (
                tags.map((tag: Tag & { _count: { questions: number } }) => (
                  <Badge key={tag.id} variant="secondary" className="cursor-pointer hover:bg-accent">
                    {tag.name}
                    <span className="ml-1 text-muted-foreground">
                      ({tag._count.questions})
                    </span>
                  </Badge>
                ))
              )}
            </div>

            <Separator className="my-6" />

            <h3 className="font-semibold mb-4">Context Types</h3>
            <div className="flex flex-wrap gap-2">
              {["Rehearsal", "Show", "Touring", "Funding", "Team", "Audience"].map((type) => (
                <Badge key={type} variant="outline" className="cursor-pointer hover:bg-accent">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
