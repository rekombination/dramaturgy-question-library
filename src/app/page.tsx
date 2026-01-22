import Link from "next/link";

export default function HomePage() {
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
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  Explore Questions
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center px-8 py-4 border-3 border-foreground text-lg font-bold hover:bg-foreground hover:text-background transition-colors"
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
                    &ldquo;Dramaturgy is asking the questions that need to be asked.&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-background/30" />
                    <span className="text-sm uppercase tracking-wider">Community Wisdom</span>
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
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary text-lg font-bold hover:bg-white/90 transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-8 py-4 border-3 border-primary-foreground text-primary-foreground text-lg font-bold hover:bg-white/10 transition-colors"
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
