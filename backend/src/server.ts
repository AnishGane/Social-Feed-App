import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

// Connect to DB first
connectDB();

const PORT = env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
