import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import resumeRoutes from "./routes/resume.routes";
import readinessRoutes from "./routes/readiness.routes";
import leetcodeRoutes from "./routes/leetcode.routes";
import authRoutes from "./routes/auth.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import githubRoutes from "./routes/github.routes";

import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  morgan(env.isProduction ? "combined" : "dev")
);

// Rate limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "codedna-api",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/github", githubRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/leetcode", leetcodeRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (!process.env.VERCEL) {
  connectDatabase()
    .then(() => {
      app.listen(env.port, () => {
        console.log(
          `CodeDNA API listening on port ${env.port}`
        );
      });
    })
    .catch((error) => {
      console.error(
        "Failed to connect to MongoDB:",
        error
      );
      process.exit(1);
    });
}

export default app;