import { useState } from "react";
import { getReadiness } from "../../services/api";
import type { ReadinessResponse } from "../../types/readiness";

interface Props {
  onSuccess: (data: ReadinessResponse) => void;
}

export default function ReadinessForm({ onSuccess }: Props) {
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [preparationDays, setPreparationDays] = useState(30);
  const [resume, setResume] = useState<File | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!githubUsername.trim()) {
      setError("GitHub username is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getReadiness({
        githubUsername: githubUsername.trim(),
        leetcodeUsername: leetcodeUsername.trim() || undefined,
        targetRole,
        preparationDays,
        resume,
      });

      onSuccess(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">
          Analyze Your Profile
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Get your personalized interview readiness score.
        </p>
      </div>

      {/* GitHub */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          GitHub Username
        </label>

        <input
          type="text"
          value={githubUsername}
          onChange={(e) =>
            setGithubUsername(e.target.value)
          }
          placeholder="e.g. preetisonule"
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* LeetCode */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          LeetCode Username
        </label>

        <input
          type="text"
          value={leetcodeUsername}
          onChange={(e) =>
            setLeetcodeUsername(e.target.value)
          }
          placeholder="e.g. preetisonule3186"
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Target Role */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Target Role
        </label>

        <select
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option>Software Engineer</option>
          <option>Frontend Engineer</option>
          <option>Backend Engineer</option>
          <option>Full Stack Engineer</option>
        </select>
      </div>

      {/* Preparation Days */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Preparation Days
        </label>

        <input
          type="number"
          min={1}
          max={365}
          value={preparationDays}
          onChange={(e) =>
            setPreparationDays(Number(e.target.value))
          }
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Resume */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Resume
          <span className="ml-2 text-gray-500">
            (optional)
          </span>
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setResume(
              e.target.files?.[0]
            )
          }
          className="block w-full text-sm text-gray-400"
        />
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Analyzing..."
          : "Analyze My Readiness"}
      </button>
    </form>
  );
}