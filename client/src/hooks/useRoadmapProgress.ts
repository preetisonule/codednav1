import { useCallback, useEffect, useState } from "react";

import {
  roadmapApi,
  type RoadmapProgressResponse,
} from "../services/api";

export function useRoadmapProgress(
  analysisId: string | null
) {
  const [progress, setProgress] =
    useState<RoadmapProgressResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!analysisId) {
      setProgress(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await roadmapApi.getProgress(analysisId);

      setProgress(data);
    } catch (error) {
      /*
       * A 404 simply means the roadmap has not
       * been imported yet.
       *
       * This is NOT a fatal error.
       */
      if (
        error instanceof Error &&
        [
          "no active roadmap",
          "active roadmap not found",
          "roadmap not found",
        ].some((msg) =>
          error.message.toLowerCase().includes(msg)
        )
      ) {
        setProgress(null);
        setError(null);
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load roadmap progress"
      );

      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const completeDay = async (
    dayNumber: number,
    completed = true
  ) => {
    if (!analysisId || !progress) return;

    try {
      setError(null);

      const data =
        await roadmapApi.completeDay(
          analysisId,
          dayNumber,
          completed
        );

      await fetchProgress();

      return data;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete day"
      );

      throw error;
    }
  };

  const completeTask = async (
    dayNumber: number,
    taskIndex: number,
    completed: boolean
  ) => {
    if (!analysisId || !progress) return;

    try {
      setError(null);

      const data =
        await roadmapApi.completeTask(
          analysisId,
          dayNumber,
          taskIndex,
          completed
        );

      await fetchProgress();

      return data;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete task"
      );

      throw error;
    }
  };

  return {
    progress,
    loading,
    error,
    completeDay,
    completeTask,
    refreshProgress: fetchProgress,
  };
}