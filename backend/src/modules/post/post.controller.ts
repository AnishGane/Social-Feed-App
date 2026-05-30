import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  createPostService,
  deletePostService,
  getBookmarkedPostByUserService,
  getPostByIdService,
  getPostsByUserService,
  getPostsService,
  getRelatedPostsService,
  getVotedPostByUserService,
  updatePostService,
} from "./post.service";
import { sendResponse } from "../../utils/api-response";
import { requireUser } from "../../utils/require-user";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { parseTags } from "./post.utils";
import httpStatus from "http-status";
import { ApiError } from "../../utils/api-error";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const userId = user._id.toString();

  const tags = req.body.tags ? parseTags(req.body.tags) : [];

  const validation = createPostSchema.safeParse({
    ...req.body,
    tags,
  });
  if (!validation.success) {
    return sendResponse(
      res,
      400,
      validation.error.message,
      "Validation failed",
    );
  }

  const post = await createPostService(validation.data, req.file, userId);

  sendResponse(res, httpStatus.CREATED, post, "Post created successfully");
});

// Get Post of all the users
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const cursor =
    typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const rawLimit = Number(req.query.limit);
  const limit =
    !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

  const user = requireUser(req);

  const result = await getPostsService(user?._id?.toString(), cursor, limit);

  sendResponse(res, httpStatus.OK, result, "Posts fetched successfully");
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  const user = requireUser(req);

  const post = await getPostByIdService(user._id.toString(), id);
  // console.dir(`PostById: ${JSON.stringify(post)}`, { depth: null });

  sendResponse(res, httpStatus.OK, post, "Post fetched successfully");
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const user = requireUser(req);
  const userId = user._id.toString();

  const tags = req.body.tags ? parseTags(req.body.tags) : [];

  const validation = updatePostSchema.safeParse({
    title: req.body.title,
    content: req.body.content,
    tags,
    removeImage: req.body.removeImage,
  });
  if (!validation.success) {
    return sendResponse(
      res,
      400,
      validation.error.message,
      "Validation failed",
    );
  }

  const post = await updatePostService(id, userId, validation.data, req.file);

  sendResponse(res, httpStatus.OK, post, "Post updated Successfully.");
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id.toString();
  const user = requireUser(req);
  const userId = user._id.toString();

  await deletePostService(postId, userId);

  sendResponse(res, httpStatus.OK, null, "Post deleted successfully");
});

// Get posts of a single user
export const getPostsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;
    const user = requireUser(req);
    const userId = req.params.userId;

    const result = await getPostsByUserService(
      user._id.toString(),
      userId.toString(),
      cursor,
      limit,
    );

    sendResponse(res, httpStatus.OK, result, "User posts fetched successfully");
  },
);

export const getVotedPostByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

    const result = await getVotedPostByUserService(
      user._id.toString(),
      cursor,
      limit,
    );

    sendResponse(
      res,
      httpStatus.OK,
      result,
      "Voted posts fetched successfully",
    );
  },
);

export const getBookmarkedPostsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

    const result = await getBookmarkedPostByUserService(
      user._id.toString(),
      cursor,
      limit,
    );

    sendResponse(
      res,
      httpStatus.OK,
      result,
      "Bookmarked posts fetched successfully",
    );
  },
);

export const getRelatedPostsController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    const user = requireUser(req);

    const post = await getPostByIdService(user._id.toString(), id);

    if (!post) {
      throw new ApiError("Post not found", httpStatus.NOT_FOUND);
    }

    const result = await getRelatedPostsService(id, post.author._id.toString());

    sendResponse(res, httpStatus.OK, result, "Related posts fetched");
  },
);
