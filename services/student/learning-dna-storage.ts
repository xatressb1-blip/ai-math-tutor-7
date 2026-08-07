import type { LearningDnaProfile } from "@/types/learning-dna";

const STORAGE_KEY = "math-mentor-ai:learning-dna:v1";

export function loadLearningDnaFromStorage(): LearningDnaProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LearningDnaProfile;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLearningDnaToStorage(profile: LearningDnaProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearLearningDnaStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
