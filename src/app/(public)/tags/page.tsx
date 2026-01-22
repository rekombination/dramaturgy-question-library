import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="container py-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground mt-2">
          Browse questions by topic
        </p>

        {tags.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No tags available yet.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {Object.entries(groupedTags).map(([category, categoryTags]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map((tag) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <Badge
                          variant="secondary"
                          className="text-sm py-1.5 px-3 hover:bg-accent cursor-pointer"
                        >
                          {tag.name}
                          <span className="ml-2 text-muted-foreground">
                            {tag._count.questions}
                          </span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
