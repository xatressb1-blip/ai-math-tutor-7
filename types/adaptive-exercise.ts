import type { LessonQuestion } from "@/types/lesson";
import type { SessionAttempt } from "@/types/teaching-session";

export type AdaptiveDifficulty = 1 | 2 | 3;

export type AdaptiveExercise = LessonQuestion & {
  difficulty: AdaptiveDifficulty;
  tags: string[];
};

export type AdaptiveExerciseDecision = {
  focusSkill: string;
  difficulty: AdaptiveDifficulty;
  reason: string;
};

export type AdaptiveExerciseResult = {
  questionId: string;
  skillName: string;
  difficulty: AdaptiveDifficulty;
  attempts: SessionAttempt[];
  solved: boolean;
  firstTryCorrect: boolean;
};

export type AdaptivePracticeReport = {
  focusSkills: string[];
  questionsCompleted: number;
  firstTryCorrect: number;
  startDifficulty: AdaptiveDifficulty;
  endDifficulty: AdaptiveDifficulty;
  message: string;
};
