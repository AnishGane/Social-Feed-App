import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    env.JWT_SECRET,
    { expiresIn: "15min" },
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
