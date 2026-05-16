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
import {
  createPostLimiter,
  updatePostLimiter,
} from "../../middleware/rate-limit/post-rate-limit";
import { voteSchema } from "../vote/vote.validation";
import { votePost } from "../vote/vote.controller";
import { votePostLimiter } from "../../middleware/rate-limit/vote-rate-limit";
import upload from "../../middleware/multer.middleware";

const router = express.Router();

// because multipart form data won't work properly with your current validator.
router.post(
  "/",
  protect,
  createPostLimiter,
  upload.single("mainImage"),
  createPost,
);
router.get("/", getPosts);
router.post(
  "/vote",
  protect,
  votePostLimiter,
  validate(voteSchema, "body"),
  votePost,
);
router.get("/user/:userId", protect, getPostsByUser);

router.get("/:id", getPostById);
router.put(
  "/:id",
  protect,
  updatePostLimiter,
  upload.single("mainImage"),
  updatePost,
);
router.delete("/:id", protect, deletePost);

export default router;
