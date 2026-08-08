"use client";

import type { MockTestResult } from "@/types/revision";

const STORAGE_KEY = "math-mentor-ai:mock-tests:v1";

export function loadMockTestResults(): MockTestResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MockTestResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMockTestResult(result: MockTestResult): void {
  if (typeof window === "undefined") return;
  const current = loadMockTestResults();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...current, result].slice(-20)),
  );
}
