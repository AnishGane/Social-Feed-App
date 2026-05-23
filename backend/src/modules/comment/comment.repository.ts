import { PipelineStage, Types } from "mongoose";
import commentModel from "./comment.model";
import { GetCommentsByPostParams } from "./comment.types";
import { validateObjectId } from "../../utils/validate-object-id";
import { buildGetCommentsByPostPipeline } from "./comment.aggregation";

export const createCommentRepo = async (payload: {
  content: string;
  post: Types.ObjectId;
  author: Types.ObjectId;
  parentComment?: Types.ObjectId | null;
}) => {
  return commentModel.create(payload);
};

export const updateCommentRepo = async (
  commentId: string | Types.ObjectId,
  payload: {
    content: string;
    isEdited: boolean;
  },
) => {
  return commentModel.findByIdAndUpdate(commentId, payload, { new: true });
};

export const deleteCommentRepo = async (commentId: string | Types.ObjectId) => {
  return commentModel.findByIdAndDelete(commentId);
};

export const getCommentByIdRepo = async (
  commentId: string | Types.ObjectId,
) => {
  return commentModel.findById(commentId);
};

export const getCommentsByPostRepo = async ({
  postId,
  cursor,
  limit = 10,
  currentUserId,
}: GetCommentsByPostParams) => {
  const matchStage: any = {
    post: validateObjectId(postId, "Post"),
    parentComment: null,
  };

  if (cursor) {
    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const pipeline: PipelineStage[] = [
    {
      $match: matchStage,
    },

    {
      $sort: {
        _id: -1,
      },
    },

    { $limit: limit + 1 },

    ...buildGetCommentsByPostPipeline({ currentUserId }),
  ];

  return commentModel.aggregate(pipeline);
};
