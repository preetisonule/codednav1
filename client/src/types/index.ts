export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
}

export interface LanguageBreakdown {
  language: string;
  count: number;
  percentage: number;
}

export interface DetectedSkill {
  name: string;
  category: 'framework' | 'language' | 'infra' | 'practice';
  confidence: number;
}

export interface DeveloperScoreBreakdown {
  total: number;
  repositoryScore: number;
  starScore: number;
  forkScore: number;
  modernStackBonus: number;
  consistencyScore: number;
}

export interface RoadmapStage {
  stage: string;
  timeframe: string;
  technologies: string[];
  projects: string[];
  certifications: string[];
  estimatedImprovement: string;
}

export interface AIInsights {
  strengths: string[];
  weaknesses: string[];
  engineeringLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior';
  suggestedRole: string;
  resumeSummary: string;
  interviewReadiness: {
    score: number;
    notes: string[];
  };
  learningRoadmap: RoadmapStage[];
}

export interface AnalysisResult {
  profile: GithubUser;
  repoCount: number;
  totalStars: number;
  totalForks: number;
  languageBreakdown: LanguageBreakdown[];
  mostUsedLanguage: string | null;
  topRepository: GithubRepo | null;
  detectedSkills: DetectedSkill[];
  developerScore: DeveloperScoreBreakdown;
  insights: AIInsights;
}

export interface ApiErrorShape {
  status: number;
  message: string;
  code: string;
}
