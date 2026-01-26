import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Toolkits",
  description: "Curated collections of dramaturgical questions for specific topics and contexts.",
  alternates: {
    canonical: "https://thedramaturgy.com/toolkits",
  },
};

async function getToolkits() {
  return prisma.toolkit.findMany({
    include: {
      createdBy: {
        select: { name: true, image: true },
      },
      _count: {
        select: { questions: true },
      },
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export default async function ToolkitsPage() {
  const toolkits = await getToolkits();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              Toolkits
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Curated collections of questions for specific topics and contexts.
              Dive deep into focused areas of dramaturgical practice.
            </p>
          </div>
        </div>
      </section>

      {/* Toolkits Grid */}
      <section className="py-12 md:py-20">
        <div className="container">
          {toolkits.length === 0 ? (
            <div className="text-center py-20 border-2 border-foreground">
              <div className="text-8xl font-black text-primary">+</div>
              <h3 className="mt-6 text-2xl font-bold">No toolkits yet</h3>
              <p className="text-muted-foreground mt-2 text-lg max-w-md mx-auto">
                Toolkits are curated by experts and moderators. Check back soon for themed collections!
              </p>
            </div>
          ) : (
            <div className="grid gap-0 md:grid-cols-2">
              {toolkits.map((toolkit, index) => (
                <Link
                  key={toolkit.id}
                  href={`/toolkits/${toolkit.slug}`}
                  className={`group border-2 border-foreground p-8 md:p-12 hover:bg-foreground hover:text-background transition-colors ${
                    index % 2 === 1 ? "md:border-l-0" : ""
                  } ${index >= 2 ? "border-t-0 md:border-t-2" : ""} ${
                    index >= 2 && index % 2 === 0 ? "md:border-t-0" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {toolkit.isFeatured && (
                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-4">
                          Featured
                        </span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold group-hover:text-background">
                        {toolkit.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground group-hover:text-background/70">
                        {toolkit.description}
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <span className="text-sm font-bold">
                          {toolkit._count.questions} questions
                        </span>
                        {toolkit.createdBy.name && (
                          <>
                            <span className="text-muted-foreground group-hover:text-background/50">
                              •
                            </span>
                            <span className="text-sm text-muted-foreground group-hover:text-background/70">
                              by {toolkit.createdBy.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-4xl font-black text-primary group-hover:text-background shrink-0">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t-2 border-foreground bg-muted py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="border-2 border-foreground bg-background p-8 md:p-10">
              <div className="text-4xl font-black text-primary mb-4">01</div>
              <h3 className="text-xl font-bold">Curated Content</h3>
              <p className="mt-2 text-muted-foreground">
                Each toolkit is carefully assembled by experts in the field.
              </p>
            </div>
            <div className="border-2 border-foreground border-t-0 md:border-t-2 md:border-l-0 bg-background p-8 md:p-10">
              <div className="text-4xl font-black text-primary mb-4">02</div>
              <h3 className="text-xl font-bold">Focused Topics</h3>
              <p className="mt-2 text-muted-foreground">
                Deep dives into specific areas of dramaturgical practice.
              </p>
            </div>
            <div className="border-2 border-foreground border-t-0 md:border-t-2 md:border-l-0 bg-background p-8 md:p-10">
              <div className="text-4xl font-black text-primary mb-4">03</div>
              <h3 className="text-xl font-bold">Practical Guides</h3>
              <p className="mt-2 text-muted-foreground">
                Ready-to-use question sets for your rehearsal process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
