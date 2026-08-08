import type { LeetCodeStats } from "../types";

export function calculateLeetCodeScore(
  stats: LeetCodeStats
): number {
  let score = 0;

  // Total solved — maximum 40 points
  score += Math.min(stats.totalSolved * 0.4, 40);

  // Medium problems — maximum 25 points
  score += Math.min(stats.mediumSolved * 0.5, 25);

  // Hard problems — maximum 20 points
  score += Math.min(stats.hardSolved * 2, 20);

  // Contest rating — maximum 15 points
  if (stats.contestRating) {
    score += Math.min(
      Math.max((stats.contestRating - 1200) / 40, 0),
      15
    );
  }

  return Math.round(Math.min(score, 100));
}