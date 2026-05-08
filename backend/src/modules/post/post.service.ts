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
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user identifier", 400);
  }

  return await createPostRepo({
    ...data,
    author: new Types.ObjectId(userId),
  });
};

export const getPostsService = async (skip: number, limit: number) => {
  if (skip < 0 || limit <= 0) {
    throw new ApiError("Invalid pagination parameters", 400);
  }

  return await getPostsRepo(skip, limit);
};

export const getPostByIdService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid post identifier", 400);
  }

  const post = await findPostByIdRepo(id);
  if (!post) throw new ApiError("Post not found", 404);
  return post;
};

export const updatePostService = async (
  id: string,
  userId: string,
  data: UpdatePostInput,
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid post identifier", 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user identifier", 400);
  }

  const post = await findPostByIdRepo(id);
  if (!post) throw new ApiError("Post not found", 404);

  if (post.author.toString() !== userId)
    throw new ApiError("Forbidden access", 403);

  return await updatePostRepo(id, data);
};

export const deletePostService = async (id: string, userId: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid post identifier", 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user identifier", 400);
  }

  const post = await findPostByIdRepo(id);

  if (!post) throw new ApiError("Post not found", 404);
  if (post.author.toString() !== userId)
    throw new ApiError("Forbidden access", 403);

  return deletePostRepo(id);
};
