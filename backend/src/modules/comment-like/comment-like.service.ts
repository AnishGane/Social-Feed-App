import { ApiError } from "../../utils/api-error";
import { validateObjectId } from "../../utils/validate-object-id";
import commentModel from "../comment/comment.model";
import httpStatus from "http-status";
import {
  createCommentLikeRepo,
  deleteCommentLikeRepo,
  getCommentLikeRepo,
} from "./comment-like.repository";
import mongoose from "mongoose";
import commentLikeModel from "./comment-like.model";

export const toggleCommentLikeService = async (
  userId: string,
  commentId: string,
) => {
  const commentObjectId = validateObjectId(commentId, "Comment");

  const comment = await commentModel.findById(commentObjectId);

  if (!comment) {
    throw new ApiError("Comment not found", httpStatus.NOT_FOUND);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLike = await getCommentLikeRepo(
      userId,
      commentObjectId,
      session,
    );

    if (existingLike) {
      await deleteCommentLikeRepo(userId, commentObjectId, session);

      await commentModel.findByIdAndUpdate(
        commentObjectId,
        { $inc: { likesCount: -1 } },
        { session },
      );

      await session.commitTransaction();

      return { liked: false };
    }

    await createCommentLikeRepo(userId, commentObjectId, session);

    await commentModel.findByIdAndUpdate(
      commentObjectId,
      { $inc: { likesCount: 1 } },
      { session },
    );

    await session.commitTransaction();

    return { liked: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
