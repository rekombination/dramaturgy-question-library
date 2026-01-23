import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { QuestionWithRelations, Tag } from "@/types";

interface QuestionCardProps {
  question: QuestionWithRelations;
}

const contextTypeLabels: Record<string, string> = {
  REHEARSAL: "Rehearsal",
  SHOW: "Show",
  TOURING: "Touring",
  FUNDING: "Funding",
  TEAM: "Team",
  AUDIENCE: "Audience",
  OTHER: "Other",
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="border-2 border-foreground border-t-0 first:border-t-2 p-6 md:p-8 hover:bg-muted transition-colors group">
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
        {/* Stats Column */}
        <div className="hidden md:flex flex-col items-center gap-2 text-center min-w-[80px]">
          <div className="text-2xl font-black text-primary">
            {question._count?.votes || 0}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            votes
          </div>
          <div className="w-full h-px bg-foreground/20 my-2" />
          <div className="text-lg font-bold">
            {question._count?.replies || 0}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            replies
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/questions/${question.id}`}
              className="text-xl md:text-2xl font-bold hover:text-primary transition-colors line-clamp-2"
            >
              {question.title}
            </Link>
            <span className="shrink-0 px-3 py-1 bg-foreground text-background text-xs font-bold uppercase tracking-wider">
              {contextTypeLabels[question.contextType] || question.contextType}
            </span>
          </div>

          <p className="mt-3 text-muted-foreground line-clamp-2">
            {question.body}
          </p>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map(({ tag }: { tag: Tag }) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="px-2 py-1 border-2 border-foreground text-xs font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-foreground">
                <AvatarImage
                  src={question.author.image || ""}
                  alt={question.author.name || ""}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                  {question.author.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                {question.author.username ? (
                  <Link
                    href={`/profile/${question.author.username}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {question.author.username}
                  </Link>
                ) : (
                  <span className="font-medium">{question.author.name || "Anonymous"}</span>
                )}
                {question.author.role === "EXPERT" && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold uppercase">
                    Expert
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              {/* Mobile stats */}
              <div className="flex md:hidden items-center gap-3">
                <span className="font-bold text-primary">{question._count?.votes || 0}</span>
                <span>votes</span>
                <span>•</span>
                <span className="font-bold">{question._count?.replies || 0}</span>
                <span>replies</span>
              </div>
              <span className="hidden md:inline">
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
