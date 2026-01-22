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
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.description;
  const ogImage = post.ogImage || post.coverImage;
  const keywords = post.keywords || [];
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
      card: (post.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || url,
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
      <section className="border-b-3 border-foreground py-16 md:py-20 bg-muted">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 border-3 border-foreground text-sm font-bold hover:bg-foreground hover:text-background transition-colors mb-8"
          >
            ← Back to Blog
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="hero-text mt-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-8 text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-3xl">
              {post.description}
            </p>
          )}

          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
            {post.author && (
              <span className="font-bold uppercase tracking-wider">{post.author}</span>
            )}
            {post.publishedAt && (
              <>
                <span>·</span>
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="border-b-3 border-foreground bg-background">
          <div className="container max-w-5xl py-12">
            <div className="aspect-video relative overflow-hidden border-3 border-foreground bg-muted">
              <img
                src={post.coverImage.replace('.jpg', '.svg')}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <article className="prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ul:space-y-2 prose-li:text-lg prose-strong:font-bold prose-strong:text-foreground max-w-none">
            <DocumentRenderer document={content} />
          </article>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t-3 border-foreground bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black">Have a question?</h2>
          <p className="mt-4 text-xl opacity-90">
            Join the community and start a conversation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/submit"
              className="px-8 py-4 bg-white text-primary text-lg font-bold hover:bg-white/90 transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 border-3 border-primary-foreground text-lg font-bold hover:bg-white/10 transition-colors"
            >
              Explore Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
