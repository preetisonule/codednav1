import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void> {
  if (!env.mongodb.uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(env.mongodb.uri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}