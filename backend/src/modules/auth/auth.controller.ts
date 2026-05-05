import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  loginUser,
  logoutUser,
  refreshTokenService,
  registerUser,
} from "./auth.service";
import { env } from "../../config/env";
import { sendResponse } from "../../utils/api-response";
import { ApiError } from "../../utils/api-error";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await registerUser(username, email, password);

  sendResponse(res, 201, user, "User registered successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
  });

  sendResponse(res, 200, { user, accessToken }, "Login successfully");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError("No refresh token", 401);
  }

  const tokens = await refreshTokenService(token);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendResponse(
    res,
    200,
    { accessToken: tokens.accessToken },
    "Access token refreshed successfully",
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError("Unauthorized", 401);
  }

  const userId = req.user._id;
  await logoutUser(userId.toString());

  res.clearCookie("refreshToken", { path: "/" });

  sendResponse(res, 200, null, "Logout successfully");
});
