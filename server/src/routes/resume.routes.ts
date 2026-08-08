import { Router } from "express";
import multer from "multer";
import { analyzeResumeController } from "../controllers/resume.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResumeController
);

export default router;