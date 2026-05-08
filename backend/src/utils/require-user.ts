import { Request } from "express";
import { ApiError } from "./api-error";

export const requireUser = (req: Request) => {
  if (!req.user) {
    throw new ApiError("Unauthorized", 401);
  }

  return req.user;
};
