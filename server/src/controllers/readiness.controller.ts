import { NextFunction, Request, Response } from "express";

import { githubService } from "../services/github.service";
import { analyzeProfile } from "../services/analysis.service";
import { analyzeResume } from "../services/resume.service";
import { analyzeLeetCode } from "../services/leetcodeAnalysis.service";
import { generateRoadmap } from "../services/roadmap.service";

import {
  computeSkillGaps,
  type TargetRole,
} from "../services/skillGap.service";

import { calculateInterviewReadiness } from "../utils/readinessScore";

export async function getReadiness(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { githubUsername } = req.body;

    /*
     * ============================================
     * 1. Validate GitHub username
     * ============================================
     */

    if (
      !githubUsername ||
      typeof githubUsername !== "string"
    ) {
      res.status(400).json({
        message: "githubUsername is required",
      });

      return;
    }

    /*
     * ============================================
     * 2. Target role
     * ============================================
     */

    const targetRole =
      typeof req.body.targetRole === "string"
        ? req.body.targetRole
        : "Software Engineer";

    /*
     * ============================================
     * 3. Fetch GitHub data
     * ============================================
     */

    const [profile, repos] = await Promise.all([
      githubService.getUser(githubUsername.trim()),
      githubService.getRepos(githubUsername.trim()),
    ]);

    /*
     * ============================================
     * 4. Analyze GitHub
     * ============================================
     */

    const github = analyzeProfile(profile, repos);

    /*
     * ============================================
     * 5. Analyze Resume
     * ============================================
     *
     * Resume is optional.
     */

    let resume = null;

    if (req.file) {
      resume = await analyzeResume(req.file.buffer);
    }

    /*
     * ============================================
     * 6. Analyze LeetCode
     * ============================================
     *
     * LeetCode is optional.
     */

    const { leetcodeUsername } = req.body;

    let leetcode = null;

    if (
      leetcodeUsername &&
      typeof leetcodeUsername === "string"
    ) {
      leetcode = await analyzeLeetCode(
        leetcodeUsername.trim()
      );
    }

    /*
     * ============================================
     * 7. Calculate readiness
     * ============================================
     */

    const readiness = calculateInterviewReadiness({
      github,
      resume,
      leetcode,
    });

    /*
     * ============================================
     * 8. Calculate skill gaps
     * ============================================
     */

    const skillGaps = computeSkillGaps(
      targetRole as TargetRole,
      github,
      resume,
      leetcode
    );
    const preparationDays =
  typeof req.body.days === "number"
    ? Math.max(7, Math.min(req.body.days, 90))
    : 30;

    const roadmap = generateRoadmap(
  targetRole as TargetRole,
  preparationDays,
  skillGaps
);

    /*
     * ============================================
     * 9. Return complete CodeDNA analysis
     * ============================================
     */

    res.json({
  targetRole,

  preparationDays,

  readiness,

  skillGaps,

  roadmap,

  github,

  resume,

  leetcode,
});
  } catch (err) {
    next(err);
  }
}