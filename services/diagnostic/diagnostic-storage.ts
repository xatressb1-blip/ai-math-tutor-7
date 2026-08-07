import type { DiagnosticResult } from "@/types/diagnostic";

const STORAGE_KEY = "math-mentor-ai:diagnostic-history:v1";

export function loadDiagnosticHistory(): DiagnosticResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DiagnosticResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLatestDiagnosticResult(): DiagnosticResult | null {
  return loadDiagnosticHistory()[0] ?? null;
}

export function saveDiagnosticResult(result: DiagnosticResult): void {
  if (typeof window === "undefined") return;
  const history = loadDiagnosticHistory();
  const next = [result, ...history].slice(0, 10);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearDiagnosticHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
