import { PDFParse } from "pdf-parse";
import type { ResumeAnalysis } from "../types";

const TECH_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
  "Python",
  "Java",
  "C++",
  "C",
  "HTML",
  "CSS",
  "Tailwind",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "AWS",
  "SQL",
];

export async function analyzeResume(
  buffer: Buffer
): Promise<ResumeAnalysis> {
  const parser = new PDFParse({ data: buffer });
const data = await parser.getText();
const text = data.text;
await parser.destroy();

  const sections = {
    education:
      /education|b\.?tech|bachelor|degree|university|college/i.test(text),

    skills:
      /skills|technical skills|technologies/i.test(text),

    projects:
      /projects|project experience/i.test(text),

    experience:
      /experience|internship|employment|work experience/i.test(text),

    achievements:
      /achievement|awards|hackathon|competition/i.test(text),

    certifications:
      /certification|certifications|certificate/i.test(text),
  };

  const normalizedText = text.toLowerCase();

  const skills = TECH_SKILLS.filter((skill) =>
    normalizedText.includes(skill.toLowerCase())
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (sections.projects) {
    strengths.push("Projects section is present");
  } else {
    weaknesses.push("Projects section is missing");
  }

  if (sections.skills) {
    strengths.push("Technical skills are clearly listed");
  } else {
    weaknesses.push("Skills section is missing");
  }

  if (sections.experience) {
    strengths.push("Professional experience is present");
  } else {
    weaknesses.push("Professional experience is missing");
  }

  if (sections.achievements) {
    strengths.push("Achievements are mentioned");
  }

  if (sections.certifications) {
    strengths.push("Certifications are mentioned");
  }

  if (skills.length >= 5) {
    strengths.push("Good technical skill coverage");
  } else {
    weaknesses.push("Technical skill coverage could be improved");
  }

  let score = 0;

  if (sections.education) score += 15;
  if (sections.skills) score += 20;
  if (sections.projects) score += 20;
  if (sections.experience) score += 20;
  if (sections.achievements) score += 10;
  if (sections.certifications) score += 5;

  score += Math.min(skills.length * 2, 10);

  return {
    score: Math.min(score, 100),
    skills,
    sections,
    strengths,
    weaknesses,
  };
}