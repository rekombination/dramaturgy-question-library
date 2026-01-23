import Link from "next/link";
import { reader } from "@/lib/keystatic";
import { ResponsiveImage } from "@/components/blog/ResponsiveImage";
import { getRandomQuote } from "@/data/quotes";

export default async function HomePage() {
  // Get random quote
  const quote = getRandomQuote();

  // Get latest blog posts
  const posts = await reader.collections.posts.all();
  const latestPosts = posts
    .sort((a, b) => {
      const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
      const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center border-b-3 border-foreground">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="hero-text">
                The Questions
                <br />
                <span className="text-primary">That Shape</span>
                <br />
                Theatre
              </h1>
              <p className="mt-8 text-xl md:text-2xl max-w-lg">
                A community platform for dramaturgical questions, insights, and knowledge sharing.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-colors text-center"
                >
                  Explore Questions
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 border-3 border-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-colors text-center"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary" />
                <div className="relative bg-foreground text-background p-12">
                  <blockquote className="text-2xl font-bold leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-background/30" />
                    <div className="text-right">
                      <div className="text-sm font-bold">{quote.author}</div>
                      <div className="text-xs text-background/70 mt-1">{quote.source}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b-3 border-foreground bg-foreground text-background">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary">?</div>
              <div className="mt-2 text-sm uppercase tracking-wider">Questions Waiting</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black">Open</div>
              <div className="mt-2 text-sm uppercase tracking-wider">Community</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary">Free</div>
              <div className="mt-2 text-sm uppercase tracking-wider">To Join</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black">Now</div>
              <div className="mt-2 text-sm uppercase tracking-wider">Get Started</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-32">
        <div className="container">
          <h2 className="display-text text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-0">
            <div className="border-3 border-foreground p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
              <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-background">01</div>
              <h3 className="mt-6 text-2xl font-bold">Ask Questions</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70">
                Share your dramaturgical challenges. Whether it&apos;s about rehearsal processes,
                show development, or team dynamics.
              </p>
            </div>
            <div className="border-3 border-foreground border-t-0 md:border-t-3 md:border-l-0 p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
              <div className="text-6xl md:text-8xl font-black text-primary group-hover:text-background">02</div>
              <h3 className="mt-6 text-2xl font-bold">Get Perspectives</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70">
                Receive insights from fellow practitioners and industry experts
                who share their knowledge freely.
              </p>
            </div>
            <div className="border-3 border-foreground border-t-0 md:border-t-3 md:border-l-0 p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors group">
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
        <section className="py-20 border-y-3 border-foreground">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <h2 className="display-text">Latest Articles</h2>
              <Link
                href="/blog"
                className="px-6 py-3 border-3 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border-3 border-foreground hover:bg-foreground hover:text-background transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  {post.entry.coverImage && (
                    <div className="aspect-video relative overflow-hidden border-b-3 border-foreground bg-muted">
                      <ResponsiveImage
                        src={post.entry.coverImage}
                        alt={post.entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 min-h-[280px] flex flex-col">
                    {post.entry.publishedAt && (
                      <p className="text-sm text-muted-foreground group-hover:text-background/70 mb-3 uppercase tracking-wider">
                        {new Date(post.entry.publishedAt).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight flex-grow">
                      {post.entry.title}
                    </h3>
                    {post.entry.description && (
                      <p className="text-muted-foreground group-hover:text-background/80 line-clamp-2 mb-4">
                        {post.entry.description}
                      </p>
                    )}
                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-background">
                      Read More
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Topics */}
      <section className="py-20 bg-muted border-y-3 border-foreground">
        <div className="container">
          <h2 className="display-text mb-12">Explore Topics</h2>
          <div className="flex flex-wrap gap-4">
            {["Rehearsal", "Show Development", "Touring", "Funding", "Team Dynamics", "Audience", "Adaptation", "New Work", "Collaboration", "Research"].map((topic) => (
              <Link
                key={topic}
                href={`/explore?topic=${topic.toLowerCase()}`}
                className="px-6 py-3 bg-background border-3 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
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
              <p className="mt-6 text-xl opacity-90">
                Sign up to ask questions, contribute answers, and build your personal
                collection of dramaturgical resources.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 border-3 border-primary-foreground bg-background text-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-all text-center"
                >
                  Create Account
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center w-full sm:w-52 px-8 py-4 border-3 border-primary-foreground text-primary-foreground text-lg font-bold hover:bg-background hover:text-foreground transition-all text-center"
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
