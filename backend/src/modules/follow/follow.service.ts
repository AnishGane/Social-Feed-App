import mongoose, { Types } from "mongoose";
import { ApiError } from "../../utils/api-error";
import httpStatus from "http-status";
import User from "../user/user.model";
import {
  createFollowRepo,
  deleteFollowRepo,
  getFollowRepo,
  getFollowersRepo,
  getFollowingRepo,
} from "./follow.repository";
import { validateObjectId } from "../../utils/validate-object-id";
import { checkLimit } from "../post/post.utils";

export const toggleFollowService = async (
  currentUserId: string | Types.ObjectId,
  targetUserId: string | Types.ObjectId,
) => {
  const currentUserObjectId = validateObjectId(currentUserId, "Current User");
  const targetUserObjectId = validateObjectId(targetUserId, "Target User");

  if (currentUserObjectId.equals(targetUserObjectId)) {
    throw new ApiError("You cannot follow yourself", httpStatus.BAD_REQUEST);
  }

  const targetUser = await User.findById(targetUserObjectId);

  if (!targetUser) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deleted = await deleteFollowRepo(
      currentUserObjectId,
      targetUserObjectId,
      session,
    );
    if (deleted) {
      await User.findByIdAndUpdate(
        currentUserObjectId,
        {
          $inc: {
            followingCount: -1,
          },
        },
        { session },
      );

      await User.findByIdAndUpdate(
        targetUserId,
        {
          $inc: {
            followersCount: -1,
          },
        },
        { session },
      );

      await session.commitTransaction();

      return {
        isFollowing: false,
      };
    }

    await createFollowRepo(currentUserObjectId, targetUserObjectId, session);

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $inc: {
          followingCount: 1,
        },
      },
      { session },
    );

    await User.findByIdAndUpdate(
      targetUserId,
      {
        $inc: {
          followersCount: 1,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return {
      isFollowing: true,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getFollowersService = async (
  targetUserId: string,
  currentUserId?: string,
  cursor?: string,
  limit = 20,
) => {
  const target = validateObjectId(targetUserId, "Target User");
  const current = currentUserId
    ? validateObjectId(currentUserId, "Current User")
    : undefined;

  checkLimit(limit);

  return getFollowersRepo(target, current, cursor, limit);
};

export const getFollowingService = async (
  targetUserId: string,
  currentUserId?: string,
  cursor?: string,
  limit = 20,
) => {
  const target = validateObjectId(targetUserId, "Target User");
  const current = currentUserId
    ? validateObjectId(currentUserId, "Current User")
    : undefined;

  checkLimit(limit);

  return getFollowingRepo(target, current, cursor, limit);
};
