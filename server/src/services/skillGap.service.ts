import type {
  AnalysisResult,
  ResumeAnalysis,
  LeetCodeAnalysis,
} from "../types";

export type TargetRole =
  | "Software Engineer"
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Full Stack Engineer";

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

  currentLevel: "Strong" | "Moderate" | "Weak" | "Missing";

  priority: "High" | "Medium" | "Low";

  score: number;

  reason: string;

  recommendedAction: string;
}

function createGap(
  skill: string,
  category: SkillGap["category"],
  currentLevel: SkillGap["currentLevel"],
  priority: SkillGap["priority"],
  score: number,
  reason: string,
  recommendedAction: string
): SkillGap {
  return {
    skill,
    category,
    currentLevel,
    priority,
    score,
    reason,
    recommendedAction,
  };
}

export function computeSkillGaps(
  targetRole: TargetRole,
  github: AnalysisResult | null,
  resume: ResumeAnalysis | null,
  leetcode: LeetCodeAnalysis | null
): SkillGap[] {
  const gaps: SkillGap[] = [];

  /*
   * ============================================
   * DSA
   * ============================================
   */

  if (leetcode) {
    const solved = leetcode.stats.totalSolved;
    const medium = leetcode.stats.mediumSolved;
    const hard = leetcode.stats.hardSolved;

    if (solved >= 150 && medium >= 50) {
      gaps.push(
        createGap(
          "Data Structures & Algorithms",
          "DSA",
          "Strong",
          "Low",
          85,
          "Strong LeetCode problem-solving activity.",
          "Maintain consistent practice and focus on timed interview problems."
        )
      );
    } else if (solved >= 75) {
      gaps.push(
        createGap(
          "Data Structures & Algorithms",
          "DSA",
          "Moderate",
          "Medium",
          60,
          "Good problem-solving foundation but more interview-level practice is needed.",
          "Increase Medium-level problems and practice timed sessions."
        )
      );
    } else {
      gaps.push(
        createGap(
          "Data Structures & Algorithms",
          "DSA",
          "Weak",
          "High",
          30,
          "Limited problem-solving practice detected.",
          "Build a consistent DSA routine covering arrays, strings, trees and graphs."
        )
      );
    }

    if (hard < 10) {
      gaps.push(
        createGap(
          "Advanced Problem Solving",
          "DSA",
          "Moderate",
          "Medium",
          50,
          "Limited Hard-level problem solving.",
          "Practice selected Hard problems after strengthening Medium-level patterns."
        )
      );
    }
  } else {
    gaps.push(
      createGap(
        "Data Structures & Algorithms",
        "DSA",
        "Missing",
        "High",
        0,
        "No LeetCode data was provided.",
        "Add a LeetCode profile and begin structured DSA practice."
      )
    );
  }

  /*
   * ============================================
   * GitHub
   * ============================================
   */

  if (github) {
    const repoCount = github.repoCount;
    const stars = github.totalStars;
    const skills = github.detectedSkills.length;

    if (repoCount >= 10 && skills >= 5) {
      gaps.push(
        createGap(
          "GitHub Portfolio",
          "GitHub",
          "Strong",
          "Low",
          80,
          "Good number of repositories and technical signals.",
          "Continue improving documentation and flagship projects."
        )
      );
    } else if (repoCount >= 5) {
      gaps.push(
        createGap(
          "GitHub Portfolio",
          "GitHub",
          "Moderate",
          "Medium",
          55,
          "Some project activity exists but portfolio depth can improve.",
          "Create 2-3 polished flagship repositories."
        )
      );
    } else {
      gaps.push(
        createGap(
          "GitHub Portfolio",
          "GitHub",
          "Weak",
          "High",
          25,
          "Limited repository activity detected.",
          "Build and publish meaningful projects related to your target role."
        )
      );
    }

    /*
     * GitHub external validation
     */

    if (stars === 0) {
      gaps.push(
        createGap(
          "Open Source / Project Visibility",
          "GitHub",
          "Weak",
          "Medium",
          30,
          "Repositories currently have no GitHub stars.",
          "Improve README files, project quality and visibility through useful open-source projects."
        )
      );
    }
  } else {
    gaps.push(
      createGap(
        "GitHub Portfolio",
        "GitHub",
        "Missing",
        "High",
        0,
        "GitHub profile was not provided.",
        "Connect GitHub to evaluate project quality and engineering activity."
      )
    );
  }

  /*
   * ============================================
   * Resume
   * ============================================
   */

  if (resume) {
    if (resume.score >= 80) {
      gaps.push(
        createGap(
          "Resume Quality",
          "Resume",
          "Strong",
          "Low",
          resume.score,
          "Resume contains the major professional sections.",
          "Improve impact using measurable achievements and concise bullet points."
        )
      );
    } else if (resume.score >= 60) {
      gaps.push(
        createGap(
          "Resume Quality",
          "Resume",
          "Moderate",
          "Medium",
          resume.score,
          "Resume has a reasonable structure but several areas can be improved.",
          "Strengthen project descriptions, achievements and measurable results."
        )
      );
    } else {
      gaps.push(
        createGap(
          "Resume Quality",
          "Resume",
          "Weak",
          "High",
          resume.score,
          "Resume structure or technical coverage needs improvement.",
          "Rewrite the resume around projects, measurable impact and relevant technical skills."
        )
      );
    }

    /*
     * Achievements
     */

    if (!resume.sections.achievements) {
      gaps.push(
        createGap(
          "Achievements",
          "Resume",
          "Missing",
          "Medium",
          20,
          "No achievements section was detected.",
          "Add hackathons, competitive programming, awards or other measurable achievements."
        )
      );
    }

    /*
     * Certifications
     */

    if (!resume.sections.certifications) {
      gaps.push(
        createGap(
          "Certifications",
          "Resume",
          "Missing",
          "Low",
          30,
          "No certifications were detected.",
          "Add relevant certifications only when they strengthen your target role."
        )
      );
    }
  } else {
    gaps.push(
      createGap(
        "Resume",
        "Resume",
        "Missing",
        "High",
        0,
        "No resume was provided.",
        "Upload your latest resume for detailed analysis."
      )
    );
  }

  /*
   * ============================================
   * ROLE-SPECIFIC SKILLS
   * ============================================
   */

  const githubSkills =
    github?.detectedSkills.map((skill) =>
      skill.name.toLowerCase()
    ) ?? [];

  /*
   * Frontend
   */

  if (
    targetRole === "Frontend Engineer" ||
    targetRole === "Full Stack Engineer"
  ) {
    const hasReact = githubSkills.some(
      (skill) => skill === "react"
    );

    if (!hasReact) {
      gaps.push(
        createGap(
          "React",
          "Frontend",
          "Missing",
          "High",
          20,
          "React was not detected in the GitHub technical signals.",
          "Build a production-quality React application."
        )
      );
    }
  }

  /*
   * Backend
   */

  if (
    targetRole === "Backend Engineer" ||
    targetRole === "Full Stack Engineer" ||
    targetRole === "Software Engineer"
  ) {
    const hasNode = githubSkills.some(
      (skill) =>
        skill === "node.js" ||
        skill === "node"
    );

    if (!hasNode) {
      gaps.push(
        createGap(
          "Backend Development",
          "Backend",
          "Weak",
          "Medium",
          40,
          "Backend engineering signals are limited.",
          "Build a REST API with authentication, database integration and deployment."
        )
      );
    }
  }

  /*
   * ============================================
   * System Design
   * ============================================
   */

  if (
    targetRole === "Backend Engineer" ||
    targetRole === "Full Stack Engineer" ||
    targetRole === "Software Engineer"
  ) {
    gaps.push(
      createGap(
        "System Design",
        "System Design",
        "Moderate",
        "High",
        45,
        "System design capability cannot be reliably inferred from GitHub alone.",
        "Study APIs, caching, databases, load balancing, scalability and common system-design patterns."
      )
    );
  }

  /*
   * ============================================
   * Sort by priority
   * ============================================
   */

  const priorityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return gaps.sort(
    (a, b) =>
      priorityWeight[b.priority] -
      priorityWeight[a.priority]
  );
}