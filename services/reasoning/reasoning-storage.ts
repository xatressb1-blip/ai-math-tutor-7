import type { ReasoningSessionSummary } from "@/types/reasoning";

const PREFIX = "math-mentor-ai:reasoning-history:v1";

export function loadReasoningHistory(lessonId: string): ReasoningSessionSummary[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(`${PREFIX}:${lessonId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReasoningSessionSummary[];
  } catch {
    return [];
  }
}

export function saveReasoningSession(summary: ReasoningSessionSummary): void {
  if (typeof window === "undefined") return;
  const current = loadReasoningHistory(summary.lessonId);
  window.localStorage.setItem(
    `${PREFIX}:${summary.lessonId}`,
    JSON.stringify([...current, summary].slice(-20)),
  );
}
