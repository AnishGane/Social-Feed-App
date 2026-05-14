import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import {
  getMeService,
  getProfileService,
  updateProfileService,
} from "./user.service";
import { sendResponse } from "../../utils/api-response";
import { updateProfileSchema } from "./user.validation";

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

    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await updateProfileService(
      user._id.toString(),
      validatedData,
    );

    sendResponse(res, 200, updatedUser, "Profile updated successfully");
  },
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const me = await getMeService(user._id.toString());

  sendResponse(res, 200, me, "Current user fetched");
});
