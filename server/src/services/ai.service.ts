import { env } from '../config/env';
import { buildInsightsPrompt } from '../prompts/aiPrompts';
import { AIInsights, AnalysisResult, RoadmapStage } from '../types';

/**
 * AI SERVICE ABSTRACTION
 * -----------------------
 * Controllers depend only on `aiService.generateInsights(...)`. The
 * concrete provider (mock / OpenAI / Gemini / Claude) is chosen here based
 * on `AI_PROVIDER`, so swapping providers never touches a controller.
 *
 * Each provider implements the same `AIProvider` interface. Only the mock
 * provider is wired up today — the others are stubbed with the exact shape
 * they'll need (prompt + API call + JSON parse) so a real integration is a
 * drop-in, not a redesign.
 */
interface AIProvider {
  generateInsights(analysis: AnalysisResult): Promise<AIInsights>;
}

class MockAIProvider implements AIProvider {
  async generateInsights(analysis: AnalysisResult): Promise<AIInsights> {
    // Prompt is built even in mock mode so the mock output stays coupled
    // to real analysis data (see buildInsightsPrompt) rather than drifting.
    void buildInsightsPrompt(analysis);

    const { developerScore, detectedSkills, languageBreakdown, repoCount } = analysis;
    const skillNames = detectedSkills.map((s) => s.name);
    const hasTesting = skillNames.includes('Testing');
    const hasCI = skillNames.includes('CI/CD');
    const hasAuth = skillNames.includes('Authentication') || skillNames.includes('JWT');
    const topLang = languageBreakdown[0]?.language ?? 'multiple languages';

    const strengths: string[] = [];
    if (languageBreakdown.length >= 3) strengths.push(`Comfortable across a diverse stack (${languageBreakdown.slice(0, 3).map((l) => l.language).join(', ')})`);
    if (developerScore.starScore >= 15) strengths.push('Builds projects that attract real community attention');
    if (skillNames.includes('React')) strengths.push('Strong modern frontend fundamentals with React');
    if (hasCI) strengths.push('Understands CI/CD and automated delivery pipelines');
    if (strengths.length === 0) strengths.push('Consistent public shipping habit across repositories');

    const weaknesses: string[] = [];
    if (!hasTesting) weaknesses.push('Limited visible automated testing across public repositories');
    if (!hasCI) weaknesses.push('No strong CI/CD signal — pipelines are not yet part of the visible workflow');
    if (!hasAuth) weaknesses.push('Little evidence of authentication/authorization implementation experience');
    if (repoCount < 5) weaknesses.push('Small public portfolio makes it harder to evaluate breadth');
    if (weaknesses.length === 0) weaknesses.push('Could deepen system design write-ups alongside code');

    const engineeringLevel = scoreToLevel(developerScore.total);
    const suggestedRole = suggestRole(skillNames, topLang);

    return {
      strengths,
      weaknesses,
      engineeringLevel,
      suggestedRole,
      resumeSummary: `${engineeringLevel} software engineer with hands-on experience in ${topLang} and ${skillNames.slice(0, 3).join(', ') || 'core web technologies'}. Demonstrated ability to ship and maintain public projects, with a Developer Score of ${developerScore.total}/100 reflecting consistent output and growing engineering maturity.`,
      interviewReadiness: {
        score: Math.max(35, Math.min(95, developerScore.total - 5)),
        notes: [
          hasTesting ? 'Comfortable discussing test strategy and coverage' : 'Practice explaining testing trade-offs — this is a common gap area',
          hasCI ? 'Can speak to CI/CD pipeline design' : 'Prepare a story about deploying and automating a real project',
          'Ready for system-design questions scoped to project size shown on GitHub',
        ],
      },
      learningRoadmap: buildRoadmap(skillNames, engineeringLevel),
    };
  }
}

function scoreToLevel(score: number): AIInsights['engineeringLevel'] {
  if (score >= 80) return 'Senior';
  if (score >= 55) return 'Advanced';
  if (score >= 30) return 'Intermediate';
  return 'Beginner';
}

function suggestRole(skills: string[], topLang: string): string {
  if (skills.includes('React') && skills.includes('Node.js')) return 'Full Stack Engineer';
  if (skills.includes('React')) return 'Frontend Engineer';
  if (skills.includes('Node.js') || skills.includes('Express')) return 'Backend Engineer';
  if (skills.includes('Docker') || skills.includes('AWS')) return 'Platform / DevOps Engineer';
  return `${topLang} Software Engineer`;
}

function buildRoadmap(skills: string[], level: AIInsights['engineeringLevel']): RoadmapStage[] {
  const stages: RoadmapStage[] = [
    {
      stage: 'Foundation Hardening',
      timeframe: '0–4 weeks',
      technologies: skills.includes('Testing') ? ['Integration testing', 'CI pipelines'] : ['Unit testing (Jest/Vitest)', 'GitHub Actions'],
      projects: ['Add automated tests + CI to one existing repo'],
      certifications: [],
      estimatedImprovement: '+8–10 Developer Score points',
    },
    {
      stage: 'Depth in Core Stack',
      timeframe: '1–3 months',
      technologies: skills.includes('TypeScript') ? ['Advanced TypeScript generics', 'API design'] : ['TypeScript', 'REST/GraphQL API design'],
      projects: ['Ship a full-stack project with auth + persistence'],
      certifications: [],
      estimatedImprovement: '+10–15 Developer Score points',
    },
    {
      stage: 'Scale & Infrastructure',
      timeframe: '3–6 months',
      technologies: ['Docker', 'CI/CD pipelines', 'Cloud deployment (AWS/GCP)'],
      projects: ['Containerize a project and deploy with a real pipeline'],
      certifications: ['AWS Certified Cloud Practitioner'],
      estimatedImprovement: '+10 Developer Score points',
    },
  ];

  if (level === 'Advanced' || level === 'Senior') {
    stages.push({
      stage: 'Leadership & System Design',
      timeframe: '6–12 months',
      technologies: ['Distributed systems patterns', 'Observability (logging/metrics/tracing)'],
      projects: ['Write and publish an architecture decision record for a real project'],
      certifications: ['AWS Certified Solutions Architect'],
      estimatedImprovement: 'Positions for staff/lead-level interviews',
    });
  }

  return stages;
}

// --- Future providers (stubbed) -------------------------------------------
// Each would call its respective HTTP API with `buildInsightsPrompt(analysis)`
// and parse the JSON response into `AIInsights`, then be selected below.

class OpenAIProvider implements AIProvider {
  async generateInsights(): Promise<AIInsights> {
    throw new Error('OpenAI provider not yet implemented. Set AI_PROVIDER=mock, or implement this class using OPENAI_API_KEY.');
  }
}

class GeminiProvider implements AIProvider {
  async generateInsights(): Promise<AIInsights> {
    throw new Error('Gemini provider not yet implemented. Set AI_PROVIDER=mock, or implement this class using GEMINI_API_KEY.');
  }
}

class ClaudeProvider implements AIProvider {
  async generateInsights(): Promise<AIInsights> {
    throw new Error('Claude provider not yet implemented. Set AI_PROVIDER=mock, or implement this class using ANTHROPIC_API_KEY.');
  }
}

function resolveProvider(): AIProvider {
  switch (env.ai.provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'claude':
      return new ClaudeProvider();
    case 'mock':
    default:
      return new MockAIProvider();
  }
}

export const aiService = resolveProvider();
