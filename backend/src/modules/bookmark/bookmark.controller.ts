import { Request, Response } from "express";

import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import { sendResponse } from "../../utils/api-response";

import { toggleBookmarkService } from "./bookmark.service";

export const toggleBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);

    const { postId } = req.body;

    if (!postId) {
      return sendResponse(res, 400, null, "Post ID is required");
    }

    const result = await toggleBookmarkService(user._id.toString(), postId);

    sendResponse(res, 200, result, "Bookmark toggled successfully");
  },
);
