import type { SkillGap } from "../../types/readiness";

interface Props {
  gaps: SkillGap[];
}

export default function SkillGaps({ gaps }: Props) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">
          Skill Gaps
        </h2>

        <p className="text-sm text-gray-400">
          Areas you should focus on before interviews.
        </p>
      </div>

      <div className="space-y-4">
        {gaps.map((gap) => (
          <div
            key={gap.skill}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {gap.skill}
                </h3>

                <p className="text-sm text-gray-400">
                  {gap.category}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {gap.currentLevel}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    gap.priority === "High"
                      ? "bg-red-500/20 text-red-400"
                      : gap.priority === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {gap.priority}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-400">
                <span>Skill score</span>
                <span>{gap.score}/100</span>
              </div>

              <div className="h-2 rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${gap.score}%`,
                  }}
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              {gap.reason}
            </p>

            <div className="mt-3 rounded-lg bg-gray-800/50 p-3">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">
                  Recommended:
                </span>{" "}
                {gap.recommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}