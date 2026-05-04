import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes

export default app;
