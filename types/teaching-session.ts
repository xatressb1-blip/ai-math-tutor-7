import type { DiagnosticInsight } from "@/types/teaching-brain";
import type { MasteryEvidenceSource, MistakeCategory } from "@/types/student";

export type TeachingStrategy =
  | "PRAISE_AND_ADVANCE"
  | "GIVE_HINT"
  | "GIVE_STRONGER_HINT"
  | "EXPLAIN_AND_RETRY"
  | "TARGET_MISCONCEPTION"
  | "CONTRAST_EXAMPLE"
  | "STEP_BY_STEP_RETEACH";

export type SessionAttempt = {
  questionId: string;
  skillName: string;
  choiceId: string;
  isCorrect: boolean;
  attemptNumber: number;
  responseSeconds: number;
  confidenceScore: number;
  strategy: TeachingStrategy;
  mistakeCategory?: MistakeCategory;
  diagnosisLabel?: string;
  /**
   * Where this evidence came from. Optional for compatibility with old sessions.
   */
  evidenceSource?: Extract<
    MasteryEvidenceSource,
    "LESSON_CORE" | "ADAPTIVE" | "LEGACY"
  >;
};

export type SkillSessionSummary = {
  skillName: string;
  questionsSeen: number;
  correctQuestions: number;
  firstTryCorrect: number;
  averageConfidence: number;
};

export type TeachingSessionSummary = {
  score: number;
  confidenceScore: number;
  totalAttempts: number;
  totalQuestions: number;
  correctQuestions: number;
  firstTryCorrect: number;
  elapsedMinutes: number;
  skills: SkillSessionSummary[];
  strengths: string[];
  reviewSkills: string[];
  diagnosticInsights: DiagnosticInsight[];
};
