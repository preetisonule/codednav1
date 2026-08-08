import type { LeetCodeAnalysis } from "../types";
import { getLeetCodeStats } from "./leetcode.service";
import { calculateLeetCodeScore } from "../utils/leetcodeScore";

export async function analyzeLeetCode(
  username: string
): Promise<LeetCodeAnalysis | null> {
  const stats = await getLeetCodeStats(username);

  if (!stats) {
    return null;
  }

  const score = calculateLeetCodeScore(stats);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (stats.totalSolved >= 150) {
    strengths.push("Strong problem-solving practice");
  } else {
    weaknesses.push(
      "Increase the number of problems solved"
    );
  }

  if (stats.mediumSolved >= 50) {
    strengths.push(
      "Good Medium-level problem-solving experience"
    );
  } else {
    weaknesses.push(
      "Practice more Medium-level problems"
    );
  }

  if (stats.hardSolved >= 10) {
    strengths.push(
      "Experience with Hard-level problems"
    );
  } else {
    weaknesses.push(
      "Practice some Hard-level problems"
    );
  }

  return {
    username,
    available: true,
    score,
    stats,
    strengths,
    weaknesses,
  };
}