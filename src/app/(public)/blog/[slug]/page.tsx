import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { reader } from "@/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://thedramaturgy.com";

export async function generateStaticParams() {
  const posts = await reader.collections.posts.all();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `${siteUrl}/blog/${slug}`;
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.description;
  const ogImage = post.seo?.ogImage || post.coverImage;
  const keywords = post.seo?.keywords || [];
  const allKeywords = [...new Set([...post.tags, ...keywords])];
  const mutableTags = [...post.tags];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: post.author || "The Dramaturgy Team" }],
    openGraph: {
      type: "article",
      url,
      title,
      description: description || undefined,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      authors: [post.author || "The Dramaturgy Team"],
      tags: mutableTags,
      images: ogImage
        ? [
            {
              url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: (post.seo?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`] : undefined,
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  const content = await post.content();
  const url = `${siteUrl}/blog/${slug}`;
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : undefined;

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <ArticleJsonLd
        title={post.title}
        description={post.description || ""}
        url={url}
        datePublished={post.publishedAt ? new Date(post.publishedAt) : new Date()}
        dateModified={post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : new Date()}
        authorName={post.author || "The Dramaturgy Team"}
        images={imageUrl ? [imageUrl] : []}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
          { name: post.title, url },
        ]}
      />
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
