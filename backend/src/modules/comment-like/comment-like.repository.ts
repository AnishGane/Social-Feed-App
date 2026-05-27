import { ClientSession, Types } from "mongoose";
import commentLikeModel from "./comment-like.model";

export const getCommentLikeRepo = (
  userId: string | Types.ObjectId,
  commentId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return commentLikeModel.findOne(
    {
      user: userId,
      comment: commentId,
    },
    null,
    { session },
  );
};

export const createCommentLikeRepo = (
  user: string | Types.ObjectId,
  comment: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return commentLikeModel.create(
    [
      {
        user,
        comment,
      },
    ],
    { session },
  );
};

export const deleteCommentLikeRepo = (
  userId: string | Types.ObjectId,
  commentId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return commentLikeModel.findOneAndDelete(
    {
      user: userId,
      comment: commentId,
    },
    { session },
  );
};
