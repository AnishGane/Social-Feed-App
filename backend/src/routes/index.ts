// Centralize all routes

import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import postRoutes from "../modules/post/post.routes";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
// post routes
router.use("/posts", postRoutes);
// user routes
router.use("/users", userRoutes);

export default router;
