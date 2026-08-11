import ReadinessScore from "../components/readiness/ReadinessScore";
import CategoryScores from "../components/readiness/CategoryScores";
import SkillGaps from "../components/readiness/SkillGaps";
import Roadmap from "../components/readiness/Roadmap";
import ParticleText from "../components/readiness/ParticleText";
import GradientWaves from "../components/readiness/GradientWaves";
import type { ReadinessResponse } from "../types/readiness";

interface Props {
  data: ReadinessResponse;
}

export default function ReadinessPage({ data }: Props) {
  return (
    
    <main className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Gradient Waves Background - positioned behind everything */}
      {/* <div className="fixed inset-0 z-0"> <GradientWaves /> </div> */}

      {/* Content - positioned above the waves */}
      <div className="relative z-10 px-6 py-10">
        <div className="mx-auto max-w-7xl min-w-6xl space-y-8">
          {/* Particle Text Heading */}
          <div>
            {/* <ParticleText/> */}
            
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
      </div>
    </main>
  );
}