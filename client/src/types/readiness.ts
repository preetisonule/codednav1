export type TargetRole =
  | "Software Engineer"
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Full Stack Engineer";

export interface CategoryScores {
  github: number;
  resume: number;
  leetcode: number;
  projects: number;
  professionalProfile: number;
}

export interface ReadinessResult {
  overallScore: number;

  status:
    | "Not Ready"
    | "Needs Improvement"
    | "Almost Ready"
    | "Interview Ready";

  categoryScores: CategoryScores;

  recommendations: string[];
}

export interface SkillGap {
  skill: string;

  category:
    | "DSA"
    | "Frontend"
    | "Backend"
    | "Database"
    | "Cloud"
    | "System Design"
    | "Projects"
    | "Resume"
    | "GitHub";

  currentLevel:
    | "Strong"
    | "Moderate"
    | "Weak"
    | "Missing";

  priority:
    | "High"
    | "Medium"
    | "Low";

  score: number;

  reason: string;

  recommendedAction: string;
}

export interface RoadmapTask {
  title: string;
  description: string;
  estimatedHours: number;
  category: string;
}

export interface RoadmapDay {
  day: number;
  focus: string;
  tasks: RoadmapTask[];
}

export interface Roadmap {
  targetRole: TargetRole;
  totalDays: number;
  days: RoadmapDay[];
}

/*
 * GitHub
 */

export interface GithubAnalysis {
  profile: {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;

    public_repos: number;
    followers: number;
    following: number;

    location: string | null;
    company: string | null;
    blog: string | null;
    email: string | null;
  };

  repoCount: number;
  totalStars: number;
  totalForks: number;

  mostUsedLanguage: string | null;

  languageBreakdown: {
    language: string;
    count: number;
    percentage: number;
  }[];

  developerScore: {
    total: number;
    repositoryScore: number;
    starScore: number;
    forkScore: number;
    modernStackBonus: number;
    consistencyScore: number;
  };
}

/*
 * Resume
 */

export interface ResumeAnalysis {
  score: number;

  skills: string[];

  sections: {
    education: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    achievements: boolean;
    certifications: boolean;
  };

  strengths: string[];

  weaknesses: string[];
}

/*
 * LeetCode
 */

export interface LeetCodeAnalysis {
  username: string;
  available: boolean;

  score: number;

  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    acceptanceRate: number;
    ranking: number;
    contestRating: number;
  };

  strengths: string[];

  weaknesses: string[];
}

/*
 * Complete API response
 */

export interface ReadinessResponse {
  targetRole: TargetRole;

  preparationDays: number;

  readiness: ReadinessResult;

  skillGaps: SkillGap[];

  roadmap: Roadmap;

  github: GithubAnalysis | null;

  resume: ResumeAnalysis | null;

  leetcode: LeetCodeAnalysis | null;
}