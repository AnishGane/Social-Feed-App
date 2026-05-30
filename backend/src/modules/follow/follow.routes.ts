import express from "express";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { toggleFollowSchema } from "./follow.validation";
import {
  getFollowersController,
  getFollowingController,
  toggleFollowController,
} from "./follow.controller";

const router = express.Router();

router.post(
  "/:userId",
  protect,
  validate(toggleFollowSchema, "params"),
  toggleFollowController,
);

router.get("/:userId/followers", protect, getFollowersController);

router.get("/:userId/following", protect, getFollowingController);

export default router;
