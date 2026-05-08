import express from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./post.controller";
import { validate } from "../../middleware/validate.middleware";
import { createPostSchema, updatePostSchema } from "./post.validation";
import {
  createPostLimiter,
  updatePostLimiter,
} from "../../middleware/rate-limit/post-rate-limit";

const router = express.Router();

router.post(
  "/",
  protect,
  createPostLimiter,
  validate(createPostSchema),
  createPost,
);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put(
  "/:id",
  protect,
  updatePostLimiter,
  validate(updatePostSchema),
  updatePost,
);
router.delete("/:id", protect, deletePost);

export default router;
