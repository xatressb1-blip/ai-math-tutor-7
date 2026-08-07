import type { LessonDefinition } from "@/types/lesson";

export type ContentStatus = "PUBLISHED" | "ARCHIVED";

export type PublishedLessonRecord = {
  repositoryId: string;
  lessonId: string;
  version: number;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
  lesson: LessonDefinition;
};

export type ContentRepositoryState = {
  schemaVersion: "1.0";
  records: PublishedLessonRecord[];
};
