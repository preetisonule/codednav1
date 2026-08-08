import { Request, Response, NextFunction } from "express";
import { analyzeResume } from "../services/resume.service";

export async function analyzeResumeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "Resume PDF is required",
      });
      return;
    }

    const result = await analyzeResume(req.file.buffer);

    res.json(result);
  } catch (error) {
    next(error);
  }
}