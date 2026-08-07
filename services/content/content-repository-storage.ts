"use client";

import type { LessonDefinition } from "@/types/lesson";
import type {
  ContentRepositoryState,
  PublishedLessonRecord,
} from "@/types/content-repository";

const STORAGE_KEY = "math-mentor-ai:content-repository:v1";

function cloneLesson(lesson: LessonDefinition): LessonDefinition {
  return JSON.parse(JSON.stringify(lesson)) as LessonDefinition;
}

function emptyState(): ContentRepositoryState {
  return {
    schemaVersion: "1.0",
    records: [],
  };
}

export function loadContentRepository(): ContentRepositoryState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState();

  try {
    const parsed = JSON.parse(raw) as ContentRepositoryState;
    if (parsed.schemaVersion !== "1.0" || !Array.isArray(parsed.records)) {
      return emptyState();
    }
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveContentRepository(state: ContentRepositoryState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function publishLesson(
  lesson: LessonDefinition,
): PublishedLessonRecord {
  const state = loadContentRepository();
  const sameLesson = state.records.filter((record) => record.lessonId === lesson.id);
  const nextVersion =
    sameLesson.reduce((max, record) => Math.max(max, record.version), 0) + 1;
  const now = new Date().toISOString();

  const archived = state.records.map((record) =>
    record.lessonId === lesson.id && record.status === "PUBLISHED"
      ? { ...record, status: "ARCHIVED" as const, updatedAt: now }
      : record,
  );

  const published: PublishedLessonRecord = {
    repositoryId: `${lesson.id}:v${nextVersion}:${Date.now()}`,
    lessonId: lesson.id,
    version: nextVersion,
    status: "PUBLISHED",
    publishedAt: now,
    updatedAt: now,
    lesson: cloneLesson(lesson),
  };

  saveContentRepository({
    schemaVersion: "1.0",
    records: [published, ...archived],
  });

  return published;
}

export function getPublishedLessonRecord(
  lessonId: string,
): PublishedLessonRecord | null {
  const state = loadContentRepository();
  return (
    state.records.find(
      (record) => record.lessonId === lessonId && record.status === "PUBLISHED",
    ) ?? null
  );
}

export function getPublishedLesson(
  lessonId: string,
): LessonDefinition | null {
  return getPublishedLessonRecord(lessonId)?.lesson ?? null;
}

export function listContentRecords(): PublishedLessonRecord[] {
  return loadContentRepository().records;
}

export function activateContentVersion(repositoryId: string): void {
  const state = loadContentRepository();
  const target = state.records.find((record) => record.repositoryId === repositoryId);
  if (!target) return;

  const now = new Date().toISOString();
  const records = state.records.map((record) => {
    if (record.lessonId !== target.lessonId) return record;
    if (record.repositoryId === repositoryId) {
      return { ...record, status: "PUBLISHED" as const, updatedAt: now };
    }
    return { ...record, status: "ARCHIVED" as const, updatedAt: now };
  });

  saveContentRepository({ schemaVersion: "1.0", records });
}

export function archivePublishedLesson(lessonId: string): void {
  const state = loadContentRepository();
  const now = new Date().toISOString();
  const records = state.records.map((record) =>
    record.lessonId === lessonId && record.status === "PUBLISHED"
      ? { ...record, status: "ARCHIVED" as const, updatedAt: now }
      : record,
  );
  saveContentRepository({ schemaVersion: "1.0", records });
}

export function clearContentRepository(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
