import { Router } from "express";
import { register, login, refresh, logout, me } from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { authLimiter } from "../../config/rate-limit";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;
