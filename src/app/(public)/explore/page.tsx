import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { QuestionCard } from "@/components/question/QuestionCard";
import { SearchForm } from "@/components/explore/SearchForm";
import { ContextTypeFilter } from "@/components/explore/ContextTypeFilter";
import { SearchResultsInfo } from "@/components/explore/SearchResultsInfo";
import { SortSelect } from "@/components/explore/SortSelect";
import { TagFilter } from "@/components/explore/TagFilter";
import { Pagination } from "@/components/explore/Pagination";
import type { QuestionWithRelations, Tag } from "@/types";
import { mockQuestions, mockTags } from "@/lib/mocks/data";

export const metadata = {
  title: "Explore Questions",
  description: "Browse and search dramaturgical questions from the community.",
  alternates: {
    canonical: "https://thedramaturgy.com/explore",
  },
};

interface SearchParams {
  q?: string;
  context?: string;
  sort?: string;
  tag?: string;
  page?: string;
}

const PAGE_SIZE = 20;

interface QuestionsResult {
  questions: QuestionWithRelations[];
  totalCount: number;
}

async function getQuestions(searchParams: SearchParams): Promise<QuestionsResult> {
  // Use mock data in local development
  if (process.env.USE_MOCK_DATA === "true") {
    return { questions: mockQuestions as any, totalCount: mockQuestions.length };
  }

  const session = await auth();
  const { q, context, sort, tag, page } = searchParams;
  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * PAGE_SIZE;

  // Build where clause based on user authentication and role
  const whereClause: any = { status: "PUBLISHED" };

  if (!session?.user) {
    // Non-authenticated users: only see public questions
    whereClause.isPrivate = false;
  } else if (session.user.role === "EXPERT" || session.user.role === "MODERATOR" || session.user.role === "ADMIN") {
    // Experts, moderators, and admins: see all published questions (no additional filter)
  } else {
    // Regular users: see public questions OR their own questions
    whereClause.OR = [
      { isPrivate: false },
      { authorId: session.user.id },
    ];
  }

  // Search filter
  if (q && q.trim().length >= 2) {
    const searchTerm = q.trim();
    whereClause.AND = whereClause.AND || [];
    whereClause.AND.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { body: { contains: searchTerm, mode: "insensitive" } },
        { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
      ],
    });
  }

  // Context type filter
  if (context && ["REHEARSAL", "SHOW", "TOURING", "FUNDING", "TEAM", "AUDIENCE", "OTHER"].includes(context)) {
    whereClause.contextType = context;
  }

  // Tag filter
  if (tag) {
    whereClause.tags = {
      some: {
        tag: { slug: tag },
      },
    };
  }

  // Sort order
  let orderBy: any = { createdAt: "desc" };
  if (sort === "votes") {
    orderBy = { voteCount: "desc" };
  } else if (sort === "replies") {
    orderBy = { replyCount: "desc" };
  }

  const [questions, totalCount] = await Promise.all([
    prisma.question.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true, role: true },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: { replies: true, votes: true, bookmarks: true },
        },
      },
      orderBy,
      take: PAGE_SIZE,
      skip,
    }),
    prisma.question.count({ where: whereClause }),
  ]);

  return { questions: questions as QuestionWithRelations[], totalCount };
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
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
            {/* Stats Column - Desktop only */}
            <div className="hidden md:flex flex-col items-center gap-2 text-center min-w-[80px]">
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
              <div className="w-full h-px bg-muted my-2" />
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              <div className="h-3 w-14 bg-muted animate-pulse rounded" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Title and Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-7 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-7 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse shrink-0" />
              </div>

              {/* Body skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                <div className="h-6 w-14 bg-muted animate-pulse rounded" />
              </div>

              {/* Footer with Avatar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar skeleton */}
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>

                {/* Stats - Mobile + Time */}
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function QuestionList({ searchParams }: { searchParams: SearchParams }) {
  const { questions, totalCount } = await getQuestions(searchParams);

  if (questions.length === 0) {
    const hasFilters = searchParams.q || searchParams.context || searchParams.tag;
    return (
      <div className="text-center py-20 border-2 border-foreground">
        <div className="text-8xl font-black text-primary">?</div>
        <h3 className="mt-6 text-2xl font-bold">
          {hasFilters ? "No results found" : "No questions yet"}
        </h3>
        <p className="text-muted-foreground mt-2 text-lg">
          {hasFilters
            ? "Try adjusting your search or filters"
            : "Be the first to ask a question!"}
        </p>
        {hasFilters ? (
          <Link
            href="/explore"
            className="inline-block mt-8 px-8 py-4 bg-muted font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
          >
            Clear Filters
          </Link>
        ) : (
          <Link
            href="/submit"
            className="inline-block mt-8 px-8 py-4 bg-foreground text-background font-bold text-lg hover:bg-primary transition-colors"
          >
            Ask the First Question
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-0">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} searchQuery={searchParams.q} />
        ))}
      </div>
      <Suspense fallback={null}>
        <Pagination totalCount={totalCount} pageSize={PAGE_SIZE} />
      </Suspense>
    </>
  );
}

async function SearchResultsCount({ searchParams }: { searchParams: SearchParams }) {
  const { totalCount } = await getQuestions(searchParams);
  const hasActiveSearch = !!(searchParams.q && searchParams.q.trim().length >= 2);
  const hasActiveFilter = !!(searchParams.context || searchParams.tag);

  return (
    <SearchResultsInfo
      totalCount={totalCount}
      hasActiveSearch={hasActiveSearch}
      hasActiveFilter={hasActiveFilter}
    />
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tags = await getTags();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              Explore <span className="text-primary">Questions</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Browse dramaturgical questions from the community
            </p>
          </div>

          <div className="mt-8">
            <Suspense fallback={<div className="h-14 max-w-xl bg-muted animate-pulse" />}>
              <SearchForm />
            </Suspense>
            <Suspense fallback={null}>
              <SearchResultsCount searchParams={params} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Questions List */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6">
              <Suspense fallback={<div className="h-10 w-64 bg-muted animate-pulse" />}>
                <SortSelect />
              </Suspense>
            </div>

            <Suspense fallback={<QuestionListSkeleton />}>
              <QuestionList searchParams={params} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Popular Tags */}
              <div className="border-2 border-foreground p-6">
                <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
                  Filter by Tag
                </h3>
                <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
                  <TagFilter tags={tags as (Tag & { _count: { questions: number } })[]} />
                </Suspense>
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
              <div className="border-2 border-foreground p-6">
                <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
                  Context Types
                </h3>
                <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
                  <ContextTypeFilter />
                </Suspense>
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
