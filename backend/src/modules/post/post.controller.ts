import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostsService,
  updatePostService,
} from "./post.service";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { sendResponse } from "../../utils/api-response";
import { requireUser } from "../../utils/require-user";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const userId = user._id.toString();

  const post = await createPostService(req.body, userId);

  sendResponse(res, 201, post, "Post created successfully");
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 10;

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
