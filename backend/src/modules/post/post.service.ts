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
import { UpdatePostInput, createPostSchema } from "./post.validation";
import uploadImageToCloudinary from "../../utils/upload-image";
import { validateImageFile } from "../../utils/validate-image";

interface CreatePostRequestBody {
  title: string;
  content: string;
  tags?: string | undefined | string[];
}

export const createPostService = async (
  reqBody: CreatePostRequestBody,
  file: Express.Multer.File | undefined,
  userId: string,
) => {
  const userObjectId = validateObjectId(userId, "User");

  let imageUrl: string | undefined;

  if (file) {
    try {
      await validateImageFile(file);

      imageUrl = await uploadImageToCloudinary(file);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Image upload failed", 500);
    }
  }

  const validatedData = createPostSchema.parse({
    title: reqBody.title,
    content: reqBody.content,
    tags: reqBody.tags,
  });

  return await createPostRepo({
    ...validatedData,
    mainImage: imageUrl,
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
