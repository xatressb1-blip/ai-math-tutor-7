export type LearningPace = "FAST" | "BALANCED" | "DELIBERATE";
export type SupportNeed = "INDEPENDENT" | "GUIDED" | "NEEDS_SUPPORT";

export type LearningDnaProfile = {
  studentId: string;
  sessionsObserved: number;
  averageResponseSeconds: number;
  firstTryRate: number;
  averageConfidence: number;
  averageAttemptsPerQuestion: number;
  pace: LearningPace;
  supportNeed: SupportNeed;
  note: string;
  updatedAt: string;
};
