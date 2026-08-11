import { Router } from "express";

import {
  completeDay,
  getProgress,
  completeTask,
} from "../controllers/roadmapProgress.controller";

const router = Router();

router.patch(
  "/:analysisId/day/:dayNumber/complete",
  completeDay
);

router.patch(
  "/:analysisId/day/:dayNumber/task/:taskIndex/complete",
  completeTask
);

router.get(
  "/:analysisId/progress",
  getProgress
);

export default router;