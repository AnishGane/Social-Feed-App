import type { User } from "./auth";

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

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreatePostInput = {
  title: string;
  content: string;
  thumbnailImage?: string;
  mainImage?: string;
  tags?: string[];
};

export interface PaginatedPosts {
  posts: Post[];
  nextCursor: string | null;
}
