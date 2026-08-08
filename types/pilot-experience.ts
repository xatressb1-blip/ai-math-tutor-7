export type DailyMissionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "LEARN" | "REASONING" | "REVIEW";
  estimatedMinutes: number;
  reason: string;
};
export type DailyMission = {
  dateKey: string;
  focusSkill: string;
  focusLessonId: string;
  readinessMessage: string;
  totalMinutes: number;
  items: DailyMissionItem[];
};
export type PilotFeedbackValue =
  | "EASY_TO_UNDERSTAND"
  | "HARD_TO_UNDERSTAND"
  | "AI_HELPFUL"
  | "NEEDS_IMPROVEMENT";
export type PilotFeedbackRecord = {
  id: string;
  createdAt: string;
  lessonId?: string;
  value: PilotFeedbackValue;
  note: string;
};
export type ReflectionFeeling = "CONFIDENT" | "OK" | "UNSURE";
export type SessionReflection = {
  id: string;
  createdAt: string;
  lessonId?: string;
  feeling: ReflectionFeeling;
  note: string;
};
export type LearningStreak = {
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  todayCompleted: boolean;
  recentDateKeys: string[];
};
