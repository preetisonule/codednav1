import type {
  AnalysisResult,
  ResumeAnalysis,
  LeetCodeAnalysis,
} from "../types";

interface ReadinessInput {
  github: AnalysisResult | null;
  resume: ResumeAnalysis | null;
  leetcode: LeetCodeAnalysis | null;
}

export interface ReadinessResult {
  overallScore: number;

  status:
    | "Not Ready"
    | "Needs Improvement"
    | "Almost Ready"
    | "Interview Ready";

  categoryScores: {
    github: number;
    resume: number;
    leetcode: number;
    projects: number;
    professionalProfile: number;
  };

  recommendations: string[];
}

export function calculateInterviewReadiness({
  github,
  resume,
  leetcode,
}: ReadinessInput): ReadinessResult {
  const githubScore = github?.developerScore.total ?? 0;
  const resumeScore = resume?.score ?? 0;
  const leetcodeScore = leetcode?.score ?? 0;

  /*
   * Project Score
   */

  let projectScore = 0;

  if (github) {
    const repoScore = Math.min(github.repoCount * 4, 40);

    const starScore = Math.min(github.totalStars * 2, 20);

    const skillScore = Math.min(
      github.detectedSkills.length * 5,
      20
    );

    const topProjectScore = github.topRepository
      ? 20
      : 0;

    projectScore = Math.min(
      repoScore +
        starScore +
        skillScore +
        topProjectScore,
      100
    );
  }

  /*
   * Professional Profile Score
   */

  let professionalProfileScore = 0;

  if (github) {
    const profile = github.profile;

    if (profile.name) professionalProfileScore += 20;
    if (profile.bio) professionalProfileScore += 20;
    if (profile.location) professionalProfileScore += 10;
    if (profile.company) professionalProfileScore += 15;
    if (profile.blog) professionalProfileScore += 15;
    if (profile.email) professionalProfileScore += 10;

    if (profile.followers > 0) {
      professionalProfileScore += 10;
    }
  }

  professionalProfileScore = Math.min(
    professionalProfileScore,
    100
  );

  /*
   * Overall Score
   *
   * When LeetCode is available:
   *
   * GitHub       25%
   * Resume       25%
   * LeetCode     25%
   * Projects     15%
   * Profile      10%
   */

  let overallScore: number;

  if (leetcode) {
    overallScore = Math.round(
      githubScore * 0.25 +
        resumeScore * 0.25 +
        leetcodeScore * 0.25 +
        projectScore * 0.15 +
        professionalProfileScore * 0.10
    );
  } else {
    /*
     * Fallback when LeetCode isn't provided.
     */

    overallScore = Math.round(
      githubScore * 0.30 +
        resumeScore * 0.30 +
        projectScore * 0.20 +
        professionalProfileScore * 0.20
    );
  }

  /*
   * Readiness Status
   */

  let status: ReadinessResult["status"];

  if (overallScore < 40) {
    status = "Not Ready";
  } else if (overallScore < 60) {
    status = "Needs Improvement";
  } else if (overallScore < 80) {
    status = "Almost Ready";
  } else {
    status = "Interview Ready";
  }

  /*
   * Recommendations
   */

  const recommendations: string[] = [];

  if (githubScore < 60) {
    recommendations.push(
      "Improve your GitHub profile and maintain more high-quality projects."
    );
  }

  if (resumeScore < 70) {
    recommendations.push(
      "Improve your resume structure, achievements and project descriptions."
    );
  }

  if (leetcode && leetcodeScore < 70) {
    recommendations.push(
      "Increase your DSA practice, especially Medium and Hard problems."
    );
  }

  if (projectScore < 60) {
    recommendations.push(
      "Build stronger real-world projects with meaningful functionality."
    );
  }

  if (professionalProfileScore < 60) {
    recommendations.push(
      "Improve your professional profile with stronger profile information and links."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your profile is looking strong. Focus on interview practice and system design."
    );
  }

  return {
    overallScore,
    status,

    categoryScores: {
      github: githubScore,
      resume: resumeScore,
      leetcode: leetcodeScore,
      projects: projectScore,
      professionalProfile: professionalProfileScore,
    },

    recommendations,
  };
}