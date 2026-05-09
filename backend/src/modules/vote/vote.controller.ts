import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import { voteService } from "./vote.service";
import { sendResponse } from "../../utils/api-response";

export const votePost = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const { postId } = req.params;
  const { type } = req.body;

  // Validate required fields
  if (!postId) {
    return sendResponse(res, 400, null, "Post ID is required");
  }

  if (!type || !["up", "down"].includes(type)) {
    return sendResponse(
      res,
      400,
      null,
      "Valid vote type is required (upvote or downvote)",
    );
  }

  const result = await voteService(
    user._id.toString(),
    postId.toString(),
    type,
  );

  sendResponse(res, 200, result, "Vote processed successfully");
});
