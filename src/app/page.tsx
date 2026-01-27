import Link from "next/link";
import { Metadata } from "next";
import { reader } from "@/lib/keystatic";
import { ResponsiveImage } from "@/components/blog/ResponsiveImage";
import { RandomQuote } from "@/components/home/RandomQuote";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://thedramaturgy.com",
  },
};

export default async function HomePage() {

  // Get latest blog posts
  const posts = await reader.collections.posts.all();
  const latestPosts = posts
    .sort((a, b) => {
      const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
      const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  // Get latest published questions
  const latestQuestions = await prisma.question.findMany({
    where: {
      status: "PUBLISHED",
      isPrivate: false,
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      voteCount: true,
      replyCount: true,
      contextType: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  // Get stats
  const [totalQuestions, totalAnswers, totalUsers] = await Promise.all([
    prisma.question.count({
      where: {
        status: "PUBLISHED",
        isPrivate: false,
      },
    }),
    prisma.reply.count({
      where: {
        status: "PUBLISHED",
      },
    }),
    prisma.user.count(),
  ]);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center border-b-2 border-foreground dark:border-b-0">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="hero-text">
                Questions
                <br />
                <span className="text-primary">that Shape</span>
                <br />
                Performance
              </h1>
              <p className="mt-8 text-xl md:text-2xl max-w-lg">
                A community space for dramaturgical questions, insights, and shared practice.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-colors text-center whitespace-nowrap"
                >
                  Explore Questions
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border-2 border-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-colors text-center whitespace-nowrap"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <RandomQuote />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b-2 border-foreground bg-foreground text-background dark:bg-card dark:border-b dark:border-b-border dark:border-l-0 dark:border-r-0 dark:border-t-0">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">{totalQuestions}</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wider text-white">Questions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">{totalAnswers}</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wider text-white">Answers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">{totalUsers}</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wider text-white">Community Members</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">Free</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wider text-white">To Join</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Questions */}
      {latestQuestions.length > 0 && (
        <section className="py-20 border-b-2 border-foreground dark:border-l-0 dark:border-r-0 dark:border-t-0">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <h2 className="display-text">Latest Questions</h2>
              <Link
                href="/explore"
                className="px-6 py-3 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                View All Questions
              </Link>
            </div>
            <div className="grid gap-6">
              {latestQuestions.map((question) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="group block border-2 border-foreground hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-xl md:text-2xl font-bold md:font-black group-hover:text-primary transition-colors flex-1">
                        {question.title}
                      </h3>
                      <span className="px-3 py-1 bg-muted text-xs font-bold uppercase tracking-wider shrink-0">
                        {question.contextType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {question.body}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div>
                        by <span className="font-bold text-foreground">{question.author.name || question.author.username || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{question.replyCount} {question.replyCount === 1 ? "answer" : "answers"}</span>
                        <span>{question.voteCount} {question.voteCount === 1 ? "vote" : "votes"}</span>
                      </div>
                      <div className="ml-auto text-xs">
                        {new Date(question.createdAt).toLocaleDateString("de-DE")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-20 md:py-32">
        <div className="container">
          <h2 className="display-text text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-0">
            <div className="border-2 border-foreground p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
              <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-background">01</div>
              <h3 className="mt-6 text-2xl font-bold">Ask Questions</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70">
                Share your dramaturgical challenges. Whether it&apos;s about rehearsal processes,
                show development, or team dynamics.
              </p>
            </div>
            <div className="border-2 border-foreground border-t-0 md:border-t-2 md:border-l-0 p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
              <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-background">02</div>
              <h3 className="mt-6 text-2xl font-bold">Get Perspectives</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70">
                Receive insights from fellow practitioners and industry experts
                who share their knowledge freely.
              </p>
            </div>
            <div className="border-2 border-foreground border-t-0 md:border-t-2 md:border-l-0 p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
              <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-background">03</div>
              <h3 className="mt-6 text-2xl font-bold">Build Knowledge</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70">
                Explore curated toolkits and browse questions by topic.
                Vote on the most insightful contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="py-20 border-t-2 border-foreground dark:border-l-0 dark:border-r-0 dark:border-b-0">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <h2 className="display-text">Latest Articles</h2>
              <Link
                href="/blog"
                className="px-6 py-3 border-2 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                View All Articles
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-background border-2 border-foreground transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  {post.entry.coverImage && (
                    <div className="aspect-video relative overflow-hidden border-b-2 border-foreground bg-muted">
                      <ResponsiveImage
                        src={post.entry.coverImage}
                        alt={post.entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 min-h-[280px] flex flex-col">
                    {post.entry.publishedAt && (
                      <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                        {new Date(post.entry.publishedAt).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight flex-grow group-hover:text-primary transition-colors">
                      {post.entry.title}
                    </h3>
                    {post.entry.description && (
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {post.entry.description}
                      </p>
                    )}
                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:gap-4 transition-all">
                      Read More
                      <span className="text-primary">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Topics */}
      <section className="py-20 bg-muted border-t-2 border-b-2 border-foreground">
        <div className="container">
          <h2 className="display-text mb-12">Explore Topics</h2>
          <div className="flex flex-wrap gap-4">
            {["Rehearsal", "Show Development", "Touring", "Funding", "Team Dynamics", "Audience", "Adaptation", "New Work", "Collaboration", "Research"].map((topic) => (
              <Link
                key={topic}
                href={`/explore?topic=${topic.toLowerCase()}`}
                className="px-6 py-3 bg-background border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="bg-primary text-primary-foreground p-12 md:p-20">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Ready to join the conversation?
              </h2>
              <p className="mt-6 text-xl text-primary-foreground/95">
                Sign up to ask questions, contribute answers, and build your personal
                collection of dramaturgical resources.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 border-2 border-primary-foreground bg-background text-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-all text-center"
                >
                  Create Account
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 border-2 border-primary-foreground text-primary-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-all text-center"
                >
                  Browse First
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
