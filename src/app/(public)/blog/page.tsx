import Link from "next/link";
import { reader } from "@/lib/keystatic";
import { BlogPostingListJsonLd } from "@/components/seo/JsonLd";
import { ResponsiveImage } from "@/components/blog/ResponsiveImage";
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

      {/* Breadcrumb Navigation */}
      <nav className="border-b-2 border-foreground bg-foreground text-background py-4">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-primary">/</span>
            <span>Blog</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b-2 border-foreground bg-background">
        <div className="container max-w-6xl">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-primary flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Insights &<br />
                <span className="text-primary">Resources</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                Practical articles and in-depth explorations of dramaturgical practice, collaborative creation, and theatrical craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20 border-2 border-foreground bg-background">
              <div className="text-8xl font-black text-primary">?</div>
              <h3 className="mt-6 text-2xl font-bold">No posts yet</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                Check back soon for articles and insights.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {sortedPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group block bg-background border-2 border-foreground transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                    index === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className={`grid ${index === 0 ? "md:grid-cols-2" : "grid-cols-1"} gap-0`}>
                    {post.entry.coverImage && (
                      <div className={`relative overflow-hidden ${index === 0 ? "aspect-[16/10]" : "aspect-video"} ${index === 0 ? "md:border-r-2" : "border-b-2"} border-foreground bg-muted`}>
                        <ResponsiveImage
                          src={post.entry.coverImage}
                          alt={post.entry.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={index === 0}
                        />
                      </div>
                    )}
                    <div className={`p-8 ${index === 0 ? "md:p-12" : ""} flex flex-col`}>
                      <div className="flex items-center gap-3 mb-4">
                        {post.entry.publishedAt && (
                          <time className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {new Date(post.entry.publishedAt).toLocaleDateString("de-DE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}
                        {post.entry.tags && post.entry.tags.length > 0 && (
                          <>
                            <span className="text-primary font-black">·</span>
                            <span className="text-sm text-primary font-bold uppercase tracking-wider">{post.entry.tags[0]}</span>
                          </>
                        )}
                      </div>
                      <h2 className={`font-black leading-tight mb-4 group-hover:text-primary transition-colors ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                        {post.entry.title}
                      </h2>
                      {post.entry.description && (
                        <p className={`text-muted-foreground leading-relaxed mb-6 flex-grow ${index === 0 ? "text-lg line-clamp-3" : "line-clamp-2"}`}>
                          {post.entry.description}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:gap-4 transition-all">
                        Read Article
                        <span className="text-primary">→</span>
                      </div>
                    </div>
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
