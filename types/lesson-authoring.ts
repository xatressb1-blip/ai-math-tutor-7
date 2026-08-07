import type { LessonDefinition } from "@/types/lesson";

export type LessonValidationIssue = {
  level: "ERROR" | "WARNING";
  path: string;
  message: string;
};

export type LessonValidationResult = {
  isValid: boolean;
  errors: LessonValidationIssue[];
  warnings: LessonValidationIssue[];
};

export type LessonDraftRecord = {
  schemaVersion: "1.0";
  updatedAt: string;
  lesson: LessonDefinition;
};
