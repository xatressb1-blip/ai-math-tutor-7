import type { StudentBrainSnapshot } from "@/types/student";

export type TeacherStudentRecord = {
  id: string;
  displayName: string;
  className: string;
  source: "LIVE" | "DEMO";
  brain: StudentBrainSnapshot;
};

export type StudentAnalytics = {
  studentId: string;
  displayName: string;
  className: string;
  source: "LIVE" | "DEMO";
  masteryAverage: number;
  confidenceAverage: number;
  accuracyAverage: number;
  totalStudyMinutes: number;
  sessionCount: number;
  activeMistakes: number;
  reasoningScore: number | null;
  hintDependency: number | null;
  completionScore: number;
  supportLevel: "ON_TRACK" | "WATCH" | "NEEDS_SUPPORT";
  strongestSkill: string | null;
  weakestSkill: string | null;
  recommendation: string;
};

export type SkillClassAnalytics = {
  skillName: string;
  studentCount: number;
  masteryAverage: number;
  confidenceAverage: number;
  strugglingCount: number;
};

export type ClassAnalyticsSnapshot = {
  className: string;
  studentCount: number;
  averageMastery: number;
  averageConfidence: number;
  averageAccuracy: number;
  averageReasoning: number | null;
  totalStudyMinutes: number;
  studentsNeedingSupport: number;
  studentsOnTrack: number;
  commonMistakes: Array<{
    description: string;
    count: number;
  }>;
  skills: SkillClassAnalytics[];
  students: StudentAnalytics[];
};
