import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  "admin",
  "moderator",
  "mod",
  "administrator",
  "root",
  "system",
  "api",
  "profile",
  "user",
  "users",
  "account",
  "settings",
  "help",
  "support",
  "about",
  "contact",
  "terms",
  "privacy",
  "guidelines",
  "explore",
  "submit",
  "questions",
  "question",
  "replies",
  "reply",
  "tags",
  "tag",
  "toolkit",
  "toolkits",
  "blog",
  "home",
  "signin",
  "signup",
  "signout",
  "login",
  "logout",
  "register",
];

// Username validation regex
// Allows: letters (a-z), numbers (0-9), hyphen, underscore, period
// Must start and end with alphanumeric
// No consecutive special characters
const USERNAME_REGEX = /^[a-z0-9]([a-z0-9._-](?![._-])){1,28}[a-z0-9]$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, currentUserId } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { valid: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim().toLowerCase();

    // Check length
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return NextResponse.json(
        { valid: false, message: "Username must be between 3 and 30 characters" },
        { status: 400 }
      );
    }

    // Check format
    if (!USERNAME_REGEX.test(trimmedUsername)) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "Username can only contain letters, numbers, hyphens, underscores, and periods. Must start and end with a letter or number.",
        },
        { status: 400 }
      );
    }

    // Check for reserved usernames
    if (RESERVED_USERNAMES.includes(trimmedUsername)) {
      return NextResponse.json(
        { valid: false, message: "This username is reserved and cannot be used" },
        { status: 400 }
      );
    }

    // Check availability in database (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: trimmedUsername,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    // If username exists and it's not the current user's username
    if (existingUser && existingUser.id !== currentUserId) {
      return NextResponse.json(
        { valid: false, message: "This username is already taken" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Username validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to validate username" },
      { status: 500 }
    );
  }
}
