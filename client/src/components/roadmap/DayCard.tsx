interface Props {
  dayNumber: number;
  completed: boolean;
  onComplete: () => void;
}

export default function DayCard({
  dayNumber,
  completed,
  onComplete,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div>
        <p className="text-sm text-gray-400">
          Day {dayNumber}
        </p>

        <h3 className="text-lg font-semibold text-white">
          Day {dayNumber} Tasks
        </h3>
      </div>

      {completed ? (
        <span className="rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400">
          ✓ Completed
        </span>
      ) : (
        <button
          onClick={onComplete}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Complete Day
        </button>
      )}
    </div>
  );
}