import rateLimit from "express-rate-limit";

export const votePostLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each user to 10 votes per minute
  message: "Too many vote requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
