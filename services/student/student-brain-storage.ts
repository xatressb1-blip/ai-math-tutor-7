import type { StudentBrainSnapshot } from "@/types/student";

const STORAGE_KEY = "math-mentor-ai:student-brain:v1";

export function loadStudentBrainFromStorage(): StudentBrainSnapshot | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StudentBrainSnapshot;
    return {
      ...parsed,
      diagnostics: parsed.diagnostics ?? [],
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveStudentBrainToStorage(brain: StudentBrainSnapshot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brain));
}

export function clearStudentBrainStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getStudentBrainStorageKey(): string {
  return STORAGE_KEY;
}
