import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import User from "../user/user.model";
import { ApiError } from "../../utils/api-error";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const exists = await User.findOne({ email });

  if (exists) throw new ApiError("User already exists", 400);

  const user = await User.create({
    username,
    email,
    password,
  });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  const { password: _password, ...userObj } = user.toObject();

  return { user: userObj, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ApiError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new ApiError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  const { password: _password, ...userObj } = user.toObject();

  return { user: userObj, accessToken, refreshToken };
};

export const refreshTokenService = async (token: string) => {
  if (!token) throw new ApiError("No refresh token", 401);

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET!) as { id: string };
  } catch (error) {
    throw new ApiError("Invalid refresh token", 403);
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new ApiError("Invalid refresh token", 403);
  }

  const userId = user._id.toString();

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError("User not found", 404);

  user.refreshToken = "";
  await user.save();
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new ApiError("User not found", 404);

  return user;
}
