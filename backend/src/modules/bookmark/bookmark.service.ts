import mongoose, { Types } from "mongoose";
import { validateObjectId } from "../../utils/validate-object-id";
import { findPostByIdRepo } from "../post/post.repository";
import { ApiError } from "../../utils/api-error";
import {
  createBookmarkRepo,
  deleteBookmarkRepo,
  findExistingBookmarkRepo,
} from "./bookmark.repository";
import postModel from "../post/post.model";
import { isMongoDuplicateKeyError } from "./bookmark.utils";

export const toggleBookmarkService = async (
  userId: string | Types.ObjectId,
  postId: string | Types.ObjectId,
) => {
  const userObjectId = validateObjectId(userId, "User");

  const postObjectId = validateObjectId(postId, "Post");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const post = await findPostByIdRepo(userObjectId, postObjectId);

    if (!post) {
      throw new ApiError("Post not found", 404);
    }

    const existingBookmark = await findExistingBookmarkRepo(
      userObjectId,
      postObjectId,
      session,
    );

    let isBookmarked = false;

    /**
     * REMOVE BOOKMARK
     */
    if (existingBookmark) {
      await deleteBookmarkRepo(existingBookmark._id, session);
      await postModel.updateOne(
        {
          _id: postObjectId,
          bookmarksCount: { $gt: 0 },
        },
        {
          $inc: {
            bookmarksCount: -1,
          },
        },
        {
          session,
        },
      );

      isBookmarked = false;
    } else {
      /**
       * CREATE BOOKMARK
       */
      try {
        await createBookmarkRepo(
          {
            user: userObjectId,
            post: postObjectId,
          },
          session,
        );
        await postModel.updateOne(
          {
            _id: postObjectId,
          },
          {
            $inc: {
              bookmarksCount: 1,
            },
          },
          {
            session,
          },
        );
      } catch (error) {
        if (!isMongoDuplicateKeyError(error)) {
          throw error;
        }
        // Concurrent create won the race; bookmark already exists.
      }

      isBookmarked = true;
    }

    await session.commitTransaction();

    const bookmarksCount = post.bookmarksCount + (isBookmarked ? 1 : -1);

    return {
      isBookmarked,
      bookmarksCount,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
