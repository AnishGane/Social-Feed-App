import rateLimit from "express-rate-limit";

export const createPostLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,

  message: {
    success: false,
    message: "Too many posts created. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const updatePostLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,

  message: {
    success: false,
    message: "Too many update requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
