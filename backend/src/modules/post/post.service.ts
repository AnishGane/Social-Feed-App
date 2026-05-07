import { ApiError } from "../../utils/api-error";
import {
  createPostRepo,
  findPostByIdRepo,
  getPostsRepo,
  updatePostRepo,
  deletePostRepo,
} from "./post.repository";
import { CreatePostInput, UpdatePostInput } from "./post.types";
import { Types } from "mongoose";

export const createPostService = async (
  data: CreatePostInput,
  userId: string,
) => {
  if (!userId) throw new ApiError("Unauthorized", 401);

  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user identifier", 400);
  }

  return await createPostRepo({
    ...data,
    author: new Types.ObjectId(userId),
  });
};
