import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Dramaturgy Question Library
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A community platform for dramaturgical questions, insights, and knowledge
            sharing in theatre and performing arts.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/explore">Explore Questions</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/submit">Ask a Question</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>1. Ask Questions</CardTitle>
                <CardDescription>
                  Share your dramaturgical challenges and questions with the community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Whether it&apos;s about rehearsal processes, show development, touring
                  logistics, or team dynamics - every question is valuable.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Get Perspectives</CardTitle>
                <CardDescription>
                  Receive insights from fellow practitioners and industry experts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our community includes experienced dramaturgs, directors, and theatre
                  makers who share their knowledge and perspectives.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. Build Knowledge</CardTitle>
                <CardDescription>
                  Explore curated toolkits and browse questions by topic.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover patterns, solutions, and approaches that others have found
                  helpful. Vote on the most insightful contributions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured / CTA */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Join the Community</h2>
          <p className="mt-4 text-muted-foreground">
            Sign up to ask questions, contribute answers, and build your personal
            collection of dramaturgical resources.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
