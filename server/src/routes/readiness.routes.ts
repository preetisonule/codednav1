import { Router } from "express";
import multer from "multer";

import { getReadiness } from "../controllers/analysis.controller"; // Make sure this path matches
import { authMiddleware } from "../middleware/authMiddleware"; // <-- Import your middleware

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 🟢 Add authMiddleware before getReadiness
router.post(
  "/analyze",
  authMiddleware,      // <-- This runs first, populates req.userId
  upload.single("resume"),
  getReadiness
);

export default router;