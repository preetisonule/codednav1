import { DetectedSkill, GithubRepo } from '../types';

/**
 * RULE ENGINE
 * -----------
 * Scans repo names, descriptions, topics, and languages for keyword signals
 * and turns them into a de-duplicated, confidence-scored skill list.
 *
 * This is intentionally a plain keyword/heuristic engine (no ML) so it is
 * fast, deterministic, and free to run on every request. It is the layer
 * the AI service reads from — the AI never has to re-derive raw signals.
 */

interface Rule {
  name: string;
  category: DetectedSkill['category'];
  keywords: string[];
}

const RULES: Rule[] = [
  { name: 'React', category: 'framework', keywords: ['react', 'jsx', 'tsx', 'next.js', 'nextjs'] },
  { name: 'Node.js', category: 'framework', keywords: ['node', 'nodejs', 'node.js'] },
  { name: 'Express', category: 'framework', keywords: ['express', 'expressjs'] },
  { name: 'MongoDB', category: 'infra', keywords: ['mongodb', 'mongoose', 'mongo'] },
  { name: 'Docker', category: 'infra', keywords: ['docker', 'dockerfile', 'container'] },
  { name: 'AWS', category: 'infra', keywords: ['aws', 'amazon-web-services', 's3', 'lambda', 'ec2'] },
  { name: 'Python', category: 'language', keywords: ['python', 'py', 'django', 'flask', 'fastapi'] },
  { name: 'Java', category: 'language', keywords: ['java', 'spring', 'springboot'] },
  { name: 'C++', category: 'language', keywords: ['c++', 'cpp'] },
  { name: 'TypeScript', category: 'language', keywords: ['typescript', 'ts'] },
  { name: 'GraphQL', category: 'framework', keywords: ['graphql', 'apollo'] },
  { name: 'Redis', category: 'infra', keywords: ['redis'] },
  { name: 'JWT', category: 'practice', keywords: ['jwt', 'jsonwebtoken'] },
  { name: 'Authentication', category: 'practice', keywords: ['auth', 'authentication', 'oauth', 'passport'] },
  { name: 'Testing', category: 'practice', keywords: ['test', 'jest', 'mocha', 'cypress', 'vitest', 'testing-library'] },
  { name: 'CI/CD', category: 'practice', keywords: ['ci', 'cd', 'github-actions', 'circleci', 'jenkins', 'pipeline'] },
];

function textCorpusForRepo(repo: GithubRepo): string {
  return [repo.name, repo.description ?? '', ...(repo.topics ?? []), repo.language ?? '']
    .join(' ')
    .toLowerCase();
}

/**
 * Detects technologies/practices across a user's repositories.
 * Confidence = (repos matching this rule) / (total non-fork repos), capped at 1.
 */
export function detectSkills(repos: GithubRepo[]): DetectedSkill[] {
  const relevantRepos = repos.filter((r) => !r.fork);
  if (relevantRepos.length === 0) return [];

  const corpora = relevantRepos.map(textCorpusForRepo);

  const detected: DetectedSkill[] = RULES.map((rule) => {
    const matches = corpora.filter((corpus) =>
      rule.keywords.some((kw) => corpus.includes(kw))
    ).length;

    return {
      name: rule.name,
      category: rule.category,
      confidence: Number((matches / relevantRepos.length).toFixed(2)),
    };
  }).filter((skill) => skill.confidence > 0);

  return detected.sort((a, b) => b.confidence - a.confidence);
}

/** Modern-stack keywords used as a scoring bonus in the Developer Score. */
export const MODERN_STACK_SKILLS = new Set([
  'React',
  'TypeScript',
  'GraphQL',
  'Docker',
  'AWS',
  'Redis',
  'CI/CD',
  'Testing',
]);
