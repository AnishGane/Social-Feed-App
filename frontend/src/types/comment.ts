import type { ApiResponse, User } from ".";

export type Comment = {
  _id: string;
  content: string;
  post: string;
  parentComment: string | null;

  createdAt: string;
  updatedAt: string;

  isEdited: boolean;
  isOwner: boolean;
  repliesCount: number;

  author: Pick<User, "_id" | "name" | "username">;

  isLiked: boolean;
  likesCount: number;
};

type CommentResponseData = {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type GetCommentResponse = ApiResponse<CommentResponseData>;
