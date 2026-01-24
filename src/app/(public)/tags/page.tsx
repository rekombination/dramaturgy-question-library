import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Tags",
  description: "Browse questions by topic tags.",
};

async function getTags() {
  return prisma.tag.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { name: "asc" },
  });
}

export default async function TagsPage() {
  const tags = await getTags();

  // Group tags by category
  const groupedTags = tags.reduce((acc, tag) => {
    const category = tag.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground bg-foreground text-background py-16 md:py-24">
        <div className="container">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Tags
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-background/70 max-w-2xl">
            Browse questions by topic. Find the conversations that matter to your practice.
          </p>
        </div>
      </section>

      {/* Tags Grid */}
      <section className="py-12 md:py-20">
        <div className="container">
          {tags.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl font-black text-primary">?</div>
              <p className="mt-4 text-xl text-muted-foreground">
                No tags available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedTags).map(([category, categoryTags]) => (
                <div key={category}>
                  <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-4">
                    <span>{category}</span>
                    <div className="h-1 flex-1 bg-foreground max-w-32" />
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {categoryTags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="group"
                      >
                        <div className="px-5 py-3 border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors flex items-center gap-3">
                          <span>{tag.name}</span>
                          <span className="text-sm font-normal text-muted-foreground group-hover:text-background">
                            {tag._count.questions}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-2 border-foreground bg-muted py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">
                Can&apos;t find your topic?
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Ask a question and help us grow the community knowledge base.
              </p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
