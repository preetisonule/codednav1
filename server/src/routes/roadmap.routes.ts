import { Router } from "express";

import {
  importRoadmap,
  getCurrentRoadmap,
  getRoadmapProgress,
  updateTaskCompletion,
  updateDayCompletion,
} from "../controllers/roadmap.controller";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/import",
  authMiddleware,
  importRoadmap
);

router.get(
  "/current",
  authMiddleware,
  getCurrentRoadmap
);

router.get(
  "/:analysisId/progress",
  authMiddleware,
  getRoadmapProgress
);

router.patch(
  "/:analysisId/day/:dayNumber",
  authMiddleware,
  updateDayCompletion
);

router.patch(
  "/:analysisId/day/:dayNumber/task/:taskIndex",
  authMiddleware,
  updateTaskCompletion
);

export default router;