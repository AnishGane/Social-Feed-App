// Centralize all routes

import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import postRoutes from "../modules/post/post.routes";

const router = Router();

router.use("/auth", authRoutes);
// post routes
router.use("/post", postRoutes);

export default router;
