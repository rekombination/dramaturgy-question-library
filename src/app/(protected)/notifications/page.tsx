"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "NEW_QUESTION" | "NEW_REPLY";
  read: boolean;
  createdAt: string;
  question?: {
    id: string;
    title: string;
  } | null;
  reply?: {
    id: string;
    body: string;
  } | null;
  actor?: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  } | null;
}

type FilterType = "all" | "unread" | "read";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const url = filter === "unread"
        ? "/api/notifications?unreadOnly=true&limit=100"
        : "/api/notifications?limit=100";
      const res = await fetch(url);
      const data = await res.json();

      let filtered = data.notifications || [];
      if (filter === "read") {
        filtered = filtered.filter((n: Notification) => n.read);
      }

      setNotifications(filtered);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      await fetchNotifications();
      router.refresh();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationIds: [notification.id] }),
        });
        router.refresh();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    if (notification.question) {
      router.push(`/questions/${notification.question.id}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actor?.name || "Someone";

    if (notification.type === "NEW_QUESTION") {
      return {
        title: "New Question",
        message: `${actorName} asked: ${notification.question?.title || "a question"}`,
      };
    }

    if (notification.type === "NEW_REPLY") {
      const replyPreview = notification.reply?.body.slice(0, 100) || "";
      return {
        title: "New Reply",
        message: `${actorName} replied: ${replyPreview}${replyPreview.length >= 100 ? "..." : ""}`,
      };
    }

    return { title: "Notification", message: "New notification" };
  };

  const groupNotifications = () => {
    const groups: {
      today: Notification[];
      yesterday: Notification[];
      thisWeek: Notification[];
      older: Notification[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      if (isToday(date)) {
        groups.today.push(notification);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notification);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  const groups = groupNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Notifications
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-2 border-foreground p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  filter === "all"
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  filter === "unread"
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  filter === "read"
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                Read
              </button>
            </div>

            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="border-2 border-foreground p-12 text-center">
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="border-2 border-foreground p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold mb-2">No notifications</h2>
            <p className="text-muted-foreground mb-6">
              {filter === "unread"
                ? "You're all caught up!"
                : "You don't have any notifications yet."}
            </p>
            <Link
              href="/explore"
              className="inline-block px-6 py-3 bg-foreground text-background font-bold hover:bg-primary transition-colors"
            >
              Explore Questions
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.today.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4 text-muted-foreground">
                  Today
                </h2>
                <div className="space-y-0 border-2 border-foreground">
                  {groups.today.map((notification, index) => {
                    const { title, message } = getNotificationText(notification);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-6 cursor-pointer hover:bg-muted transition-colors ${
                          index !== groups.today.length - 1 ? "border-b-2 border-foreground" : ""
                        } ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-foreground shrink-0">
                            <AvatarImage
                              src={notification.actor?.image || ""}
                              alt={notification.actor?.name || ""}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {notification.actor?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                                {title}
                              </span>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className={`mb-2 ${!notification.read ? "font-semibold" : ""}`}>
                              {message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {groups.yesterday.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4 text-muted-foreground">
                  Yesterday
                </h2>
                <div className="space-y-0 border-2 border-foreground">
                  {groups.yesterday.map((notification, index) => {
                    const { title, message } = getNotificationText(notification);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-6 cursor-pointer hover:bg-muted transition-colors ${
                          index !== groups.yesterday.length - 1 ? "border-b-2 border-foreground" : ""
                        } ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-foreground shrink-0">
                            <AvatarImage
                              src={notification.actor?.image || ""}
                              alt={notification.actor?.name || ""}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {notification.actor?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                                {title}
                              </span>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className={`mb-2 ${!notification.read ? "font-semibold" : ""}`}>
                              {message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {groups.thisWeek.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4 text-muted-foreground">
                  This Week
                </h2>
                <div className="space-y-0 border-2 border-foreground">
                  {groups.thisWeek.map((notification, index) => {
                    const { title, message } = getNotificationText(notification);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-6 cursor-pointer hover:bg-muted transition-colors ${
                          index !== groups.thisWeek.length - 1 ? "border-b-2 border-foreground" : ""
                        } ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-foreground shrink-0">
                            <AvatarImage
                              src={notification.actor?.image || ""}
                              alt={notification.actor?.name || ""}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {notification.actor?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                                {title}
                              </span>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className={`mb-2 ${!notification.read ? "font-semibold" : ""}`}>
                              {message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {groups.older.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4 text-muted-foreground">
                  Older
                </h2>
                <div className="space-y-0 border-2 border-foreground">
                  {groups.older.map((notification, index) => {
                    const { title, message } = getNotificationText(notification);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-6 cursor-pointer hover:bg-muted transition-colors ${
                          index !== groups.older.length - 1 ? "border-b-2 border-foreground" : ""
                        } ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-foreground shrink-0">
                            <AvatarImage
                              src={notification.actor?.image || ""}
                              alt={notification.actor?.name || ""}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {notification.actor?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                                {title}
                              </span>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className={`mb-2 ${!notification.read ? "font-semibold" : ""}`}>
                              {message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
