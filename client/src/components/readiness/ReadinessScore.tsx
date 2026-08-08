import type { ReadinessResult } from "../../types/readiness";

interface Props {
  readiness: ReadinessResult;
}

export default function ReadinessScore({ readiness }: Props) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
      <p className="text-sm text-gray-400">
        Interview Readiness
      </p>

      <div className="mt-4 text-6xl font-bold text-white">
        {readiness.overallScore}
        <span className="text-2xl text-gray-500">
          /100
        </span>
      </div>

      <p className="mt-3 text-lg font-semibold text-yellow-400">
        {readiness.status}
      </p>
    </div>
  );
}