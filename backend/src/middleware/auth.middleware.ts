import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error";
import User from "../modules/user/user.model";
import { env } from "../config/env";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new ApiError("No token", 401);

  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new ApiError("Server configuration error", 500);
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Invalid token", 401);
  }
};
