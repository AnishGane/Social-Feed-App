import mongoose from "mongoose";
import { ApiError } from "../../utils/api-error";
import { validateObjectId } from "../../utils/validate-object-id";
import postModel from "../post/post.model";
import { checkLimit } from "../post/post.utils";
import {
  createCommentRepo,
  deleteCommentRepo,
  getCommentByIdRepo,
  getCommentsByPostRepo,
  getRepliesByCommentRepo,
  updateCommentRepo,
} from "./comment.repository";
import { CreateCommentPayload, UpdateCommentPayload } from "./comment.types";
import httpStatus from "http-status";
import commentModel from "./comment.model";

export const createCommentService = async (
  userId: string,
  payload: CreateCommentPayload,
) => {
  const post = await postModel.findById(payload.postId);

  if (!post) {
    throw new ApiError("Post not found", httpStatus.NOT_FOUND);
  }

  if (payload.parentComment) {
    const parentCommentId = validateObjectId(payload.parentComment, "Comment");
    const parentComment = await getCommentByIdRepo(parentCommentId);

    if (!parentComment) {
      throw new ApiError("Parent comment not found", httpStatus.NOT_FOUND);
    }

    if (parentComment.post.toString() !== payload.postId) {
      throw new ApiError(
        "Parent comment does not belong to this post",
        httpStatus.BAD_REQUEST,
      );
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await createCommentRepo(
      {
        content: payload.content,
        post: validateObjectId(payload.postId, "Post"),
        author: validateObjectId(userId, "User"),
        parentComment: payload.parentComment
          ? validateObjectId(payload.parentComment, "Comment")
          : null,
      },
      session,
    );

    await postModel.findByIdAndUpdate(
      payload.postId,
      { $inc: { commentCount: 1 } },
      { session },
    );

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCommentsByPostService = async (
  postId: string,
  cursor?: string,
  limit = 10,
  currentUserId?: string,
) => {
  if (cursor) {
    validateObjectId(cursor, "Cursor");
  }

  checkLimit(limit);

  const comments = await getCommentsByPostRepo({
    postId,
    cursor,
    limit,
    currentUserId,
  });

  let nextCursor: string | null = null;

  if (comments.length > limit) {
    const nextItem = comments.pop();

    nextCursor = nextItem?._id?.toString() || null;
  }

  return {
    comments,
    nextCursor,
    hasMore: !!nextCursor,
  };
};

export const updateCommentService = async (
  userId: string,
  commentId: string,
  payload: UpdateCommentPayload,
) => {
  const comment = await getCommentByIdRepo(commentId);

  if (!comment) {
    throw new ApiError("Comment not found", httpStatus.NOT_FOUND);
  }

  if (comment.author.toString() !== userId) {
    throw new ApiError(
      "You are not authorized to update this comment",
      httpStatus.FORBIDDEN,
    );
  }

  const updatedComment = await updateCommentRepo(commentId, {
    content: payload.content,
    isEdited: true,
  });

  return updatedComment;
};

export const deleteCommentService = async (
  userId: string,
  commentId: string,
) => {
  const commentObjectId = validateObjectId(commentId, "Comment");
  const comment = await getCommentByIdRepo(commentObjectId);

  if (!comment) {
    throw new ApiError("Comment not found", httpStatus.NOT_FOUND);
  }

  if (comment.author.toString() !== userId) {
    throw new ApiError(
      "You are not authorized to delete this comment",
      httpStatus.FORBIDDEN,
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete replies first
    const deleteRepliesResult = await commentModel.deleteMany(
      { parentComment: commentObjectId },
      { session },
    );

    const deletedReplies = deleteRepliesResult.deletedCount ?? 0;

    // delete parent
    const deletedComment = await deleteCommentRepo(commentObjectId, session);

    if (!deletedComment) {
      throw new ApiError("Comment not found", httpStatus.NOT_FOUND);
    }

    await postModel.findByIdAndUpdate(
      comment.post,
      { $inc: { commentCount: -(1 + deletedReplies) } },
      { session },
    );

    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getRepliesByCommentService = async (
  parentCommentId: string,
  cursor?: string,
  limit = 10,
  currentUserId?: string,
) => {
  if (cursor) {
    validateObjectId(cursor, "Cursor");
  }

  checkLimit(limit);

  const replies = await getRepliesByCommentRepo({
    parentCommentId,
    cursor,
    limit,
    currentUserId,
  });

  let nextCursor: string | null = null;

  if (replies.length > limit) {
    const nextItem = replies.pop();

    nextCursor = nextItem?._id?.toString() || null;
  }

  return {
    comments: replies,
    nextCursor,
    hasMore: !!nextCursor,
  };
};
