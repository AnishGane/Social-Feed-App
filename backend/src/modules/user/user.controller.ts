import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import {
  getMeService,
  getProfileService,
  searchUserService,
  updateProfileService,
} from "./user.service";
import { sendResponse } from "../../utils/api-response";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username.toString();

  if (!username || username.trim().length === 0) {
    return sendResponse(res, 400, null, "Username is required");
  }

  if (username.length > 50) {
    return sendResponse(res, 400, null, "Username is too long");
  }
  const profile = await getProfileService(username);

  sendResponse(res, 200, profile, "Profile fetched successfully");
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);

    const updatedUser = await updateProfileService(
      user._id.toString(),
      req.body,
      req.file,
    );

    sendResponse(res, 200, updatedUser, "Profile updated successfully");
  },
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const me = await getMeService(user._id.toString());

  sendResponse(res, 200, me, "Current user fetched");
});

export const searchUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const userId = user._id.toString();

    const search = typeof req.query.q === "string" ? req.query.q : "";

    const users = await searchUserService(userId, search);

    sendResponse(res, 200, users, "Users fetched successfully");
  },
);
