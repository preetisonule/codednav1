import { Router } from "express";
import { analyzeLeetCodeProfile } from "../controllers/leetcode.controller";

const router = Router();

router.get("/:username", analyzeLeetCodeProfile);

export default router;