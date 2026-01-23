import type {
  User,
  Question,
  Reply,
  Tag,
  Toolkit,
  Vote,
  Bookmark,
  Flag,
} from "@prisma/client";

// Extended types with relations
export type QuestionWithRelations = Question & {
  author: Pick<User, "id" | "name" | "username" | "image" | "role">;
  tags: { tag: Tag }[];
  _count?: {
    replies: number;
    votes: number;
    bookmarks: number;
  };
};

export type QuestionDetail = Question & {
  author: Pick<User, "id" | "name" | "username" | "image" | "role" | "bio" | "expertiseAreas">;
  tags: { tag: Tag }[];
  replies: ReplyWithAuthor[];
  _count: {
    replies: number;
    votes: number;
    bookmarks: number;
  };
};

export type ReplyWithAuthor = Reply & {
  author: Pick<User, "id" | "name" | "username" | "image" | "role">;
  _count?: {
    votes: number;
  };
};

export type ToolkitWithQuestions = Toolkit & {
  createdBy: Pick<User, "id" | "name" | "username" | "image">;
  questions: {
    position: number;
    note: string | null;
    question: QuestionWithRelations;
  }[];
};

export type TagWithCount = Tag & {
  _count: {
    questions: number;
  };
};

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Filter types
export interface QuestionFilters {
  search?: string;
  contextType?: string;
  tags?: string[];
  hasExpertResponse?: boolean;
  needsExpert?: boolean;
  sort?: "newest" | "most_helpful" | "trending";
}

// Re-export Prisma types
export type {
  User,
  Question,
  Reply,
  Tag,
  Toolkit,
  Vote,
  Bookmark,
  Flag,
  UserRole,
  TrustLevel,
  QuestionStatus,
  ReplyStatus,
  ContextType,
  VoteType,
  FlagStatus,
} from "@prisma/client";
