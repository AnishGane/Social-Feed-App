import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  createCommentService,
  deleteCommentService,
  getCommentsByPostService,
  getRepliesByCommentService,
  updateCommentService,
} from "./comment.service";
import { requireUser } from "../../utils/require-user";
import { sendResponse } from "../../utils/api-response";
import httpStatus from "http-status";

export const createCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const result = await createCommentService(user._id.toString(), req.body);

    sendResponse(
      res,
      httpStatus.CREATED,
      result,
      "Comment created successfully",
    );
  },
);

export const getCommentsByPostController = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

    const userId = req.user?._id?.toString();

    const result = await getCommentsByPostService(
      postId.toString(),
      cursor,
      limit,
      userId,
    );

    sendResponse(res, httpStatus.OK, result, "Comments fetched successfully");
  },
);

export const updateCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const user = requireUser(req);

    const result = await updateCommentService(
      user._id.toString(),
      commentId.toString(),
      req.body,
    );

    sendResponse(res, httpStatus.OK, result, "Comment updated successfully");
  },
);

export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const user = requireUser(req);

    await deleteCommentService(user._id.toString(), commentId.toString());

    sendResponse(res, httpStatus.OK, null, "Comment deleted successfully");
  },
);

export const getRepliesByCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const rawLimit = Number(req.query.limit);

    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;

    const userId = req.user?._id?.toString();

    const result = await getRepliesByCommentService(
      commentId.toString(),
      cursor,
      limit,
      userId,
    );

    sendResponse(res, httpStatus.OK, result, "Replies fetched successfully");
  },
);
