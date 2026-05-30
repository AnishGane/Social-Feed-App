import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { requireUser } from "../../utils/require-user";
import {
  getFollowersService,
  getFollowingService,
  toggleFollowService,
} from "./follow.service";
import { sendResponse } from "../../utils/api-response";
import httpStatus from "http-status";

export const toggleFollowController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);

    const result = await toggleFollowService(
      user._id.toString(),
      req.params.userId.toString(),
    );

    sendResponse(res, httpStatus.OK, result, "Follow status Updated");
  },
);

export const getFollowersController = asyncHandler(
  async (req: Request, res: Response) => {
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 20;

    const currentUser = requireUser(req);

    const result = await getFollowersService(
      req.params.userId.toString(),
      currentUser._id.toString(),
      cursor,
      limit,
    );

    sendResponse(res, httpStatus.OK, result, "Followers fetched");
  },
);

export const getFollowingController = asyncHandler(
  async (req: Request, res: Response) => {
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const rawLimit = Number(req.query.limit);
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 20;

    const currentUser = requireUser(req);

    const result = await getFollowingService(
      req.params.userId.toString(),
      currentUser._id.toString(),
      cursor,
      limit,
    );

    sendResponse(res, httpStatus.OK, result, "Following fetched");
  },
);
