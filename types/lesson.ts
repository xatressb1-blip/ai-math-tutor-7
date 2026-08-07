import type { QuestionDiagnosticRule } from "@/types/teaching-brain";

export type TeachingAction =
  | "WELCOME"
  | "OBJECTIVE"
  | "EXPLAIN"
  | "EXAMPLE"
  | "QUESTION"
  | "SUMMARY";

export type QuestionChoice = {
  id: string;
  text: string;
};

export type LessonQuestion = {
  id: string;
  prompt: string;
  choices: QuestionChoice[];
  correctChoiceId: string;
  skillName: string;
  hint: string;
  retryHint: string;
  explanation: string;
  diagnostics?: QuestionDiagnosticRule[];
};

export type LessonStep = {
  id: string;
  action: TeachingAction;
  title: string;
  content: string;
  estimatedMinutes: number;
  question?: LessonQuestion;
};

export type LessonDefinition = {
  id: string;
  knowledgeNodeId: string;
  grade: number;
  chapter: number;
  lessonNumber: number;
  title: string;
  subtitle: string;
  objectives: string[];
  estimatedMinutes: number;
  steps: LessonStep[];
};

export type QuestionAttempt = {
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
  attemptNumber: number;
};
