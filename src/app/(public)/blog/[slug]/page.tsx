import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { reader } from "@/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ResponsiveImage } from "@/components/blog/ResponsiveImage";
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

  // Get all posts for prev/next navigation
  const allPosts = await reader.collections.posts.all();
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
    const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const currentIndex = sortedPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

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
      {/* Breadcrumb Navigation */}
      <nav className="border-b-3 border-foreground bg-foreground text-background py-4">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-primary">/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="text-primary">/</span>
            <span className="truncate">{post.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Header with Cover Image */}
      <section className="py-12 md:py-16 border-b-3 border-foreground">
        <div className="container max-w-4xl">
          {/* Tags and Date */}
          <div className="flex items-center gap-3 mb-6">
            {post.tags && post.tags.length > 0 && (
              post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))
            )}
            {post.publishedAt && (
              <time className="text-sm text-muted-foreground uppercase tracking-wider">
                {new Date(post.publishedAt).toLocaleDateString("de-DE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}

          {/* Cover Image - integrated into header */}
          {post.coverImage && (
            <div className="mt-8 border-3 border-foreground overflow-hidden">
              <ResponsiveImage
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto"
                priority={true}
              />
            </div>
          )}

          {/* Author */}
          {post.author && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{post.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <article className="blog-content">
            <DocumentRenderer
              document={content}
              renderers={{
                block: {
                  paragraph: ({ children }) => (
                    <p className="text-lg leading-relaxed mb-2 text-foreground">{children}</p>
                  ),
                  heading: ({ level, children }) => {
                    const styles = {
                      1: "text-5xl md:text-6xl font-black tracking-tight leading-tight mt-16 mb-8",
                      2: "text-4xl md:text-5xl font-black tracking-tight leading-tight mt-12 mb-6",
                      3: "text-3xl md:text-4xl font-black tracking-tight leading-tight mt-10 mb-5",
                      4: "text-2xl md:text-3xl font-bold tracking-tight mt-8 mb-4",
                      5: "text-xl md:text-2xl font-bold mt-6 mb-3",
                      6: "text-lg md:text-xl font-bold mt-4 mb-2",
                    };
                    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
                    return <Tag className={styles[level as keyof typeof styles]}>{children}</Tag>;
                  },
                  list: ({ children, type }) => {
                    const Component = type === "ordered" ? "ol" : "ul";
                    const listClass = type === "ordered"
                      ? "my-8 space-y-3 text-lg pl-8 list-decimal list-outside marker:text-primary marker:font-bold"
                      : "my-8 space-y-3 text-lg pl-0";

                    // Wrap each child in <li> tags
                    const listItems = React.Children.map(children, (child, index) => (
                      <li key={index} className={type === "unordered" ? "relative pl-6 before:content-['→'] before:absolute before:left-0 before:text-primary before:font-black" : ""}>
                        {child}
                      </li>
                    ));

                    return (
                      <Component className={listClass}>
                        {listItems}
                      </Component>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 bg-muted/30 text-xl italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <pre className="bg-foreground text-background p-6 rounded-none border-3 border-foreground my-8 overflow-x-auto">
                      <code className="text-sm font-mono">{children}</code>
                    </pre>
                  ),
                },
                inline: {
                  link: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-primary font-bold no-underline hover:underline transition-all"
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  bold: ({ children }) => (
                    <strong className="font-black text-foreground">{children}</strong>
                  ),
                  italic: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-2 py-1 font-mono text-sm border border-border">
                      {children}
                    </code>
                  ),
                },
              }}
            />
          </article>
        </div>
      </section>

      {/* Previous/Next Navigation */}
      {(prevPost || nextPost) && (
        <section className="border-t-3 border-foreground py-8">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Post */}
              <div className={`${!prevPost ? 'md:col-start-2' : ''}`}>
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="block border-3 border-foreground p-6 hover:bg-foreground hover:text-background transition-all group"
                  >
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-background/70 mb-2">
                      ← Previous
                    </div>
                    <div className="font-black text-lg">
                      {prevPost.entry.title}
                    </div>
                  </Link>
                )}
              </div>

              {/* Next Post */}
              <div>
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="block border-3 border-foreground p-6 hover:bg-foreground hover:text-background transition-all group"
                  >
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-background/70 mb-2 text-right">
                      Next →
                    </div>
                    <div className="font-black text-lg text-right">
                      {nextPost.entry.title}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="border-t-3 border-foreground bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black">Have a question?</h2>
          <p className="mt-4 text-xl opacity-90">
            Join the community and start a conversation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="px-8 py-4 bg-white text-primary text-lg font-bold hover:bg-white/90 transition-colors text-center"
            >
              Ask a Question
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 border-3 border-primary-foreground text-lg font-bold hover:bg-white/10 transition-colors text-center"
            >
              Explore Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
