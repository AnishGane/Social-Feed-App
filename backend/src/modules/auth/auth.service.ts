import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import User from "../user/user.model";
import { ApiError } from "../../utils/api-error";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  name: string,
) => {
  const normalizedUsername = username.toLowerCase();

  const exists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: normalizedUsername }],
  });

  if (exists) {
    if (exists.email === email.toLowerCase()) {
      throw new ApiError("Email already exists", 400);
    }

    if (exists.username === normalizedUsername) {
      throw new ApiError("Username already exists", 400);
    }
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    name,
  });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await User.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  const { password: _password, ...userObj } = user.toObject();

  return { user: userObj, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) throw new ApiError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new ApiError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  await User.findByIdAndUpdate(user._id, {
    refreshToken,
  });

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

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new ApiError("Invalid refresh token", 403);
  }

  const userId = user._id.toString();

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  await User.findByIdAndUpdate(user._id, {
    refreshToken: newRefreshToken,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError("User not found", 404);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      refreshToken: "",
    },
    {
      new: true,
    },
  );

  if (!updatedUser) {
    throw new ApiError("User not found", 404);
  }
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new ApiError("User not found", 404);

  return user;
};
