"use client";

import type { TutorMessage } from "@/types/tutor";

const PREFIX = "math-mentor-ai:tutor-history:v1";

function key(lessonId: string): string {
  return `${PREFIX}:${lessonId}`;
}

export function loadTutorHistory(lessonId: string): TutorMessage[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key(lessonId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as TutorMessage[];
    return Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch {
    window.localStorage.removeItem(key(lessonId));
    return [];
  }
}

export function saveTutorHistory(
  lessonId: string,
  messages: TutorMessage[],
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(lessonId), JSON.stringify(messages.slice(-40)));
}

export function clearTutorHistory(lessonId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key(lessonId));
}
