import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ReplyForm } from "@/components/reply-form";
import { ReplyList } from "@/components/reply-list";
import { QuestionActions } from "@/components/question-actions";
import { IconCheck, IconClock, IconUser, IconMessageCircle } from "@tabler/icons-react";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id: questionId } = await params;

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
          _count: {
            select: { votes: true },
          },
        },
        orderBy: {
          createdAt: "asc",
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
              <div className="flex items-center gap-2">
                <IconUser size={18} />
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

          {/* Expert Claim Banner */}
          {question.expertClaimedById && question.expertClaimedBy && (
            <div className="p-4 bg-primary/10 border-b-2 border-foreground">
              <p className="text-sm font-bold">
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
            {((question.images && question.images.length > 0) || (question.videos && question.videos.length > 0)) && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Attached Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.images?.map((url, index) => (
                    <div key={url} className="border-2 border-foreground overflow-hidden">
                      <Image
                        src={url}
                        alt={`Image ${index + 1} for ${question.title}`}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                  {question.videos?.map((url, index) => (
                    <div key={url} className="border-2 border-foreground overflow-hidden">
                      <video
                        src={url}
                        controls
                        className="w-full h-auto"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <QuestionActions
              questionId={question.id}
              isAuthor={isAuthor}
              canClaim={canClaim}
              hasClaimed={hasClaimed}
              isSolved={question.isSolved}
            />
          </div>
        </article>

        {/* Replies Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <IconMessageCircle size={28} />
            {question._count.replies} {question._count.replies === 1 ? "Reply" : "Replies"}
          </h2>

          <ReplyList
            replies={question.replies}
            questionId={question.id}
            isQuestionAuthor={isAuthor}
            isSolved={question.isSolved}
            solvedReplyId={question.solvedByReplyId}
            currentUserId={session?.user?.id}
          />
        </div>

        {/* Reply Form */}
        {session?.user && !question.isSolved && question.status === "PUBLISHED" && (
          <div className="border-2 border-foreground p-6 md:p-8 bg-muted">
            <h3 className="text-xl font-black mb-4">Your Answer</h3>
            <ReplyForm
              questionId={question.id}
              isExpert={isExpert}
              hasClaimed={hasClaimed}
            />
          </div>
        )}

        {!session?.user && (
          <div className="border-2 border-foreground p-8 text-center">
            <p className="text-lg font-bold mb-4">Want to answer this question?</p>
            <Link
              href={`/login?callbackUrl=/questions/${question.id}`}
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Sign In to Reply
            </Link>
          </div>
        )}

        {question.isSolved && (
          <div className="border-2 border-green-600 p-6 bg-green-50 dark:bg-green-950/30 text-center">
            <IconCheck size={32} className="mx-auto mb-2 text-green-600" />
            <p className="font-bold text-green-900 dark:text-green-100">This question has been resolved</p>
          </div>
        )}
      </div>
    </div>
  );
}
