import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Analysis from "../models/Analysis";

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

import { AuthenticatedRequest } from "../middleware/authMiddleware"; 

// ============================================
// Controller 1: Get Analysis by ID (For Profile Page)
// ============================================
export const getAnalysisById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { analysisId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return res.status(400).json({
        message: "Invalid analysisId",
      });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      message: "Analysis fetched successfully",
      analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis",
    });
  }
};

// ============================================
// Controller 2: Run New Readiness Analysis (For Main Form)
// ============================================
export const getReadiness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { githubUsername } = req.body;

    /*
     * ============================================
     * 1. Validate GitHub username
     * ============================================
     */
    if (!githubUsername || typeof githubUsername !== "string") {
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
     */
    let resume = null;
    if (req.file) {
      resume = await analyzeResume(req.file.buffer);
    }

    /*
     * ============================================
     * 6. Analyze LeetCode
     * ============================================
     */
    const { leetcodeUsername } = req.body;
    let leetcode = null;
    if (leetcodeUsername && typeof leetcodeUsername === "string") {
      leetcode = await analyzeLeetCode(leetcodeUsername.trim());
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
     * 9. 🟢 SAVE TO MONGODB DATABASE
     * ============================================
     */
    
    // ⚠️ NOTE: Make sure your frontend sends 'userId'. 
    // If authentication is not implemented yet, replace this with a hardcoded ID from MongoDB.
    // Inside server/controllers/analysis.controller.ts - section 9

    /*
     * ============================================
     * 9. 🟢 SAVE TO MONGODB DATABASE
     * ============================================
     */
    
    // ✅ Use req.userId from the middleware. 
    // If for some reason it's missing (shouldn't happen), you'll get a validation error.
    const userId = req.userId; 

    const newAnalysis = new Analysis({
      userId: userId, 
      targetRole,
      preparationDays,
      readiness,
      skillGaps,
      roadmap,
      github,
      resume,
      leetcode,
    });

    await newAnalysis.save();

    /*
     * ============================================
     * 10. 🟢 Return WITH _id wrapped in 'analysis'
     * ============================================
     */
    res.status(201).json({
      message: "Analysis completed successfully",
      analysis: newAnalysis, // This contains the _id!
    });

  } catch (err) {
    next(err);
  }
};