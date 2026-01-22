import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Toolkits",
  description: "Curated collections of dramaturgical questions for specific topics and contexts.",
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
    <div className="container py-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold">Toolkits</h1>
        <p className="text-muted-foreground mt-2">
          Curated collections of questions for specific topics and contexts
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {toolkits.length === 0 ? (
            <p className="text-muted-foreground col-span-2 text-center py-12">
              No toolkits available yet. Check back soon!
            </p>
          ) : (
            toolkits.map((toolkit) => (
              <Link key={toolkit.id} href={`/toolkits/${toolkit.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{toolkit.title}</CardTitle>
                      {toolkit.isFeatured && (
                        <Badge>Featured</Badge>
                      )}
                    </div>
                    <CardDescription>{toolkit.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {toolkit._count.questions} questions
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
