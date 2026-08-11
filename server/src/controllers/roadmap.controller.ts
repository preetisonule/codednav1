import { Response, NextFunction } from "express";
import mongoose from "mongoose";

import Analysis from "../models/Analysis";
import Roadmap from "../models/Roadmap";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";

function buildProgressPayload(roadmap: any) {
  const completedTasksMap: Record<string, number[]> = {};

  for (const day of roadmap.days ?? []) {
    completedTasksMap[String(day.day)] =
      (day.tasks ?? [])
        .map((task: any, index: number) =>
          task.completed ? index : null
        )
        .filter((index: number | null) => index !== null) as number[];
  }

  const totalTasks = (roadmap.days ?? []).reduce(
    (total: number, day: any) => total + (day.tasks ?? []).length,
    0
  );

  const completedCount = (roadmap.days ?? []).reduce(
    (total: number, day: any) =>
      total +
      (day.tasks ?? []).filter((task: any) => task.completed).length,
    0
  );

  const completedDays = (roadmap.days ?? [])
    .filter((day: any) => day.completed)
    .map((day: any) => day.day);

  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  const currentDay =
    (roadmap.days ?? []).find((day: any) => !day.completed)?.day ??
    roadmap.totalDays;

  return {
    analysisId: String(roadmap.analysisId),
    completedDays,
    completedTasks: completedTasksMap,
    totalDays: roadmap.totalDays,
    completedCount,
    progressPercentage,
    currentDay,
  };
}

function recalculateRoadmapState(roadmap: any) {
  const days = roadmap.days ?? [];

  for (const day of days) {
    day.completed =
      (day.tasks ?? []).length > 0 &&
      (day.tasks ?? []).every((task: any) => task.completed);
  }

  const totalTasks = days.reduce(
    (total: number, day: any) => total + (day.tasks ?? []).length,
    0
  );

  const completedTasks = days.reduce(
    (total: number, day: any) =>
      total +
      (day.tasks ?? []).filter((task: any) => task.completed).length,
    0
  );

  roadmap.progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  roadmap.status = totalTasks > 0 && completedTasks === totalTasks ? "completed" : "active";

  return {
    totalTasks,
    completedTasks,
    progress: roadmap.progress,
    status: roadmap.status,
  };
}

export async function importRoadmap(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { analysisId } = req.body;

    if (!analysisId || typeof analysisId !== "string") {
      res.status(400).json({
        message: "analysisId is required",
        code: "ANALYSIS_ID_REQUIRED",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
        code: "INVALID_ANALYSIS_ID",
      });
      return;
    }

    const activeRoadmap = await Roadmap.findOne({
      userId: req.userId,
      status: "active",
    });

    if (activeRoadmap) {
      res.status(409).json({
        message: "You already have an active roadmap",
        code: "ACTIVE_ROADMAP_EXISTS",
      });
      return;
    }

    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.userId,
    }).lean();

    if (!analysis) {
      res.status(404).json({
        message: "Analysis not found",
        code: "ANALYSIS_NOT_FOUND",
      });
      return;
    }

    const generatedDays = Array.isArray((analysis as any).roadmap?.days)
      ? (analysis as any).roadmap.days
      : [];

    const roadmap = await Roadmap.create({
      userId: req.userId,
      analysisId: (analysis as any)._id,
      targetRole: (analysis as any).targetRole,
      totalDays: (analysis as any).preparationDays ?? generatedDays.length,
      days: generatedDays.map((day: any) => ({
        day: day.day,
        focus: day.focus,
        tasks: (day.tasks ?? []).map((task: any) => ({
          title: task.title,
          description: task.description,
          estimatedHours: task.estimatedHours,
          category: task.category,
          completed: false,
        })),
        completed: false,
      })),
      status: "active",
      progress: 0,
    });

    res.status(201).json({
      message: "Roadmap imported successfully",
      roadmap,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentRoadmap(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const roadmap = await Roadmap.findOne({
      userId: req.userId,
      status: "active",
    }).lean();

    if (!roadmap) {
      res.status(404).json({
        message: "No active roadmap found",
        code: "ACTIVE_ROADMAP_NOT_FOUND",
      });
      return;
    }

    const summary = buildProgressPayload(roadmap);

    res.status(200).json({
      roadmap: {
        id: roadmap._id,
        targetRole: roadmap.targetRole,
        totalDays: roadmap.totalDays,
        status: roadmap.status,
        createdAt: roadmap.createdAt,
      },
      progress: summary.progressPercentage,
      totalTasks: summary.completedCount +
        (Object.values(summary.completedTasks).reduce(
          (total: number, tasks: number[]) => total + tasks.length,
          0
        ) - summary.completedCount),
      completedTasks: summary.completedCount,
      totalDays: summary.totalDays,
      completedDays: summary.completedDays.length,
      currentDay: summary.currentDay,
      days: roadmap.days,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmapProgress(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { analysisId } = req.params;

    if (!analysisId || !mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
        code: "INVALID_ANALYSIS_ID",
      });
      return;
    }

    const roadmap = await Roadmap.findOne({
      userId: req.userId,
      analysisId,
      status: "active",
    }).lean();

    if (!roadmap) {
      res.status(404).json({
        message: "Roadmap not found",
        code: "ROADMAP_NOT_FOUND",
      });
      return;
    }

    const payload = buildProgressPayload(roadmap);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskCompletion(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { analysisId, dayNumber, taskIndex } = req.params;
    const day = Number(dayNumber);
    const task = Number(taskIndex);

    if (!analysisId || !mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
        code: "INVALID_ANALYSIS_ID",
      });
      return;
    }

    if (!Number.isInteger(day) || day < 1) {
      res.status(400).json({
        message: "Invalid day number",
        code: "INVALID_DAY_NUMBER",
      });
      return;
    }

    if (!Number.isInteger(task) || task < 0) {
      res.status(400).json({
        message: "Invalid task index",
        code: "INVALID_TASK_INDEX",
      });
      return;
    }

    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      res.status(400).json({
        message: "completed must be a boolean",
        code: "INVALID_COMPLETION_STATE",
      });
      return;
    }

    const roadmap = await Roadmap.findOne({
      userId: req.userId,
      analysisId,
      status: "active",
    });

    if (!roadmap) {
      res.status(404).json({
        message: "Roadmap not found",
        code: "ROADMAP_NOT_FOUND",
      });
      return;
    }

    const targetDay = roadmap.days.find((item: any) => item.day === day);

    if (!targetDay) {
      res.status(404).json({
        message: "Day not found",
        code: "DAY_NOT_FOUND",
      });
      return;
    }

    if (!targetDay.tasks[task]) {
      res.status(404).json({
        message: "Task not found",
        code: "TASK_NOT_FOUND",
      });
      return;
    }

    targetDay.tasks[task].completed = completed;

    recalculateRoadmapState(roadmap);
    await roadmap.save();

    const payload = buildProgressPayload(roadmap.toObject ? roadmap.toObject() : roadmap);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
}

export async function updateDayCompletion(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { analysisId, dayNumber } = req.params;
    const day = Number(dayNumber);

    if (!analysisId || !mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
        code: "INVALID_ANALYSIS_ID",
      });
      return;
    }

    if (!Number.isInteger(day) || day < 1) {
      res.status(400).json({
        message: "Invalid day number",
        code: "INVALID_DAY_NUMBER",
      });
      return;
    }

    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      res.status(400).json({
        message: "completed must be a boolean",
        code: "INVALID_COMPLETION_STATE",
      });
      return;
    }

    const roadmap = await Roadmap.findOne({
      userId: req.userId,
      analysisId,
      status: "active",
    });

    if (!roadmap) {
      res.status(404).json({
        message: "Roadmap not found",
        code: "ROADMAP_NOT_FOUND",
      });
      return;
    }

    const targetDay = roadmap.days.find((item: any) => item.day === day);

    if (!targetDay) {
      res.status(404).json({
        message: "Day not found",
        code: "DAY_NOT_FOUND",
      });
      return;
    }

    for (const task of targetDay.tasks) {
      task.completed = completed;
    }

    targetDay.completed = completed;
    recalculateRoadmapState(roadmap);
    await roadmap.save();

    const payload = buildProgressPayload(roadmap.toObject ? roadmap.toObject() : roadmap);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
}