import type { User } from "./user";

export type VoteType = "up" | "down";

export type FeedType = "all" | "user" | "voted" | "bookmarked";

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

  currentUserVote: VoteType | null;

  isPublished: boolean;

  bookmarksCount: number;
  isBookmarked?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  nextCursor: string | null;
  totalCount?: number;
}

export type ProfileTabSectionProps = {
  userId: string;
  counts: {
    voted: number;
    bookmarked: number;
  };
};

export type RelatedPosts = {
  _id: string;
  title: string;
  content: string;
  mainImage?: string;
  createdAt: string;
};
