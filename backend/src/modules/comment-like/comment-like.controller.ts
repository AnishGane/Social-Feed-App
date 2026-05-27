import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import { toggleCommentLikeService } from "./comment-like.service";
import { sendResponse } from "../../utils/api-response";
import httpStatus from "http-status";

export const toggleCommentLikeController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);

    const { commentId } = req.params;

    const result = await toggleCommentLikeService(
      user._id.toString(),
      commentId.toString(),
    );

    sendResponse(
      res,
      httpStatus.OK,
      result,
      "Comment like toggled successfully",
    );
  },
);
