import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ReplyForm } from "@/components/reply-form";
import { ReplyList } from "@/components/reply-list";
import { ReplySortFilter } from "@/components/reply/ReplySortFilter";
import { QuestionActions } from "@/components/question-actions";
import { MediaGallery } from "@/components/media-gallery";
import { BookmarkButton } from "@/components/question/BookmarkButton";
import { QAPageJsonLd } from "@/components/seo/QAPageJsonLd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCheck, IconClock, IconUser, IconMessageCircle } from "@tabler/icons-react";

const siteUrl = "https://thedramaturgy.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    select: {
      title: true,
      body: true,
      isPrivate: true,
    },
  });

  if (!question || question.isPrivate) {
    return {
      title: "Question Not Found",
    };
  }

  // Truncate body for description
  const description = question.body.length > 160
    ? question.body.substring(0, 157) + "..."
    : question.body;

  return {
    title: question.title,
    description,
    alternates: {
      canonical: `${siteUrl}/questions/${id}`,
    },
    openGraph: {
      title: question.title,
      description,
      type: "article",
      url: `${siteUrl}/questions/${id}`,
    },
  };
}

export default async function QuestionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const session = await auth();
  const { id: questionId } = await params;
  const { sort = "best" } = await searchParams;

  // Validate sort parameter
  const sortOption = ["best", "newest", "expert"].includes(sort) ? sort : "best";

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          role: true,
          expertiseAreas: true,
        },
      },
      expertClaimedBy: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          role: true,
        },
      },
      solvedByReply: {
        select: {
          id: true,
        },
      },
      replies: {
        where: {
          status: "PUBLISHED",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              role: true,
            },
          },
          votes: {
            select: {
              type: true,
              userId: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                  role: true,
                },
              },
              votes: {
                select: {
                  type: true,
                  userId: true,
                },
              },
              childComments: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      image: true,
                      role: true,
                    },
                  },
                  votes: {
                    select: {
                      type: true,
                      userId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          votes: true,
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  // Check if user has bookmarked this question
  let isBookmarked = false;
  if (session?.user) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: question.id,
        },
      },
    });
    isBookmarked = !!bookmark;
  }

  // Sort replies based on sort option
  let sortedReplies = [...question.replies];
  if (sortOption === "best") {
    // Best: (HELPFUL * 2 + INSIGHTFUL * 1.5) DESC
    sortedReplies.sort((a, b) => {
      const aHelpful = a.votes.filter((v) => v.type === "HELPFUL").length;
      const aInsightful = a.votes.filter((v) => v.type === "INSIGHTFUL").length;
      const bHelpful = b.votes.filter((v) => v.type === "HELPFUL").length;
      const bInsightful = b.votes.filter((v) => v.type === "INSIGHTFUL").length;

      const aScore = aHelpful * 2 + aInsightful * 1.5;
      const bScore = bHelpful * 2 + bInsightful * 1.5;

      return bScore - aScore;
    });
  } else if (sortOption === "newest") {
    // Newest: createdAt DESC
    sortedReplies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortOption === "expert") {
    // Expert: isExpertPerspective DESC, createdAt DESC
    sortedReplies.sort((a, b) => {
      if (a.isExpertPerspective && !b.isExpertPerspective) return -1;
      if (!a.isExpertPerspective && b.isExpertPerspective) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Check if user can view this question
  if (question.status === "DRAFT") {
    if (!session?.user || session.user.id !== question.authorId) {
      notFound();
    }
  }

  if (question.status === "HIDDEN") {
    if (!session?.user ||
        (session.user.id !== question.authorId &&
         !["MODERATOR", "ADMIN"].includes(session.user.role))) {
      notFound();
    }
  }

  if (question.isPrivate && question.requestExpert) {
    // Private expert questions only visible to author and experts
    if (!session?.user) {
      redirect("/login?callbackUrl=/questions/" + questionId);
    }
    if (
      session.user.id !== question.authorId &&
      !["EXPERT", "MODERATOR", "ADMIN"].includes(session.user.role)
    ) {
      return (
        <div className="min-h-screen py-16">
          <div className="container max-w-4xl">
            <div className="border-2 border-foreground p-12 text-center">
              <h1 className="text-2xl font-black mb-4">Private Expert Question</h1>
              <p className="text-muted-foreground">
                This question is only visible to the author and experts.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Mark notifications as read when user views the question
  if (session?.user) {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        questionId: question.id,
        read: false,
      },
      data: { read: true },
    });
  }

  const isAuthor = session?.user?.id === question.authorId;
  const isExpert = session?.user?.role === "EXPERT" ||
                   session?.user?.role === "MODERATOR" ||
                   session?.user?.role === "ADMIN";
  const canClaim = isExpert && question.requestExpert && !question.expertClaimedById;
  const hasClaimed = session?.user?.id === question.expertClaimedById;

  return (
    <>
      <QAPageJsonLd question={question} />
      <div className="min-h-screen py-12 md:py-16">
        <div className="container max-w-4xl">
        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          ← Back to Questions
        </Link>

        {/* Status Badges */}
        {question.status === "DRAFT" && (
          <div className="mb-4 p-4 bg-muted border-2 border-foreground">
            <p className="text-sm font-bold">
              This is a draft. Verify your email to publish it.
            </p>
          </div>
        )}

        {/* Question Card */}
        <article className="border-2 border-foreground bg-background mb-8">
          {/* Header */}
          <div className="p-6 md:p-8 border-b-2 border-foreground bg-muted">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {question.isSolved && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                      <IconCheck size={16} />
                      Solved
                    </span>
                  )}
                  {question.requestExpert && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-foreground text-background text-xs font-bold uppercase">
                      <IconUser size={16} />
                      Expert Request
                    </span>
                  )}
                  {question.isPrivate && (
                    <span className="px-3 py-1 bg-muted-foreground/20 text-xs font-bold uppercase">
                      Private
                    </span>
                  )}
                  <span className="px-3 py-1 bg-background text-xs font-bold uppercase">
                    {question.contextType}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {question.title}
                </h1>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={question.author.image || ""}
                    alt={question.author.name || ""}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                    {question.author.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  {question.author.username ? (
                    <Link
                      href={`/profile/${question.author.username}`}
                      className="font-bold hover:text-primary transition-colors"
                    >
                      {question.author.username}
                    </Link>
                  ) : (
                    <span className="font-bold">{question.author.name || "Anonymous"}</span>
                  )}
                  {question.author.role !== "USER" && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold uppercase">
                      {question.author.role}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconClock size={18} />
                {new Date(question.createdAt).toLocaleDateString("de-DE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Expert Claim Banner - Only visible to question author and experts */}
          {question.expertClaimedById && question.expertClaimedBy && (isAuthor || isExpert) && (
            <div className="p-4 bg-muted border-b-2 border-foreground">
              <p className="text-sm font-bold text-muted-foreground">
                <IconUser size={16} className="inline mr-2" />
                Expert {question.expertClaimedBy.username || question.expertClaimedBy.name} is working on this question
              </p>
            </div>
          )}

          {/* Body */}
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap">{question.body}</p>
            </div>

            {/* Media Display */}
            <MediaGallery
              images={question.images}
              videos={question.videos}
              title={question.title}
            />

            {/* Additional Details */}
            {(question.stakes || question.constraints || question.sensitivityNote) && (
              <div className="mt-8 space-y-4">
                {question.stakes && (
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
                      Stakes
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.stakes}
                    </p>
                  </div>
                )}
                {question.constraints && (
                  <div className="border-l-4 border-foreground pl-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
                      Constraints
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.constraints}
                    </p>
                  </div>
                )}
                {question.sensitivityNote && (
                  <div className="border-l-4 border-muted-foreground pl-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
                      Sensitivity Note
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.sensitivityNote}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 md:p-8 border-t-2 border-foreground bg-muted">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <QuestionActions
                questionId={question.id}
                isAuthor={isAuthor}
                canClaim={canClaim}
                hasClaimed={hasClaimed}
                isSolved={question.isSolved}
              />
              {session?.user && (
                <BookmarkButton
                  questionId={question.id}
                  initialBookmarked={isBookmarked}
                />
              )}
            </div>
          </div>
        </article>

        {/* Replies Section */}
        <div className="border-2 border-foreground">
          <div className="p-6 md:p-8 bg-muted border-b-2 border-foreground">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <IconMessageCircle size={28} />
                {question._count.replies} {question._count.replies === 1 ? "Answer" : "Answers"}
              </h2>
              {session?.user && (
                <ReplySortFilter currentSort={sortOption as "best" | "newest" | "expert"} />
              )}
            </div>
          </div>

          <ReplyList
            replies={sortedReplies}
            questionId={question.id}
            isQuestionAuthor={isAuthor}
            isSolved={question.isSolved}
            solvedReplyId={question.solvedByReplyId}
            currentUserId={session?.user?.id}
            sortOption={sortOption as "best" | "newest" | "expert"}
          />
        </div>

        {/* Reply Form */}
        {session?.user && !question.isSolved && question.status === "PUBLISHED" && (
          <div className="mb-8 border-2 border-foreground border-t-0 p-6 md:p-8 bg-muted">
            <h3 className="text-xl font-black mb-4">Your Answer</h3>
            <ReplyForm
              questionId={question.id}
              isExpert={isExpert}
              hasClaimed={hasClaimed}
            />
          </div>
        )}

        {!session?.user && (
          <div className="mb-8 border-2 border-foreground border-t-0 p-8 text-center">
            <p className="text-lg font-bold mb-4">Want to answer this question?</p>
            <Link
              href={`/login?callbackUrl=/questions/${question.id}`}
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Sign In to Reply
            </Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
