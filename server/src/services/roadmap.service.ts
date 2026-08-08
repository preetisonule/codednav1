import type { SkillGap, TargetRole } from "./skillGap.service";

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
 * ============================================
 * Task Library
 * ============================================
 */

const TASK_LIBRARY: Record<string, RoadmapTask[]> = {
  "System Design": [
    {
      title: "Learn system design fundamentals",
      description:
        "Study scalability, availability, reliability, latency and throughput.",
      estimatedHours: 2,
      category: "System Design",
    },
    {
      title: "Study REST API architecture",
      description:
        "Understand API design, HTTP methods, status codes, authentication and versioning.",
      estimatedHours: 2,
      category: "System Design",
    },
    {
      title: "Learn caching",
      description:
        "Understand caching strategies, cache invalidation and Redis fundamentals.",
      estimatedHours: 2,
      category: "System Design",
    },
    {
      title: "Study databases and scaling",
      description:
        "Learn indexing, replication, partitioning and SQL vs NoSQL trade-offs.",
      estimatedHours: 2,
      category: "System Design",
    },
    {
      title: "Learn load balancing",
      description:
        "Understand horizontal scaling, load balancers and distributed systems basics.",
      estimatedHours: 2,
      category: "System Design",
    },
    {
      title: "Design a scalable URL shortener",
      description:
        "Practice designing a real-world distributed application.",
      estimatedHours: 3,
      category: "System Design",
    },
  ],

  "Backend Development": [
    {
      title: "Build a REST API",
      description:
        "Create a production-style REST API using Node.js and Express.",
      estimatedHours: 3,
      category: "Backend",
    },
    {
      title: "Implement authentication",
      description:
        "Build registration, login, JWT authentication and protected routes.",
      estimatedHours: 3,
      category: "Backend",
    },
    {
      title: "Database integration",
      description:
        "Connect your backend to a database and implement CRUD operations.",
      estimatedHours: 3,
      category: "Backend",
    },
    {
      title: "API validation and error handling",
      description:
        "Implement request validation, centralized errors and proper HTTP responses.",
      estimatedHours: 2,
      category: "Backend",
    },
    {
      title: "Deploy your backend",
      description:
        "Deploy the API and configure environment variables securely.",
      estimatedHours: 2,
      category: "Backend",
    },
  ],

  React: [
    {
      title: "React fundamentals",
      description:
        "Review components, props, state, hooks and component composition.",
      estimatedHours: 2,
      category: "Frontend",
    },
    {
      title: "Build a React dashboard",
      description:
        "Create a responsive dashboard consuming a real API.",
      estimatedHours: 3,
      category: "Frontend",
    },
    {
      title: "Improve React architecture",
      description:
        "Practice reusable components, custom hooks and clean state management.",
      estimatedHours: 2,
      category: "Frontend",
    },
  ],

  "GitHub Portfolio": [
    {
      title: "Improve project README",
      description:
        "Add project overview, features, tech stack, setup instructions and screenshots.",
      estimatedHours: 2,
      category: "GitHub",
    },
    {
      title: "Create a flagship project",
      description:
        "Build or polish one project that demonstrates your target-role skills.",
      estimatedHours: 4,
      category: "GitHub",
    },
    {
      title: "Add architecture documentation",
      description:
        "Document your project's architecture and major technical decisions.",
      estimatedHours: 2,
      category: "GitHub",
    },
    {
      title: "Clean GitHub repositories",
      description:
        "Archive unfinished repositories and improve naming, descriptions and documentation.",
      estimatedHours: 2,
      category: "GitHub",
    },
  ],

  "Open Source / Project Visibility": [
    {
      title: "Improve repository visibility",
      description:
        "Write better README files and add useful documentation to your strongest projects.",
      estimatedHours: 2,
      category: "GitHub",
    },
    {
      title: "Contribute to open source",
      description:
        "Find a beginner-friendly issue and submit a meaningful contribution.",
      estimatedHours: 3,
      category: "GitHub",
    },
  ],

  "Data Structures & Algorithms": [
    {
      title: "Arrays and strings",
      description:
        "Practice common interview patterns such as two pointers and sliding window.",
      estimatedHours: 2,
      category: "DSA",
    },
    {
      title: "Trees and binary search",
      description:
        "Practice traversal, BST operations and tree-based interview problems.",
      estimatedHours: 2,
      category: "DSA",
    },
    {
      title: "Graphs",
      description:
        "Practice BFS, DFS and common graph problems.",
      estimatedHours: 2,
      category: "DSA",
    },
    {
      title: "Timed coding practice",
      description:
        "Solve 2-3 interview-level problems under a time limit.",
      estimatedHours: 2,
      category: "DSA",
    },
  ],

  "Advanced Problem Solving": [
    {
      title: "Practice Hard problems",
      description:
        "Solve selected Hard problems focusing on patterns rather than brute force.",
      estimatedHours: 2,
      category: "DSA",
    },
  ],

  "Resume Quality": [
    {
      title: "Rewrite project bullet points",
      description:
        "Use action + technology + measurable result in project descriptions.",
      estimatedHours: 2,
      category: "Resume",
    },
    {
      title: "Add measurable impact",
      description:
        "Replace generic descriptions with metrics, scale and concrete outcomes.",
      estimatedHours: 2,
      category: "Resume",
    },
  ],

  Achievements: [
    {
      title: "Add achievements",
      description:
        "Document hackathons, competitive programming, awards and measurable accomplishments.",
      estimatedHours: 1,
      category: "Resume",
    },
  ],

  Certifications: [
    {
      title: "Evaluate relevant certifications",
      description:
        "Identify certifications that actually strengthen your target role.",
      estimatedHours: 1,
      category: "Resume",
    },
  ],
};

/*
 * ============================================
 * Generic fallback task
 * ============================================
 */

function createFallbackTask(gap: SkillGap): RoadmapTask {
  return {
    title: `Improve ${gap.skill}`,
    description: gap.recommendedAction,
    estimatedHours: 2,
    category: gap.category,
  };
}

/*
 * ============================================
 * Get tasks for a skill
 * ============================================
 */

function getTasksForGap(gap: SkillGap): RoadmapTask[] {
  return TASK_LIBRARY[gap.skill] ?? [createFallbackTask(gap)];
}

/*
 * ============================================
 * Generate Roadmap
 * ============================================
 */

export function generateRoadmap(
  targetRole: TargetRole,
  days: number,
  skillGaps: SkillGap[]
): Roadmap {
  const roadmapDays: RoadmapDay[] = [];

  const priorityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Sort gaps by priority
  const sortedGaps = [...skillGaps].sort(
    (a, b) =>
      priorityWeight[b.priority] -
      priorityWeight[a.priority]
  );

  // Remove duplicate skills
  const uniqueGaps = sortedGaps.filter(
    (gap, index, array) =>
      array.findIndex(
        (item) => item.skill === gap.skill
      ) === index
  );

  // Build task pool
  const taskPool: RoadmapTask[] = [];

  for (const gap of uniqueGaps) {
    const tasks = getTasksForGap(gap);

    let taskCount = 1;

    if (gap.priority === "High") {
      taskCount = tasks.length;
    } else if (gap.priority === "Medium") {
      taskCount = Math.min(tasks.length, 2);
    }

    taskPool.push(
      ...tasks.slice(0, taskCount)
    );
  }

  // If there are no tasks
  if (taskPool.length === 0) {
    taskPool.push({
      title: "Mock interview preparation",
      description:
        "Practice DSA, system design and project explanation.",
      estimatedHours: 2,
      category: "Interview",
    });
  }

  /*
   * Repeat tasks only when necessary,
   * but don't repeat the same task immediately.
   */
  let taskIndex = 0;

  for (let day = 1; day <= days; day++) {
    const task = taskPool[taskIndex];

    roadmapDays.push({
      day,
      focus: task.category,
      tasks: [task],
    });

    taskIndex++;

    if (taskIndex >= taskPool.length) {
      taskIndex = 0;
    }
  }

  return {
    targetRole,
    totalDays: days,
    days: roadmapDays,
  };
}