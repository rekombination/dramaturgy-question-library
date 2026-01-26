import { MetadataRoute } from 'next';
import { reader } from '@/lib/keystatic';
import { prisma } from '@/lib/db';

const siteUrl = 'https://thedramaturgy.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await reader.collections.posts.all();

  // Get all published questions
  const questions = await prisma.question.findMany({
    where: {
      status: 'PUBLISHED',
      isPrivate: false,
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/toolkits`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.entry.updatedAt
      ? new Date(post.entry.updatedAt)
      : post.entry.publishedAt
      ? new Date(post.entry.publishedAt)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Questions
  const questionPages: MetadataRoute.Sitemap = questions.map((question) => ({
    url: `${siteUrl}/questions/${question.id}`,
    lastModified: question.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPosts, ...questionPages];
}
