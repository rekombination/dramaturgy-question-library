import Link from "next/link";

export const metadata = {
  title: "About",
  description: "About The Dramaturgy - a community platform for dramaturgical questions and knowledge sharing.",
  alternates: {
    canonical: "https://thedramaturgy.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground bg-foreground text-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              About
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/70">
              The questions that shape theatre.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl">
          <div className="prose prose-lg dark:prose-invert">
            <h2 className="text-3xl font-black mb-6">What is The Dramaturgy?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Dramaturgy is a community platform dedicated to dramaturgical practice.
              We believe that the best work in theatre comes from asking the right questions,
              and that those questions deserve a dedicated space for exploration.
            </p>

            <h2 className="text-3xl font-black mb-6 mt-12">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We aim to create a living archive of dramaturgical knowledge—a place where
              practitioners can share challenges, exchange insights, and build upon each
              other&apos;s experiences. Whether you&apos;re working on a new devised piece,
              adapting a classic, or navigating production challenges, you&apos;ll find
              a community ready to engage.
            </p>

            <h2 className="text-3xl font-black mb-6 mt-12">How It Works</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                <strong className="text-foreground">Ask Questions:</strong> Share your dramaturgical
                challenges with context about your situation.
              </p>
              <p>
                <strong className="text-foreground">Get Perspectives:</strong> Receive insights from
                fellow practitioners and verified experts.
              </p>
              <p>
                <strong className="text-foreground">Build Knowledge:</strong> Browse curated toolkits
                and contribute to growing our collective understanding.
              </p>
            </div>

            <h2 className="text-3xl font-black mb-6 mt-12">Join Us</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Dramaturgy is free to use and open to all theatre practitioners.
              Create an account to ask questions, share your expertise, and become
              part of our growing community.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
            >
              Explore Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
