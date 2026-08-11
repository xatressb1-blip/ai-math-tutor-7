import type { MistakeCategory } from "@/types/student";

export type ReasoningStepDefinition = {
  id: string;
  instruction: string;
  acceptedPatterns: string[];
  /**
   * Optional stricter checker. Every group must have at least one matching phrase.
   * Use this when a step requires multiple independent facts, e.g. three
   * corresponding side equalities in c.c.c.
   */
  requiredPatternGroups?: string[][];
  keyIdea: string;
  hint1: string;
  hint2: string;
  explanation: string;
  misconceptionPatterns?: Array<{
    pattern: string;
    category: MistakeCategory;
    label: string;
    feedback: string;
  }>;
};

export type ReasoningProblem = {
  id: string;
  lessonId: string;
  knowledgeNodeId: string;
  title: string;
  prompt: string;
  skillName: string;
  difficulty: 1 | 2 | 3;
  steps: ReasoningStepDefinition[];
  finalAnswer: string;
};

export type ReasoningStepAttempt = {
  stepId: string;
  input: string;
  isCorrect: boolean;
  attemptNumber: number;
  hintLevel: 0 | 1 | 2 | 3;
  category?: MistakeCategory;
  diagnosis?: string;
  createdAt: string;
};

export type ReasoningEvaluation = {
  isCorrect: boolean;
  feedback: string;
  nextHint?: string;
  hintLevel: 0 | 1 | 2 | 3;
  diagnosis?: string;
  category?: MistakeCategory;
  shouldRevealExplanation: boolean;
};

export type ReasoningScoreBreakdown = {
  reasoningScore: number;
  persistenceScore: number;
  misconceptionCount: number;
  firstAttemptAccuracy: number;
  hintDependencyScore: number;
  recoveryScore: number;
  firstErrorStepId?: string;
};

export type ReasoningSessionSummary = {
  problemId: string;
  lessonId: string;
  skillName: string;
  completed: boolean;
  correctSteps: number;
  totalSteps: number;
  attempts: ReasoningStepAttempt[];
  reasoningScore: number;
  persistenceScore: number;
  misconceptionCount: number;
  firstAttemptAccuracy: number;
  hintDependencyScore: number;
  recoveryScore: number;
  firstErrorStepId?: string;
  startedAt: string;
  completedAt: string;
};
