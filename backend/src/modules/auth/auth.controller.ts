import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshTokenService,
  registerUser,
} from "./auth.service";
import { sendResponse } from "../../utils/api-response";
import { ApiError } from "../../utils/api-error";
import { requireUser } from "../../utils/require-user";
import { refreshCookieOptions } from "../../utils/cookie-options";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const { user, accessToken, refreshToken } = await registerUser(
    username,
    email,
    password,
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, 201, { user, accessToken }, "User registered successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  sendResponse(res, 200, { user, accessToken }, "Login successfully");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError("No refresh token", 401);
  }

  const tokens = await refreshTokenService(token);

  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  sendResponse(
    res,
    200,
    { accessToken: tokens.accessToken },
    "Access token refreshed successfully",
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  await logoutUser(user._id.toString());

  res.clearCookie("refreshToken", { path: "/" });

  sendResponse(res, 200, null, "Logout successfully");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const currentUser = await getMe(user._id.toString());

  sendResponse(res, 200, currentUser, "User fetched");
});
