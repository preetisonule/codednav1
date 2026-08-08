import type { CategoryScores as CategoryScoresType } from "../../types/readiness";

interface Props {
  scores: CategoryScoresType;
}

export default function CategoryScores({ scores }: Props) {
  const categories = [
    {
      name: "GitHub",
      value: scores.github,
    },
    {
      name: "Resume",
      value: scores.resume,
    },
    {
      name: "LeetCode",
      value: scores.leetcode,
    },
    {
      name: "Projects",
      value: scores.projects,
    },
    {
      name: "Professional Profile",
      value: scores.professionalProfile,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((category) => (
        <div
          key={category.name}
          className="rounded-xl border border-gray-800 bg-gray-900 p-5"
        >
          <p className="text-sm text-gray-400">
            {category.name}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {category.value}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{
                width: `${category.value}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}