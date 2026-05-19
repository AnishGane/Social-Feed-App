import type { User } from "./user";

export type VoteType = "up" | "down";

export interface Post {
  _id: string;

  author: User;

  title: string;
  content: string;

  thumbnailImage?: string;
  mainImage?: string;

  tags?: string[];

  upvotesCount: number;
  downvotesCount: number;
  commentCount: number;
  score: number;

  currentUserVote?: VoteType | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  nextCursor: string | null;
}
