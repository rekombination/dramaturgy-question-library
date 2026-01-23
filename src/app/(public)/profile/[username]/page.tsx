import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBrandInstagram, IconBrandLinkedin, IconBrandTiktok, IconBrandYoutube, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import { QuestionCard } from "@/components/question/QuestionCard";
import type { QuestionWithRelations } from "@/types";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: { name: true, bio: true },
  });

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name || username} | Profile`,
    description: user.bio || `View ${user.name || username}'s profile on The Dramaturgy`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      expertiseAreas: true,
      instagramUrl: true,
      tiktokUrl: true,
      youtubeUrl: true,
      vimeoUrl: true,
      linkedinUrl: true,
      websiteUrl: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          replies: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Fetch user's public questions
  const questions = await prisma.question.findMany({
    where: {
      authorId: user.id,
      status: "PUBLISHED",
      isPrivate: false,
    },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true, role: true },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { replies: true, votes: true, bookmarks: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const socialLinks = [
    { url: user.instagramUrl, icon: IconBrandInstagram, label: "Instagram" },
    { url: user.tiktokUrl, icon: IconBrandTiktok, label: "TikTok" },
    { url: user.youtubeUrl, icon: IconBrandYoutube, label: "YouTube" },
    { url: user.linkedinUrl, icon: IconBrandLinkedin, label: "LinkedIn" },
    { url: user.websiteUrl, icon: IconWorld, label: "Website" },
  ].filter((link) => link.url);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <section className="border-b-2 border-foreground bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-2 border-foreground shrink-0">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-4xl">
                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  {user.name || user.username}
                </h1>
                {user.role !== "USER" && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase">
                    {user.role}
                  </span>
                )}
              </div>

              <p className="text-xl text-muted-foreground mt-2">@{user.username}</p>

              {user.bio && (
                <p className="mt-4 text-lg whitespace-pre-wrap max-w-2xl">
                  {user.bio}
                </p>
              )}

              {user.expertiseAreas.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.expertiseAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 border-2 border-foreground text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex gap-8 text-center md:text-left">
            <div>
              <div className="text-3xl font-black text-primary">{user._count.questions}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-black text-primary">{user._count.replies}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Answers</div>
            </div>
            <div>
              <div className="text-3xl font-black">
                {new Date(user.createdAt).getFullYear()}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Member Since</div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-3xl font-black mb-8">Recent Questions</h2>
          {questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-foreground">
              <p className="text-lg text-muted-foreground">No public questions yet.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question as QuestionWithRelations} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
