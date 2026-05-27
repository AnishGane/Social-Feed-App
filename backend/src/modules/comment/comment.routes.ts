import express from "express";
import { validate } from "../../middleware/validate.middleware";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";
import { protect } from "../../middleware/auth.middleware";
import {
  createCommentController,
  deleteCommentController,
  getCommentsByPostController,
  getRepliesByCommentController,
  updateCommentController,
} from "./comment.controller";
import { toggleCommentLikeController } from "../comment-like/comment-like.controller";
import { toggleCommentLikeSchema } from "../comment-like/comment-like.validation";

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createCommentSchema, "body"),
  createCommentController,
);

router.get("/post/:postId", protect, getCommentsByPostController);

router.patch(
  "/:commentId",
  protect,
  validate(updateCommentSchema, "body"),
  updateCommentController,
);

router.delete("/:commentId", protect, deleteCommentController);

router.get("/replies/:commentId", getRepliesByCommentController);

router.post(
  "/:commentId/like",
  protect,
  validate(toggleCommentLikeSchema, "params"),
  toggleCommentLikeController,
);

export default router;
