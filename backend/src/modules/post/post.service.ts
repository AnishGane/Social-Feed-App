import { ApiError } from "../../utils/api-error";
import { validateObjectId } from "../../utils/validate-object-id";
import {
  createPostRepo,
  findPostByIdRepo,
  getPostsRepo,
  updatePostRepo,
  deletePostRepo,
  getPostsByUserRepo,
} from "./post.repository";
import { CreatePostInput, UpdatePostInput } from "./post.validation";

export const createPostService = async (
  data: CreatePostInput,
  userId: string,
) => {
  const userObjectId = validateObjectId(userId, "User");

  return await createPostRepo({
    ...data,
    author: userObjectId,
  });
};

export const getPostsService = async (cursor?: string, limit = 10) => {
  if (limit <= 0 || limit > 100) {
    throw new ApiError(
      "IInvalid limit parameter. Must be between 1 and 100",
      400,
    );
  }

  if (cursor) {
    validateObjectId(cursor, "Cursor");
  }

  return await getPostsRepo(cursor, limit);
};

export const getPostByIdService = async (id: string) => {
  const postObjectId = validateObjectId(id, "Post");

  const post = await findPostByIdRepo(postObjectId);
  if (!post) throw new ApiError("Post not found", 404);
  return post;
};

export const updatePostService = async (
  id: string,
  userId: string,
  data: UpdatePostInput,
) => {
  const postObjectId = validateObjectId(id, "Post");

  const userObjectId = validateObjectId(userId, "User");

  const post = await findPostByIdRepo(postObjectId);
  if (!post) throw new ApiError("Post not found", 404);

  if (!post.author.equals(userObjectId))
    throw new ApiError("Forbidden access", 403);

  return await updatePostRepo(id, data);
};

export const deletePostService = async (id: string, userId: string) => {
  const postObjectId = validateObjectId(id, "Post");
  const userObjectId = validateObjectId(userId, "User");

  const post = await findPostByIdRepo(postObjectId);

  if (!post) throw new ApiError("Post not found", 404);
  if (!post.author.equals(userObjectId))
    throw new ApiError("Forbidden access", 403);

  return deletePostRepo(id);
};

export const getPostsByUserService = async (
  userId: string,
  cursor?: string,
  limit = 10,
) => {
  const userObjectId = validateObjectId(userId, "User");

  if (cursor) {
    validateObjectId(cursor, "Cursor");
  }

  if (limit <= 0 || limit > 100) {
    throw new ApiError(
      "IInvalid limit parameter. Must be between 1 and 100",
      400,
    );
  }

  return await getPostsByUserRepo(userObjectId, cursor, limit);
};
