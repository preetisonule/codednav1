interface Props {
  percentage: number;
}

export default function ProgressBar({
  percentage,
}: Props) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-400">
          Roadmap Progress
        </span>

        <span className="font-semibold text-white">
          {percentage}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}