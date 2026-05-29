import express from "express";

import {
  getMe,
  getProfile,
  searchUsersController,
  updateProfile,
} from "./user.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProfileSchema } from "./user.validation";
import { getUserProfileSchema } from "./user.validation";
import upload from "../../middleware/multer.middleware";

const router = express.Router();

// Current User
router.get("/me", protect, getMe);

// Update Profile
router.patch(
  "/me",
  protect,
  upload.single("bannerImage"),
  validate(updateProfileSchema, "body"),
  updateProfile,
);

// search user
router.get("/search", protect, searchUsersController);

// Public Profile
router.get("/:username", validate(getUserProfileSchema, "params"), getProfile);

export default router;
