import type { RoadmapDay } from "../../types/readiness";

interface Props {
  day: RoadmapDay;
}

export default function RoadmapDayCard({ day }: Props) {
  return (
    <div className="relative md:pl-14">

      {/* Timeline number */}
      <div className="absolute left-0 top-4 hidden h-10 w-10 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-sm font-bold text-blue-400 md:flex">
        {day.day}
      </div>

      {/* Day card */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              {/* Mobile day badge */}
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 md:hidden">
                Day {day.day}
              </span>

              <h3 className="text-xl font-semibold text-white">
                Day {day.day}
              </h3>
            </div>

            <p className="mt-1 text-sm text-gray-400">
              Focus:{" "}
              <span className="text-gray-200">
                {day.focus}
              </span>
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {day.tasks.length}{" "}
            {day.tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {/* Tasks */}
        <div className="mt-5 space-y-4">

          {day.tasks.map((task, index) => (
            <div
              key={`${day.day}-${index}`}
              className="rounded-xl border border-gray-800 bg-gray-950 p-5"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                {/* Task information */}
                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h4 className="font-semibold text-white">
                      {task.title}
                    </h4>

                    <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">
                      {task.category}
                    </span>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {task.description}
                  </p>

                </div>

                {/* Estimated hours */}
                <div className="shrink-0 rounded-lg border border-gray-800 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-white">
                    {task.estimatedHours}h
                  </p>

                  <p className="text-xs text-gray-500">
                    estimated
                  </p>
                </div>

              </div>

              {/* Completion */}
              <label className="mt-4 flex cursor-pointer items-center gap-3 border-t border-gray-800 pt-4">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm text-gray-400">
                  Mark task as completed
                </span>

              </label>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}