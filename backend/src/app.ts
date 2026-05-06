import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes";
import { env } from "./config/env";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.use("/api/v1", routes);

export default app;
