export type VoteType = "up" | "down";

export interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };

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

export type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;

  createdAt: string;
  updatedAt: string;
};
