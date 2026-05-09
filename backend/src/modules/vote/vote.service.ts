import mongoose, { Types } from "mongoose";
import { ApiError } from "../../utils/api-error";
import { validateObjectId } from "../../utils/validate-object-id";
import { findPostByIdRepo } from "../post/post.repository";
import {
  createVoteRepo,
  deleteVoteRepo,
  findExistingVoteRepo,
  updateVoteRepo,
} from "./vote.repository";
import postModel from "../post/post.model";
export const voteService = async (
  userId: string,
  postId: string,
  type: "up" | "down",
) => {
  validateObjectId(userId, "User");
  const postObjectId = validateObjectId(postId, "Post");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const post = await findPostByIdRepo(postObjectId);
    if (!post) throw new ApiError("Post not found", 404);

    const existingVote = await findExistingVoteRepo(
      userId,
      postObjectId,
      session,
    );

    /*
      CASE 1: First vote
    */
    if (!existingVote) {
      await createVoteRepo(
        {
          user: new Types.ObjectId(userId),
          post: postObjectId,
          type,
        },
        session,
      );

      await postModel.updateOne(
        { _id: postObjectId },
        {
          $inc:
            type === "up"
              ? { upvotesCount: 1, score: 1 }
              : { downvotesCount: 1, score: -1 },
        },
        { session },
      );
    } else if (existingVote.type === type) {
      /*
      CASE 2: Toggle off
    */
      await deleteVoteRepo(existingVote._id, session);

      await postModel.updateOne(
        { _id: postObjectId },
        {
          $inc:
            type === "up"
              ? { upvotesCount: -1, score: -1 }
              : { downvotesCount: -1, score: 1 },
        },
        { session },
      );
    } else {
      /*
      CASE 3: Switch vote
    */
      await updateVoteRepo(existingVote._id, type, session);

      await postModel.updateOne(
        { _id: postObjectId },
        {
          $inc:
            type === "up"
              ? { upvotesCount: 1, downvotesCount: -1, score: 2 }
              : { upvotesCount: -1, downvotesCount: 1, score: -2 },
        },
        { session },
      );
    }

    await session.commitTransaction();

    const updatedPost = await findPostByIdRepo(postObjectId);
    if (!updatedPost) throw new ApiError("Post not found", 404);

    return {
      upvotesCount: updatedPost.upvotesCount,
      downvotesCount: updatedPost.downvotesCount,
      score: updatedPost.score,
      currentUserVote: existingVote?.type === type ? null : type,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
