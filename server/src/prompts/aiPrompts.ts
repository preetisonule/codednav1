import { AnalysisResult } from '../types';

/**
 * Prompt templates for AI-powered insight generation.
 * Kept separate from the AI service so prompt iteration never touches
 * provider wiring, and so the same prompt can be reused across providers.
 */
export function buildInsightsPrompt(analysis: AnalysisResult): string {
  const { profile, developerScore, languageBreakdown, detectedSkills, topRepository } = analysis;

  const skillsList = detectedSkills.map((s) => `${s.name} (${Math.round(s.confidence * 100)}%)`).join(', ') || 'none detected';
  const langList = languageBreakdown.map((l) => `${l.language} ${l.percentage}%`).join(', ') || 'unknown';

  return `You are a senior technical career coach evaluating a software engineer's GitHub profile.

Profile: ${profile.login} (${profile.public_repos} public repos, ${profile.followers} followers)
Developer Score: ${developerScore.total}/100
Top language mix: ${langList}
Detected skills/practices: ${skillsList}
Top repository: ${topRepository ? `${topRepository.name} (${topRepository.stargazers_count} stars)` : 'none'}

Return a JSON object with keys: strengths (string[]), weaknesses (string[]),
engineeringLevel ("Beginner"|"Intermediate"|"Advanced"|"Senior"), suggestedRole (string),
resumeSummary (string, 2-3 sentences), interviewReadiness ({ score: 0-100, notes: string[] }),
learningRoadmap (array of { stage, timeframe, technologies[], projects[], certifications[], estimatedImprovement }).
Respond with JSON only, no markdown fences.`;
}
