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

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createCommentSchema, "body"),
  createCommentController,
);

router.get("/post/:postId", getCommentsByPostController);

router.patch(
  "/:commentId",
  protect,
  validate(updateCommentSchema, "body"),
  updateCommentController,
);

router.delete("/:commentId", protect, deleteCommentController);

router.get("/replies/:commentId", protect, getRepliesByCommentController);

export default router;
