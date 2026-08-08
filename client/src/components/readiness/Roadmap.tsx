import type { Roadmap as RoadmapType } from "../../types/readiness";
import RoadmapDayCard from "./RoadmapDayCard";

interface RoadmapProps {
  roadmap: RoadmapType;
}

export default function Roadmap({ roadmap }: RoadmapProps) {
  return (
    <section className="mt-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Personalized Roadmap
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {roadmap.totalDays}-Day Preparation Plan
        </h2>

        <p className="mt-2 text-gray-400">
          Target role:{" "}
          <span className="font-medium text-gray-200">
            {roadmap.targetRole}
          </span>
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-800 md:block" />

        <div className="space-y-6">
          {roadmap.days.map((day) => (
            <RoadmapDayCard
              key={day.day}
              day={day}
            />
          ))}
        </div>
      </div>
    </section>
  );
}