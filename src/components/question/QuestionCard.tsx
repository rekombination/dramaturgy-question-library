import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/questions/${question.id}`}
            className="text-lg font-semibold hover:underline line-clamp-2"
          >
            {question.title}
          </Link>
          <Badge variant="secondary" className="shrink-0">
            {contextTypeLabels[question.contextType] || question.contextType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{question.body}</p>
        {question.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {question.tags.map(({ tag }: { tag: Tag }) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`}>
                <Badge variant="outline" className="text-xs hover:bg-accent">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={question.author.image || ""}
                alt={question.author.name || ""}
              />
              <AvatarFallback className="text-xs">
                {question.author.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span>{question.author.name || "Anonymous"}</span>
            {question.author.role === "EXPERT" && (
              <Badge variant="default" className="text-xs">
                Expert
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{question._count?.replies || 0} replies</span>
            <span>{question._count?.votes || 0} votes</span>
            <span>
              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
