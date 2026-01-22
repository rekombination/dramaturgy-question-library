import Link from "next/link";
import Image from "next/image";
import { reader } from "@/lib/keystatic";
import { BlogPostingListJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const siteUrl = "https://thedramaturgy.com";

export const metadata: Metadata = {
  title: "Blog | Articles on Dramaturgy & Theatre Practice",
  description:
    "Articles, insights, and resources about dramaturgy, theatre practice, new work development, rehearsal techniques, and collaborative creation.",
  keywords: [
    "dramaturgy blog",
    "theatre articles",
    "dramaturg resources",
    "theatre practice",
    "performing arts",
    "playwriting",
    "rehearsal techniques",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: "Blog | The Dramaturgy",
    description:
      "Articles, insights, and resources about dramaturgy and theatre practice.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "The Dramaturgy Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | The Dramaturgy",
    description:
      "Articles, insights, and resources about dramaturgy and theatre practice.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await reader.collections.posts.all();

  // Sort by date, newest first
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
    const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Prepare data for BlogPosting schema
  const blogPostsSchema = sortedPosts.map((post) => ({
    title: post.entry.title,
    description: post.entry.description || "",
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.entry.publishedAt || new Date().toISOString(),
    dateModified: post.entry.updatedAt || post.entry.publishedAt || new Date().toISOString(),
    author: post.entry.author || "The Dramaturgy Team",
    image: post.entry.coverImage
      ? post.entry.coverImage.startsWith("http")
        ? post.entry.coverImage
        : `${siteUrl}${post.entry.coverImage}`
      : undefined,
  }));

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD for blog listing */}
      <BlogPostingListJsonLd posts={blogPostsSchema} />
      {/* Hero Section */}
      <section className="border-b-3 border-foreground bg-foreground text-background py-16 md:py-24">
        <div className="container">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Blog
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-background/70 max-w-2xl">
            Articles, insights, and resources for dramaturgical practice.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-20">
        <div className="container">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20 border-3 border-foreground">
              <div className="text-8xl font-black text-primary">+</div>
              <h3 className="mt-6 text-2xl font-bold">No posts yet</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                Check back soon for articles and insights.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border-3 border-foreground hover:bg-muted transition-colors"
                >
                  {post.entry.coverImage && (
                    <div className="aspect-video relative overflow-hidden border-b-3 border-foreground">
                      <Image
                        src={post.entry.coverImage}
                        alt={post.entry.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.entry.publishedAt && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(post.entry.publishedAt).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {post.entry.title}
                    </h2>
                    {post.entry.description && (
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {post.entry.description}
                      </p>
                    )}
                    {post.entry.tags && post.entry.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-muted text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
