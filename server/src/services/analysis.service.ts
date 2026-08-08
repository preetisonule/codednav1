import {
  AnalysisResult,
  DeveloperScoreBreakdown,
  GithubRepo,
  GithubUser,
  LanguageBreakdown,
} from '../types';
import { detectSkills, MODERN_STACK_SKILLS } from '../utils/ruleEngine';

/**
 * ANALYSIS ENGINE
 * ---------------
 * Pure functions that turn raw GitHub API data into the derived metrics
 * the dashboard renders: language distribution, top repo, totals, and the
 * composite Developer Score. Kept side-effect free and framework-agnostic
 * so it can be unit tested without mocking HTTP.
 */

function buildLanguageBreakdown(repos: GithubRepo[]): LanguageBreakdown[] {
  const counts = new Map<string, number>();

  repos
    .filter((r) => !r.fork && r.language)
    .forEach((r) => {
      const lang = r.language as string;
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    });

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .map(([language, count]) => ({
      language,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);
}

function findTopRepository(repos: GithubRepo[]): GithubRepo | null {
  const nonForks = repos.filter((r) => !r.fork);
  if (nonForks.length === 0) return null;

  return nonForks.reduce((best, current) =>
    current.stargazers_count > best.stargazers_count ? current : best
  );
}

/**
 * DEVELOPER SCORE (0-100)
 * ------------------------
 * repositoryScore   — up to 25 pts, log-scaled by non-fork repo count
 * starScore         — up to 30 pts, log-scaled by total stars
 * forkScore         — up to 15 pts, log-scaled by total forks received
 * modernStackBonus  — up to 20 pts, based on modern-stack skill coverage
 * consistencyScore  — up to 10 pts, rewards repos updated in the last year
 *
 * Log scaling is used throughout so a handful of extra stars/repos doesn't
 * swing the score wildly — it rewards sustained output over single spikes.
 */
function calculateDeveloperScore(
  repos: GithubRepo[],
  totalStars: number,
  totalForks: number
): DeveloperScoreBreakdown {
  const nonForks = repos.filter((r) => !r.fork);

  const repositoryScore = Math.min(25, Math.round(Math.log2(nonForks.length + 1) * 7));
  const starScore = Math.min(30, Math.round(Math.log2(totalStars + 1) * 6));
  const forkScore = Math.min(15, Math.round(Math.log2(totalForks + 1) * 5));

  const skills = detectSkills(repos);
  const modernMatches = skills.filter((s) => MODERN_STACK_SKILLS.has(s.name));
  const modernStackBonus = Math.min(
    20,
    Math.round(modernMatches.reduce((sum, s) => sum + s.confidence, 0) * 8)
  );

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const recentlyActive = nonForks.filter(
    (r) => new Date(r.pushed_at).getTime() > oneYearAgo
  ).length;
  const consistencyScore =
    nonForks.length === 0 ? 0 : Math.min(10, Math.round((recentlyActive / nonForks.length) * 10));

  const total = Math.min(
    100,
    repositoryScore + starScore + forkScore + modernStackBonus + consistencyScore
  );

  return { total, repositoryScore, starScore, forkScore, modernStackBonus, consistencyScore };
}

export function analyzeProfile(profile: GithubUser, repos: GithubRepo[]): AnalysisResult {
  const nonForks = repos.filter((r) => !r.fork);
  const totalStars = nonForks.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = nonForks.reduce((sum, r) => sum + r.forks_count, 0);
  const languageBreakdown = buildLanguageBreakdown(repos);

  return {
    profile,
    repoCount: profile.public_repos,
    totalStars,
    totalForks,
    languageBreakdown,
    mostUsedLanguage: languageBreakdown[0]?.language ?? null,
    topRepository: findTopRepository(repos),
    detectedSkills: detectSkills(repos),
    developerScore: calculateDeveloperScore(repos, totalStars, totalForks),
  };
}
