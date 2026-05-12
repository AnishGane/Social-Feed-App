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
  const cursor =
    typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const rawLimit = Number(req.query.limit);
  const limit =
    !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

  const result = await getPostsService(cursor, limit);

  sendResponse(res, 200, result, "Posts fetched successfully");
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
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;
    const userId = req.params.userId;

    const result = await getPostsByUserService(
      userId.toString(),
      cursor,
      limit,
    );

    sendResponse(res, 200, result, "User posts fetched successfully");
  },
);
