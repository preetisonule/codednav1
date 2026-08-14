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

// 🟢 IMPORT YOUR MONGOOSE MODEL
import Analysis from "../models/Analysis"; 

export async function getReadiness(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { githubUsername, userId } = req.body; // We need userId to link it to a user

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
     * 9. 🟢 SAVE TO DATABASE
     * ============================================
     */

    // Create the new Analysis document
    const newAnalysis = new Analysis({
      userId: userId || "67ec0c7628b960c2e2350277", // ⚠️ Temporary fallback if userId is missing
      targetRole,
      preparationDays,
      readiness,
      skillGaps,
      roadmap,
      github,
      resume,
      leetcode,
    });

    // Save it to MongoDB
    await newAnalysis.save();

    /*
     * ============================================
     * 10. Return complete CodeDNA analysis WITH _id
     * ============================================
     */

    // 🟢 Wrap the result in an 'analysis' object so the frontend can find the _id!
    res.status(201).json({
      message: "Analysis completed successfully",
      analysis: newAnalysis, 
    });

  } catch (err) {
    next(err);
  }
}