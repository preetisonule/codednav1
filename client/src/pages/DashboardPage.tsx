import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  title: string;
  description: string;
  estimatedHours: number;
  category: string;
  completed: boolean;
}

interface Day {
  day: number;
  focus: string;
  tasks: Task[];
  completed: boolean;
}

interface RoadmapResponse {
  roadmap: {
    id: string;
    targetRole: string;
    totalDays: number;
    status: string;
    createdAt: string;
  };

  progress: number;
  totalTasks: number;
  completedTasks: number;
  totalDays: number;
  completedDays: number;
  currentDay: number;

  days: Day[];
}

export default function DashboardPage() {
  const [data, setData] =
    useState<RoadmapResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchRoadmap() {
      if (!token) {
        setError("Please log in to view your roadmap.");
        setLoading(false);
        return;
      }

      try {
        const response =
          await axios.get<RoadmapResponse>(
            "http://localhost:5000/api/roadmap/current",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setData(response.data);
      } catch (error) {
        console.error(error);
        setError(
          "No active roadmap found. Import one from the analysis page."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-950 text-white">
        Loading your roadmap...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-950 text-red-400">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-base-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-10">
          <p className="text-slate-400">
            Your preparation journey
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            {data.roadmap.targetRole}
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-slate-400">
              Overall Progress
            </p>

            <p className="text-3xl font-bold mt-2">
              {data.progress}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-slate-400">
              Current Day
            </p>

            <p className="text-3xl font-bold mt-2">
              Day {data.currentDay}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-slate-400">
              Completed Tasks
            </p>

            <p className="text-3xl font-bold mt-2">
              {data.completedTasks}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              of {data.totalTasks}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6">
            <p className="text-slate-400">
              Days Completed
            </p>

            <p className="text-3xl font-bold mt-2">
              {data.completedDays}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              of {data.totalDays}
            </p>
          </div>

        </div>

        {/* Progress bar */}

        <div className="bg-slate-900 rounded-xl p-6 mb-10">

          <div className="flex justify-between mb-3">
            <span>Roadmap Progress</span>

            <span className="text-slate-400">
              {data.progress}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-violet-500 transition-all"
              style={{
                width: `${data.progress}%`,
              }}
            />

          </div>

        </div>

        {/* Days */}

        <div className="space-y-6">

          {data.days.map((day) => (

            <div
              key={day.day}
              className={`rounded-xl border p-6 ${
                day.completed
                  ? "border-green-500/30 bg-green-500/5"
                  : day.day === data.currentDay
                  ? "border-violet-500/40 bg-violet-500/5"
                  : "border-slate-800 bg-slate-900"
              }`}
            >

              <div className="flex justify-between items-start mb-6">

                <div>

                  <p className="text-sm text-slate-400">
                    Day {day.day}
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    {day.focus}
                  </h2>

                </div>

                {day.completed && (
                  <span className="text-green-400">
                    ✓ Completed
                  </span>
                )}

                {!day.completed &&
                  day.day === data.currentDay && (
                    <span className="text-violet-400">
                      Current
                    </span>
                  )}

              </div>

              <div className="space-y-3">

                {day.tasks.map((task, index) => (

                  <div
                    key={index}
                    className="flex gap-4 items-start bg-slate-950/50 rounded-lg p-4"
                  >

                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="mt-1 w-5 h-5"
                    />

                    <div className="flex-1">

                      <div className="flex justify-between gap-4">

                        <h3
                          className={
                            task.completed
                              ? "line-through text-slate-500"
                              : "font-medium"
                          }
                        >
                          {task.title}
                        </h3>

                        <span className="text-xs text-slate-500">
                          {task.estimatedHours}h
                        </span>

                      </div>

                      <p className="text-sm text-slate-400 mt-1">
                        {task.description}
                      </p>

                      <span className="inline-block text-xs text-slate-500 mt-2">
                        {task.category}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}