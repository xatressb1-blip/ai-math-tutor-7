export type KnowledgeQaStatus = "PASS" | "WARN" | "FAIL";

export type LessonKnowledgeQa = {
  lessonNumber: number;
  lessonId: string;
  title: string;
  chapter: number;
  academicMapped: boolean;
  lessonPlayerMapped: boolean;
  adaptivePracticeMapped: boolean;
  tutorMapped: boolean;
  reasoningLabMapped: boolean;
  studentBrainMapped: boolean;
  coreQuestionCount: number;
  adaptiveQuestionCount: number;
  reasoningProblemCount: number;
  academicObjectiveCount: number;
  studentBrainSkillCount: number;
  status: KnowledgeQaStatus;
  notes: string[];
};

export type KnowledgeQaReport = {
  schemaVersion: "1.0";
  generatedAt: string;
  totalLessons: number;
  passed: number;
  warned: number;
  failed: number;
  coveragePercent: number;
  lessons: LessonKnowledgeQa[];
};
