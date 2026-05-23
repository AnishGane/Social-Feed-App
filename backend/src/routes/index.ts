// Centralize all routes

import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import postRoutes from "../modules/post/post.routes";
import userRoutes from "../modules/user/user.routes";
import bookmarkRoutes from "../modules/bookmark/bookmark.routes";
import commentRoutes from "../modules/comment/comment.routes";

const router = Router();

router.use("/auth", authRoutes);
// post routes
router.use("/posts", postRoutes);
// user routes
router.use("/users", userRoutes);
// bookmark routes
router.use("/bookmarks", bookmarkRoutes);
// comment routes
router.use("/comments", commentRoutes);

export default router;
