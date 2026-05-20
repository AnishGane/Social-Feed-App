import express from "express";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { bookmarkSchema } from "./bookmark.validation";
import { toggleBookmark } from "./bookmark.controller";

const router = express.Router();

router.post("/", protect, validate(bookmarkSchema, "body"), toggleBookmark);

export default router;