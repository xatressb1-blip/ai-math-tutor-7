"use client";

import type { PilotFeedbackRecord, SessionReflection } from "@/types/pilot-experience";

const ACTIVITY_KEY = "math-mentor-ai:pilot-activity:v1";
const FEEDBACK_KEY = "math-mentor-ai:pilot-feedback:v1";
const REFLECTION_KEY = "math-mentor-ai:pilot-reflection:v1";

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeArray<T>(key: string, values: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values));
}
export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function markPilotActivity(dateKey = getLocalDateKey()): string[] {
  const current = readArray<string>(ACTIVITY_KEY);
  const next = [...new Set([...current, dateKey])].sort().slice(-120);
  writeArray(ACTIVITY_KEY, next);
  return next;
}
export function loadPilotActivity(): string[] {
  return readArray<string>(ACTIVITY_KEY);
}
export function savePilotFeedback(
  input: Omit<PilotFeedbackRecord, "id" | "createdAt">,
): PilotFeedbackRecord {
  const record: PilotFeedbackRecord = {
    ...input,
    id: `feedback-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeArray(FEEDBACK_KEY, [...readArray<PilotFeedbackRecord>(FEEDBACK_KEY), record].slice(-100));
  markPilotActivity();
  return record;
}
export function loadPilotFeedback(): PilotFeedbackRecord[] {
  return readArray<PilotFeedbackRecord>(FEEDBACK_KEY);
}
export function saveSessionReflection(
  input: Omit<SessionReflection, "id" | "createdAt">,
): SessionReflection {
  const record: SessionReflection = {
    ...input,
    id: `reflection-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeArray(REFLECTION_KEY, [...readArray<SessionReflection>(REFLECTION_KEY), record].slice(-100));
  markPilotActivity();
  return record;
}
export function loadSessionReflections(): SessionReflection[] {
  return readArray<SessionReflection>(REFLECTION_KEY);
}
