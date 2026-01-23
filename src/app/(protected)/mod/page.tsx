"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconFlag, IconCheck, IconX } from "@tabler/icons-react";

interface Flag {
  id: string;
  reason: string;
  status: string;
  createdAt: Date;
  reporter: {
    name: string | null;
    email: string | null;
  };
  questionId: string | null;
  replyId: string | null;
  question?: {
    id: string;
    title: string;
  } | null;
  reply?: {
    id: string;
    body: string;
  } | null;
}

export default function ModeratorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "RESOLVED" | "DISMISSED" | "ALL">("PENDING");

  // Check if user is moderator/admin
  useEffect(() => {
    if (status === "loading") return;

    if (!session || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch flags
  useEffect(() => {
    fetchFlags();
  }, [filter]);

  const fetchFlags = async () => {
    try {
      const url = filter === "ALL"
        ? "/api/mod/flags"
        : `/api/mod/flags?status=${filter}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch flags");

      const data = await response.json();
      setFlags(data.flags);
    } catch (error) {
      toast.error("Failed to load flags");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: string, action: "RESOLVED" | "DISMISSED") => {
    try {
      const response = await fetch(`/api/mod/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) throw new Error("Failed to update flag");

      toast.success(`Flag ${action.toLowerCase()}`);
      fetchFlags();
    } catch (error) {
      toast.error("Failed to update flag");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/me"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="display-text flex items-center gap-3">
            <IconFlag size={36} />
            Moderation Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review and manage reported content
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-3 border-foreground p-2 bg-muted">
          {(["PENDING", "RESOLVED", "DISMISSED", "ALL"] as const).map((filterOption) => (
            <Button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              variant={filter === filterOption ? "default" : "outline"}
              className={`font-bold ${
                filter === filterOption
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-foreground"
              }`}
            >
              {filterOption}
            </Button>
          ))}
        </div>

        {/* Flags List */}
        {flags.length === 0 ? (
          <div className="border-3 border-foreground p-12 text-center">
            <IconFlag size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-bold">No flags to review</p>
            <p className="text-muted-foreground mt-2">
              {filter === "PENDING"
                ? "All caught up! There are no pending reports."
                : `No ${filter.toLowerCase()} flags found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="border-3 border-foreground bg-background"
              >
                {/* Header */}
                <div className="p-4 border-b-3 border-foreground bg-muted flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase ${
                      flag.status === "PENDING"
                        ? "bg-primary text-primary-foreground"
                        : flag.status === "RESOLVED"
                        ? "bg-foreground text-background"
                        : "bg-muted-foreground text-background"
                    }`}>
                      {flag.status}
                    </span>
                    <span className="ml-3 text-sm text-muted-foreground">
                      Reported by {flag.reporter.name || flag.reporter.email || "Anonymous"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(flag.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Reason for Report
                    </h3>
                    <p className="text-base">{flag.reason}</p>
                  </div>

                  {flag.question && (
                    <div className="border-l-4 border-primary pl-4 mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Reported Question
                      </h4>
                      <Link
                        href={`/questions/${flag.question.id}`}
                        className="text-lg font-bold hover:text-primary transition-colors"
                      >
                        {flag.question.title}
                      </Link>
                    </div>
                  )}

                  {flag.reply && (
                    <div className="border-l-4 border-foreground pl-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Reported Reply
                      </h4>
                      <p className="text-sm line-clamp-3">{flag.reply.body}</p>
                      {flag.questionId && (
                        <Link
                          href={`/questions/${flag.questionId}`}
                          className="text-sm font-bold text-primary hover:underline mt-2 inline-block"
                        >
                          View in context →
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {flag.status === "PENDING" && (
                  <div className="p-4 border-t-3 border-foreground bg-muted flex gap-3">
                    <Button
                      onClick={() => handleResolveFlag(flag.id, "RESOLVED")}
                      className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                    >
                      <IconCheck className="mr-2" size={18} />
                      Resolve (Content Actioned)
                    </Button>
                    <Button
                      onClick={() => handleResolveFlag(flag.id, "DISMISSED")}
                      variant="outline"
                      className="border-2 border-foreground font-bold"
                    >
                      <IconX className="mr-2" size={18} />
                      Dismiss (No Action Needed)
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
