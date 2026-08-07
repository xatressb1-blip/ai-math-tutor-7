import type { MistakeCategory } from "@/types/student";

export type TeachingIntervention =
  | "ADVANCE"
  | "TARGETED_HINT"
  | "CONTRAST_EXAMPLE"
  | "STEP_BY_STEP_RETEACH"
  | "SLOW_DOWN_AND_RECHECK";

export type QuestionDiagnosticRule = {
  choiceId: string;
  category: MistakeCategory;
  label: string;
  evidence: string;
  targetedHint: string;
  contrastExample?: string;
};

export type TeachingDiagnosis = {
  category: MistakeCategory;
  label: string;
  evidence: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
};

export type TeachingBrainDecision = {
  diagnosis: TeachingDiagnosis | null;
  intervention: TeachingIntervention;
  nextActionLabel: string;
  coachText: string;
};

export type DiagnosticInsight = {
  category: MistakeCategory;
  label: string;
  count: number;
};
