import type { MistakeCategory } from "@/types/student";

export type TutorRole = "student" | "tutor";

export type TutorMessage = {
  id: string;
  role: TutorRole;
  text: string;
  createdAt: string;
  intent?: TutorIntent;
};

export type TutorIntent =
  | "EXPLAIN"
  | "HINT"
  | "EXAMPLE"
  | "RULE"
  | "CHECK_UNDERSTANDING"
  | "MOTIVATION"
  | "OUT_OF_SCOPE";

export type TutorStudentContext = {
  displayName: string;
  lessonId: string;
  knowledgeNodeId: string;
  weakSkills: Array<{
    skillName: string;
    masteryScore: number;
    confidence: number;
  }>;
  recentMistakes: Array<{
    category: MistakeCategory;
    description: string;
    count: number;
  }>;
};

export type TutorRequest = {
  lessonId: string;
  message: string;
  history: TutorMessage[];
  studentContext: TutorStudentContext;
};

export type TutorResponse = {
  message: TutorMessage;
  suggestedReplies: string[];
  sourceLabel: string;
  usedStudentContext: boolean;
};
