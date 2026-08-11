import ProgressBar from "../components/roadmap/ProgressBar";
import DayCard from "../components/roadmap/DayCard";
import { useRoadmapProgress } from "../hooks/useRoadmapProgress";

interface Props {
  analysisId: string;
}

export default function RoadmapProgress({
  analysisId,
}: Props) {
  const {
    progress,
    loading,
    error,
    completeDay,
  } = useRoadmapProgress(analysisId);

  if (loading && !progress) {
    return (
      <div className="p-8 text-white">
        Loading roadmap progress...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400">
        {error}
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Your Roadmap
        </h1>

        <p className="mt-2 text-gray-400">
          Keep going. You're making progress!
        </p>
      </div>

      {/* Progress */}

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <ProgressBar
          percentage={
            progress.progressPercentage
          }
        />

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {progress.completedCount}
            </p>

            <p className="text-sm text-gray-400">
              Completed
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">
              {progress.totalDays}
            </p>

            <p className="text-sm text-gray-400">
              Total Days
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">
              {progress.currentDay}
            </p>

            <p className="text-sm text-gray-400">
              Current Day
            </p>
          </div>
        </div>
      </div>

      {/* Days */}

      <div className="space-y-4">
        {Array.from(
          { length: progress.totalDays },
          (_, index) => {
            const dayNumber = index + 1;

            return (
              <DayCard
                key={dayNumber}
                dayNumber={dayNumber}
                completed={progress.completedDays.includes(
                  dayNumber
                )}
                onComplete={() =>
                  completeDay(dayNumber)
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}