import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized, typed access to environment configuration.
 */
const clientOrigins = (
  process.env.CLIENT_ORIGIN || "https://codednav1.onrender.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  // Server
  port: Number(process.env.PORT) || 5000,

  // Environment
  nodeEnv: process.env.NODE_ENV || "development",

  // Frontend URLs
  clientOrigin:
    process.env.CLIENT_ORIGIN ||
    "https://codednav1.onrender.com",

  clientOrigins,

  // Authentication
  jwtSecret:
    process.env.JWT_SECRET || "development-secret",

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || "",
  },

  // GitHub
  github: {
    token: process.env.GITHUB_TOKEN || "",
    baseUrl: "https://api.github.com",
  },

  // AI
  ai: {
    provider: (
      process.env.AI_PROVIDER || "mock"
    ) as "mock" | "openai" | "gemini" | "claude",

    openaiKey:
      process.env.OPENAI_API_KEY || "",

    geminiKey:
      process.env.GEMINI_API_KEY || "",

    anthropicKey:
      process.env.ANTHROPIC_API_KEY || "",
  },

  isProduction:
    process.env.NODE_ENV === "production",
};