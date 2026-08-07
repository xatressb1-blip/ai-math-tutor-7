export type LearningPathAction =
  | "ADVANCE"
  | "REVIEW_CURRENT"
  | "COMPLETE_CHAPTER";

export type LearningPathDecision = {
  action: LearningPathAction;
  title: string;
  message: string;
  nextLessonId?: string;
  nextLessonTitle?: string;
};
