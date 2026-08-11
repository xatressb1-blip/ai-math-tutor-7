import type { MistakeCategory } from "@/types/student";

export type DiagnosticDifficulty = 1 | 2 | 3;

export type DiagnosticDomain =
  | "PREREQUISITE"
  | "LESSON_1"
  | "LESSON_2"
  | "LESSON_3"
  | "LESSON_4";

export type DiagnosticChoice = {
  id: string;
  text: string;
};

export type DiagnosticChoiceDiagnostic = {
  choiceId: string;
  category: MistakeCategory;
  label: string;
};

export type DiagnosticQuestion = {
  id: string;
  domain: DiagnosticDomain;
  lessonNumber: 0 | 1 | 2 | 3 | 4;
  skillName: string;
  canonicalSkillId?: string;
  difficulty: DiagnosticDifficulty;
  prompt: string;
  choices: DiagnosticChoice[];
  correctChoiceId: string;
  explanation: string;
  wrongAnswerCategory?: MistakeCategory;
  diagnostics?: DiagnosticChoiceDiagnostic[];
};

export type DiagnosticAnswer = {
  questionId: string;
  domain: DiagnosticDomain;
  lessonNumber: number;
  skillName: string;
  canonicalSkillId?: string;
  difficulty: DiagnosticDifficulty;
  choiceId: string;
  isCorrect: boolean;
  responseSeconds: number;
  mistakeCategory?: MistakeCategory;
  diagnosisLabel?: string;
};

export type DiagnosticLessonScore = {
  lessonNumber: 0 | 1 | 2 | 3 | 4;
  score: number;
  confidence: number;
  questions: number;
  correct: number;
};

export type DiagnosticPlacement =
  | "PRE_CHAPTER_REVIEW"
  | "LESSON_1"
  | "LESSON_2"
  | "LESSON_3"
  | "LESSON_4";

export type DiagnosticResult = {
  id: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  confidence: number;
  lessonScores: DiagnosticLessonScore[];
  startingPoint: DiagnosticPlacement;
  startingLessonId: string;
  startingLessonNumber: 1 | 2 | 3 | 4;
  startingLessonTitle: string;
  recommendation: string;
  weakSkills: string[];
  strongSkills: string[];
  answers: DiagnosticAnswer[];
};
