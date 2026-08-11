import { Router } from "express";
import { getAnalysisById } from "../controllers/analysis.controller";

const router = Router();

router.get("/:analysisId", getAnalysisById);

export default router;