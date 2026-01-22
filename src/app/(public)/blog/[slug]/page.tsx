import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { reader } from "@/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await reader.collections.posts.all();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  const content = await post.content();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-3 border-foreground py-12 md:py-16">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            ← Back to Blog
          </Link>

          {post.publishedAt && (
            <p className="text-sm text-muted-foreground mb-4">
              {new Date(post.publishedAt).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {post.author && ` · ${post.author}`}
            </p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-6 text-xl text-muted-foreground">
              {post.description}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 border-2 border-foreground text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="border-b-3 border-foreground">
          <div className="container max-w-4xl py-8">
            <div className="aspect-video relative overflow-hidden border-3 border-foreground">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:border-3 prose-img:border-foreground">
            <DocumentRenderer document={content} />
          </article>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t-3 border-foreground bg-muted py-12">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl font-bold">Have a question?</h2>
          <p className="mt-2 text-muted-foreground">
            Join the community and start a conversation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 border-3 border-foreground font-bold hover:bg-foreground hover:text-background transition-colors"
            >
              Explore Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
