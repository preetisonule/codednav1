import ReadinessScore from "../components/readiness/ReadinessScore";
import CategoryScores from "../components/readiness/CategoryScores";
import SkillGaps from "../components/readiness/SkillGaps";
import Roadmap from "../components/readiness/Roadmap";
import type { ReadinessResponse } from "../types/readiness";

interface Props {
  data: ReadinessResponse;
}

export default function ReadinessPage({ data }: Props) {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 ">
      <div className="mx-auto max-w-7xl min-w-6xl space-y-8">

        <div>
<<<<<<< HEAD
=======

>>>>>>> e1d888ebcff29f6ad1f5cf45f279abce81117494
          <h1 className="mt-2 text-4xl font-bold text-white">
            Interview Readiness
          </h1>

          <p className="mt-2 text-gray-400">
            Target role: {data.targetRole}
          </p>
        </div>

        <ReadinessScore
          readiness={data.readiness}
        />

        <CategoryScores
          scores={data.readiness.categoryScores}
        />

        <SkillGaps
          gaps={data.skillGaps}
        />
        <Roadmap roadmap={data.roadmap} />

      </div>
    </main>
  );
}