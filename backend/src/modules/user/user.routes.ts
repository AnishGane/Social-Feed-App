import express from "express";

import { getMe, getProfile, updateProfile } from "./user.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProfileSchema } from "./user.validation";
import { getUserProfileSchema } from "./user.validation";

const router = express.Router();

// Current User
router.get("/me", protect, getMe);

// Update Profile
router.patch("/me", protect, validate(updateProfileSchema), updateProfile);

// Public Profile
router.get("/:username", validate(getUserProfileSchema), getProfile);

export default router;
