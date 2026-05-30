import { ClientSession, Types } from "mongoose";
import followModel from "./follow.model";
import {
  buildFollowersPipeline,
  buildFollowingPipeline,
} from "./follow.aggregation";
import { isValidObjectId } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";
import httpStatus from "http-status";
import { ApiError } from "../../utils/api-error";

export const getFollowRepo = (
  followerId: string | Types.ObjectId,
  followingId: string | Types.ObjectId,
) => {
  return followModel.findOne({
    follower: followerId,
    following: followingId,
  });
};

export const createFollowRepo = (
  followerId: string | Types.ObjectId,
  followingId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return followModel.create(
    [
      {
        follower: followerId,
        following: followingId,
      },
    ],
    { session },
  );
};

export const deleteFollowRepo = (
  followerId: string | Types.ObjectId,
  followingId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return followModel.findOneAndDelete(
    {
      follower: followerId,
      following: followingId,
    },
    {
      session,
    },
  );
};

export const isFollowingRepo = async (
  followerId: string | Types.ObjectId,
  followingId: string | Types.ObjectId,
) => {
  const follow = await followModel.exists({
    follower: followerId,
    following: followingId,
  });

  return !!follow;
};

export const getFollowersRepo = async (
  targetUserId: Types.ObjectId,
  currentUserId?: Types.ObjectId,
  cursor?: string,
  limit = 20,
) => {
  const matchStage: any = {
    following: targetUserId,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new ApiError("Invalid cursor format", httpStatus.BAD_REQUEST);
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const follows = await followModel.aggregate([
    { $match: matchStage },

    { $sort: { _id: -1 } },

    { $limit: limit + 1 },

    ...buildFollowersPipeline(currentUserId),
  ]);

  const hasMore = follows.length > limit;
  if (hasMore) follows.pop();
  const nextCursor = hasMore
    ? follows[follows.length - 1]._id.toString()
    : null;

  return {
    follows,
    nextCursor,
  };
};

export const getFollowingRepo = async (
  targetUserId: Types.ObjectId,
  currentUserId?: Types.ObjectId,
  cursor?: string,
  limit = 20,
) => {
  const matchStage: any = {
    follower: targetUserId,
  };

  if (cursor) {
    if (!isValidObjectId(cursor)) {
      throw new ApiError("Invalid cursor format", httpStatus.BAD_REQUEST);
    }

    matchStage._id = {
      $lt: validateObjectId(cursor, "Cursor"),
    };
  }

  const follows = await followModel.aggregate([
    { $match: matchStage },
    { $sort: { _id: -1 } },
    { $limit: limit + 1 },

    ...buildFollowingPipeline(currentUserId),
  ]);

  const hasMore = follows.length > limit;
  if (hasMore) follows.pop();
  const nextCursor = hasMore
    ? follows[follows.length - 1]._id.toString()
    : null;

  return {
    follows,
    nextCursor,
  };
};
