import { Router } from "express";
import multer from "multer";

import { getReadiness } from "../controllers/readiness.controller";

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
  getReadiness
);

export default router;