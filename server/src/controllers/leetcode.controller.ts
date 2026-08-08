import { NextFunction, Request, Response } from "express";
import { analyzeLeetCode } from "../services/leetcodeAnalysis.service";

export async function analyzeLeetCodeProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username } = req.params;

    if (!username) {
      res.status(400).json({
        message: "LeetCode username is required",
      });
      return;
    }

    const analysis = await analyzeLeetCode(username);

    if (!analysis) {
      res.status(404).json({
        message: "LeetCode profile not found",
      });
      return;
    }

    res.json(analysis);
  } catch (err) {
    next(err);
  }
}