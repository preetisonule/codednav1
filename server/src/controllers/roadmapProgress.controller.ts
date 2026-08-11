import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Roadmap from "../models/Roadmap";

// ============================================================
// COMPLETE TASK
// ============================================================

export async function completeTask(
  req: Request,
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

    const { analysisId, dayNumber, taskIndex } = req.params;

    // --------------------------------------------------------
    // Validate analysisId
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
      });
      return;
    }

    const day = Number(dayNumber);
    const index = Number(taskIndex);

    // --------------------------------------------------------
    // Validate day
    // --------------------------------------------------------

    if (!Number.isInteger(day) || day < 1) {
      res.status(400).json({
        message: "Invalid day number",
      });
      return;
    }

    // --------------------------------------------------------
    // Validate task index
    // --------------------------------------------------------

    if (!Number.isInteger(index) || index < 0) {
      res.status(400).json({
        message: "Invalid task index",
      });
      return;
    }

    // --------------------------------------------------------
    // FIND THE EXACT ROADMAP
    // --------------------------------------------------------

    const roadmap = await Roadmap.findOne({
      analysisId,
      userId: req.userId,
      status: "active",
    });

    if (!roadmap) {
      res.status(404).json({
        message: "Active roadmap not found",
      });
      return;
    }

    // --------------------------------------------------------
    // Find day
    // --------------------------------------------------------

    const dayData = roadmap.days.find(
      (item) => item.day === day
    );

    if (!dayData) {
      res.status(404).json({
        message: `Day ${day} not found`,
      });
      return;
    }

    // --------------------------------------------------------
    // Find task
    // --------------------------------------------------------

    if (!dayData.tasks[index]) {
      res.status(404).json({
        message: `Task ${index} not found for day ${day}`,
      });
      return;
    }

    // --------------------------------------------------------
    // Toggle task
    // --------------------------------------------------------

    dayData.tasks[index].completed =
      !dayData.tasks[index].completed;

    // --------------------------------------------------------
    // Recalculate each day's completion
    // --------------------------------------------------------

    for (const roadmapDay of roadmap.days) {
      const allTasksCompleted =
        roadmapDay.tasks.length > 0 &&
        roadmapDay.tasks.every(
          (task) => task.completed
        );

      roadmapDay.completed = allTasksCompleted;
    }

    // --------------------------------------------------------
    // Calculate total tasks
    // --------------------------------------------------------

    const totalTasks = roadmap.days.reduce(
      (total, roadmapDay) =>
        total + roadmapDay.tasks.length,
      0
    );

    // --------------------------------------------------------
    // Calculate completed tasks
    // --------------------------------------------------------

    const completedTasks = roadmap.days.reduce(
      (total, roadmapDay) =>
        total +
        roadmapDay.tasks.filter(
          (task) => task.completed
        ).length,
      0
    );

    // --------------------------------------------------------
    // Calculate progress
    // --------------------------------------------------------

    roadmap.progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    // --------------------------------------------------------
    // Check whether everything is completed
    // --------------------------------------------------------

    const allDaysCompleted =
      roadmap.days.length > 0 &&
      roadmap.days.every(
        (roadmapDay) => roadmapDay.completed
      );

    if (allDaysCompleted) {
      roadmap.status = "completed";
    }

    // --------------------------------------------------------
    // Save
    // --------------------------------------------------------

    await roadmap.save();

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      message: "Task completion updated",

      analysisId: String(roadmap.analysisId),

      day: day,

      taskIndex: index,

      taskCompleted:
        roadmap.days
          .find((item) => item.day === day)
          ?.tasks[index]?.completed ?? false,

      progress: roadmap.progress,

      dayCompleted:
        roadmap.days.find(
          (item) => item.day === day
        )?.completed ?? false,

      status: roadmap.status,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// COMPLETE DAY
// ============================================================

export async function completeDay(
  req: Request,
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

    const { analysisId, dayNumber } = req.params;

    // --------------------------------------------------------
    // Validate analysisId
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
      });
      return;
    }

    const day = Number(dayNumber);

    if (!Number.isInteger(day) || day < 1) {
      res.status(400).json({
        message: "Invalid day number",
      });
      return;
    }

    // --------------------------------------------------------
    // Find exact roadmap
    // --------------------------------------------------------

    const roadmap = await Roadmap.findOne({
      analysisId,
      userId: req.userId,
      status: "active",
    });

    if (!roadmap) {
      res.status(404).json({
        message: "Active roadmap not found",
      });
      return;
    }

    // --------------------------------------------------------
    // Find day
    // --------------------------------------------------------

    const dayData = roadmap.days.find(
      (item) => item.day === day
    );

    if (!dayData) {
      res.status(404).json({
        message: `Day ${day} not found`,
      });
      return;
    }

    // --------------------------------------------------------
    // Complete all tasks
    // --------------------------------------------------------

    dayData.tasks.forEach((task) => {
      task.completed = true;
    });

    dayData.completed = true;

    // --------------------------------------------------------
    // Calculate progress
    // --------------------------------------------------------

    const totalTasks = roadmap.days.reduce(
      (total, roadmapDay) =>
        total + roadmapDay.tasks.length,
      0
    );

    const completedTasks = roadmap.days.reduce(
      (total, roadmapDay) =>
        total +
        roadmapDay.tasks.filter(
          (task) => task.completed
        ).length,
      0
    );

    roadmap.progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    // --------------------------------------------------------
    // Check all days
    // --------------------------------------------------------

    const allDaysCompleted =
      roadmap.days.length > 0 &&
      roadmap.days.every(
        (roadmapDay) => roadmapDay.completed
      );

    if (allDaysCompleted) {
      roadmap.status = "completed";
    }

    // --------------------------------------------------------
    // Save
    // --------------------------------------------------------

    await roadmap.save();

    res.json({
      message: "Day completed successfully",

      analysisId: String(roadmap.analysisId),

      day,

      progress: roadmap.progress,

      status: roadmap.status,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// GET ROADMAP PROGRESS
// ============================================================

export async function getProgress(
  req: Request,
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

    const { analysisId } = req.params;

    // --------------------------------------------------------
    // Validate analysisId
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      res.status(400).json({
        message: "Invalid analysisId",
      });
      return;
    }

    // --------------------------------------------------------
    // Find exact roadmap
    // --------------------------------------------------------

    const roadmap = await Roadmap.findOne({
      analysisId,
      userId: req.userId,
    }).lean();

    if (!roadmap) {
      res.status(404).json({
        message: "Roadmap not found",
      });
      return;
    }

    // --------------------------------------------------------
    // Completed days
    // --------------------------------------------------------
    
    const completedDays = roadmap.days
      .filter((day) => day.completed)
      .map((day) => day.day);

    // --------------------------------------------------------
    // Completed tasks
    // --------------------------------------------------------

    const completedTasks: Record<
      string,
      number[]
    > = {};

    roadmap.days.forEach((day) => {
      completedTasks[String(day.day)] =
        day.tasks
          .map((task, index) =>
            task.completed ? index : -1
          )
          .filter((index) => index !== -1);
    });

    // --------------------------------------------------------
    // Total tasks
    // --------------------------------------------------------

    const totalTasks = roadmap.days.reduce(
      (total, day) =>
        total + day.tasks.length,
      0
    );

    // --------------------------------------------------------
    // Completed task count
    // --------------------------------------------------------

    const completedTaskCount =
      roadmap.days.reduce(
        (total, day) =>
          total +
          day.tasks.filter(
            (task) => task.completed
          ).length,
        0
      );

    // --------------------------------------------------------
    // Progress percentage
    // --------------------------------------------------------

    const progressPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTaskCount / totalTasks) * 100
          );

    // --------------------------------------------------------
    // Current day
    // --------------------------------------------------------

    const currentDay =
      roadmap.days.find(
        (day) => !day.completed
      )?.day ?? roadmap.totalDays;

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    res.json({
      analysisId: String(roadmap.analysisId),

      completedDays,

      completedTasks,

      totalDays: roadmap.totalDays,

      completedCount:
        completedDays.length,

      progressPercentage,

      currentDay,
    });
  } catch (error) {
    next(error);
  }
}