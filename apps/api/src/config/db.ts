import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
