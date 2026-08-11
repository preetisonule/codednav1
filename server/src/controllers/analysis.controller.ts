import { Request, Response } from "express";
import mongoose from "mongoose";
import Analysis from "../models/Analysis";

export const getAnalysisById = async (
  req: Request,
  res: Response
) => {
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