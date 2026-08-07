"use client";

import type { LessonDefinition } from "@/types/lesson";
import type { LessonDraftRecord } from "@/types/lesson-authoring";

const STORAGE_PREFIX = "math-mentor-ai:lesson-authoring-draft:v2";

function key(lessonId: string): string {
  return `${STORAGE_PREFIX}:${lessonId}`;
}

export function saveLessonDraft(lesson: LessonDefinition): void {
  const record: LessonDraftRecord = {
    schemaVersion: "1.0",
    updatedAt: new Date().toISOString(),
    lesson,
  };
  window.localStorage.setItem(key(lesson.id), JSON.stringify(record));
}

export function loadLessonDraft(lessonId: string): LessonDraftRecord | null {
  const raw = window.localStorage.getItem(key(lessonId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LessonDraftRecord;
    if (parsed.schemaVersion !== "1.0" || !parsed.lesson) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearLessonDraft(lessonId: string): void {
  window.localStorage.removeItem(key(lessonId));
}
