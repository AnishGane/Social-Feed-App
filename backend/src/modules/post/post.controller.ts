import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostsByUserService,
  getPostsService,
  updatePostService,
} from "./post.service";
import { sendResponse } from "../../utils/api-response";
import { requireUser } from "../../utils/require-user";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const userId = user._id.toString();

  const post = await createPostService(req.body, userId);

  sendResponse(res, 201, post, "Post created successfully");
});

// Get Post of all the users
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const skip = Number.parseInt(String(req.query.skip ?? "0"), 10);
  const limit = Number.parseInt(String(req.query.limit ?? "10"), 10);

  if (!Number.isInteger(skip) || skip < 0) {
    throw new Error("Invalid 'skip' query param");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid 'limit' query param");
  }

  const posts = await getPostsService(skip, limit);

  sendResponse(res, 200, posts, "Posts fetched successfully");
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const post = await getPostByIdService(id);

  sendResponse(res, 200, post, "Post fetched successfully");
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const user = requireUser(req);
  const userId = user._id.toString();

  const post = await updatePostService(id, userId, req.body);

  sendResponse(res, 200, post, "Post updated Successfully");
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id.toString();
  const user = requireUser(req);
  const userId = user._id.toString();

  await deletePostService(postId, userId);

  sendResponse(res, 200, null, "Post deleted successfully");
});

// Get posts of a single user
export const getPostsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const skip = Number.parseInt(String(req.query.skip ?? "0"), 10);
    const limit = Number.parseInt(String(req.query.limit ?? "10"), 10);

    if (!Number.isInteger(skip) || skip < 0) {
      throw new Error("Invalid 'skip' query param");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error("Invalid 'limit' query param");
    }

    const posts = await getPostsByUserService(userId.toString(), skip, limit);

    sendResponse(res, 200, posts, "User posts fetched successfully");
  },
);
