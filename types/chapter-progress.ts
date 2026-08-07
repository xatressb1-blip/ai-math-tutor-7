export type LessonPathStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "NEEDS_REVIEW"
  | "COMPLETED";

export type LessonProgressSnapshot = {
  lessonId: string;
  knowledgeNodeId: string;
  lessonNumber: number;
  title: string;
  status: LessonPathStatus;
  attempts: number;
  latestAccuracy: number | null;
  latestConfidence: number | null;
  masteryAverage: number | null;
  lastStudiedAt: string | null;
  reason: string;
};

export type ChapterProgressSnapshot = {
  chapter: number;
  title: string;
  lessons: LessonProgressSnapshot[];
  completedLessons: number;
  availableLessons: number;
  reviewLessons: number;
  overallProgress: number;
  recommendedLessonId: string | null;
  recommendation: string;
};
