"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface NotificationDropdownProps {
  initialCount: number;
}

export function NotificationDropdown({ initialCount }: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=5");
      const data = await res.json();
      setNotifications(data.notifications || []);
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
      setCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationIds: [notification.id] }),
        });
        setCount((prev) => Math.max(0, prev - 1));
        router.refresh();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate to question
    if (notification.question) {
      router.push(`/questions/${notification.question.id}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actor?.name || "Someone";

    if (notification.type === "NEW_QUESTION") {
      return `${actorName} asked: ${notification.question?.title || "a question"}`;
    }

    if (notification.type === "NEW_REPLY") {
      const replyPreview = notification.reply?.body.slice(0, 60) || "";
      return `${actorName} replied: ${replyPreview}${replyPreview.length >= 60 ? "..." : ""}`;
    }

    return "New notification";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full border-2 border-background">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 border-2 border-foreground">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-bold text-lg">Notifications</h3>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-3 cursor-pointer focus:bg-muted"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3 w-full">
                  <Avatar className="h-10 w-10 border-2 border-foreground shrink-0">
                    <AvatarImage
                      src={notification.actor?.image || ""}
                      alt={notification.actor?.name || ""}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {notification.actor?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-bold" : ""}`}>
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/notifications"
                className="w-full text-center font-bold text-primary p-3"
              >
                View All Notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
