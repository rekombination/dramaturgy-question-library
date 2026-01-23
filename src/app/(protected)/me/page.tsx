import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user statistics and recent questions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      questions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          _count: {
            select: { replies: true, votes: true },
          },
        },
      },
      bookmarks: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          question: {
            include: {
              author: {
                select: { name: true, image: true },
              },
              _count: {
                select: { replies: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const stats = {
    totalQuestions: await prisma.question.count({
      where: { authorId: user.id },
    }),
    publishedQuestions: await prisma.question.count({
      where: { authorId: user.id, status: "PUBLISHED" },
    }),
    totalReplies: await prisma.reply.count({
      where: { authorId: user.id },
    }),
    bookmarksCount: await prisma.bookmark.count({
      where: { userId: user.id },
    }),
  };

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="display-text mb-4">My Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Welcome back, {user.name || "User"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="border-3 border-foreground p-6 bg-background">
            <div className="text-4xl font-black text-primary">
              {stats.totalQuestions}
            </div>
            <div className="mt-2 text-sm uppercase tracking-wider font-bold">
              Total Questions
            </div>
          </div>
          <div className="border-3 border-foreground p-6 bg-background">
            <div className="text-4xl font-black text-primary">
              {stats.publishedQuestions}
            </div>
            <div className="mt-2 text-sm uppercase tracking-wider font-bold">
              Published
            </div>
          </div>
          <div className="border-3 border-foreground p-6 bg-background">
            <div className="text-4xl font-black text-primary">
              {stats.totalReplies}
            </div>
            <div className="mt-2 text-sm uppercase tracking-wider font-bold">
              Replies Given
            </div>
          </div>
          <div className="border-3 border-foreground p-6 bg-background">
            <div className="text-4xl font-black text-primary">
              {stats.bookmarksCount}
            </div>
            <div className="mt-2 text-sm uppercase tracking-wider font-bold">
              Bookmarks
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Questions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black">My Questions</h2>
                <Link
                  href="/submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Ask New Question
                </Link>
              </div>

              <div className="space-y-4">
                {user.questions.length === 0 ? (
                  <div className="border-3 border-foreground p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven&apos;t asked any questions yet.
                    </p>
                    <Link
                      href="/submit"
                      className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                    >
                      Ask Your First Question
                    </Link>
                  </div>
                ) : (
                  user.questions.map((question) => (
                    <Link
                      key={question.id}
                      href={`/questions/${question.id}`}
                      className="block border-3 border-foreground p-6 hover:bg-foreground hover:text-background transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                                question.status === "PUBLISHED"
                                  ? "bg-primary text-primary-foreground"
                                  : question.status === "PENDING"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-foreground text-background"
                              } group-hover:bg-background group-hover:text-foreground`}
                            >
                              {question.status}
                            </span>
                            {question.isPrivate && (
                              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground">
                                Private
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {question.title}
                          </h3>
                          <p className="text-sm text-muted-foreground group-hover:text-background/70 line-clamp-2">
                            {question.body.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-bold">
                            {question._count.replies} replies
                          </div>
                          <div className="text-muted-foreground group-hover:text-background/70">
                            {question._count.votes} votes
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section className="border-3 border-foreground p-6 bg-muted">
              <h3 className="text-xl font-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/submit"
                  className="block px-4 py-3 bg-primary text-primary-foreground font-bold text-center hover:bg-primary/90 transition-colors"
                >
                  Ask a Question
                </Link>
                <Link
                  href="/explore"
                  className="block px-4 py-3 border-3 border-foreground bg-background font-bold text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Explore Questions
                </Link>
                <Link
                  href="/me/settings"
                  className="block px-4 py-3 border-3 border-foreground bg-background font-bold text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Settings
                </Link>
              </div>
            </section>

            {/* Bookmarks */}
            <section>
              <h3 className="text-xl font-black mb-4">Recent Bookmarks</h3>
              <div className="space-y-3">
                {user.bookmarks.length === 0 ? (
                  <div className="border-3 border-foreground p-4 text-sm text-muted-foreground text-center">
                    No bookmarks yet
                  </div>
                ) : (
                  user.bookmarks.map((bookmark) => (
                    <Link
                      key={bookmark.id}
                      href={`/questions/${bookmark.question.id}`}
                      className="block border-3 border-foreground p-4 hover:bg-foreground hover:text-background transition-colors group"
                    >
                      <h4 className="font-bold text-sm line-clamp-2 mb-2">
                        {bookmark.question.title}
                      </h4>
                      <div className="text-xs text-muted-foreground group-hover:text-background/70">
                        {bookmark.question._count.replies} replies
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* User Info */}
            <section className="border-3 border-foreground p-6 bg-foreground text-background">
              <h3 className="text-xl font-black mb-4">Your Profile</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-bold">Role:</span>{" "}
                  <span className="text-primary">{user.role}</span>
                </div>
                <div>
                  <span className="font-bold">Trust Level:</span>{" "}
                  {user.trustLevel}
                </div>
                <div>
                  <span className="font-bold">Member Since:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString("de-DE")}
                </div>
              </div>
              <Link
                href="/me/settings"
                className="block mt-4 px-4 py-2 border-3 border-background bg-background text-foreground font-bold text-center text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                Edit Profile
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
