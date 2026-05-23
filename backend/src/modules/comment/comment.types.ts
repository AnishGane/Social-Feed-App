export type GetCommentsByPostParams = {
  postId: string;
  cursor?: string;
  limit?: number;
  currentUserId?: string;
};

export type CreateCommentPayload = {
  content: string;
  postId: string;
  parentComment?: string;
};

export type UpdateCommentPayload = {
  content: string;
};
