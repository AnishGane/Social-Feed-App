import express from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUser,
  updatePost,
} from "./post.controller";
import { validate } from "../../middleware/validate.middleware";
import { createPostSchema, updatePostSchema } from "./post.validation";
import {
  createPostLimiter,
  updatePostLimiter,
} from "../../middleware/rate-limit/post-rate-limit";
import { voteSchema } from "../vote/vote.validation";
import { votePost } from "../vote/vote.controller";
import { votePostLimiter } from "../../middleware/rate-limit/vote-rate-limit";

const router = express.Router();

router.post(
  "/",
  protect,
  createPostLimiter,
  validate(createPostSchema),
  createPost,
);
router.get("/", getPosts);
router.post("/vote", protect, votePostLimiter, validate(voteSchema), votePost);
router.get("/user/:userId", protect, getPostsByUser);

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
