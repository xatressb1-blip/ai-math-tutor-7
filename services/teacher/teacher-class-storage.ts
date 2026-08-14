"use client";

export type TeacherClassSettings = {
  className: string;
  classCode: string;
  updatedAt: string;
};

const KEY = "math-mentor-ai:teacher-class-settings:v1";
const REGISTRY_KEY = "math-mentor-ai:teacher-class-registry:v1";

function normalizeClassCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 32);
}

export function makeClassCode(className: string): string {
  return normalizeClassCode(className) || "LOP7";
}

export function loadTeacherClassSettings(): TeacherClassSettings | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as TeacherClassSettings;
    return parsed?.classCode && parsed?.className ? parsed : null;
  } catch {
    return null;
  }
}

export function loadTeacherClassRegistry(): TeacherClassSettings[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REGISTRY_KEY);
  if (!raw) {
    const current = loadTeacherClassSettings();
    return current ? [current] : [];
  }
  try {
    const parsed = JSON.parse(raw) as TeacherClassSettings[];
    return Array.isArray(parsed)
      ? parsed
          .filter((item) => item?.classCode && item?.className)
          .sort((a, b) => a.className.localeCompare(b.className, "vi"))
      : [];
  } catch {
    return [];
  }
}

function saveRegistry(classes: TeacherClassSettings[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(classes));
  }
}

export function classAlreadyExists(classNameOrCode: string): TeacherClassSettings | null {
  const code = makeClassCode(classNameOrCode);
  return loadTeacherClassRegistry().find((item) => item.classCode === code) ?? null;
}

export function saveTeacherClassSettings(input: {
  className: string;
  classCode: string;
}): TeacherClassSettings {
  const next: TeacherClassSettings = {
    className: input.className.trim().toUpperCase() || "7A",
    classCode: normalizeClassCode(input.classCode),
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    const existing = loadTeacherClassRegistry();
    const registry = existing.some((item) => item.classCode === next.classCode)
      ? existing.map((item) => item.classCode === next.classCode ? next : item)
      : [...existing, next];
    saveRegistry(registry.sort((a, b) => a.className.localeCompare(b.className, "vi")));
    window.localStorage.setItem("math-mentor-ai:last-class-code:v1", next.classCode);
  }
  return next;
}

export function selectTeacherClass(classCode: string): TeacherClassSettings | null {
  const found = loadTeacherClassRegistry().find((item) => item.classCode === normalizeClassCode(classCode));
  if (!found || typeof window === "undefined") return null;
  window.localStorage.setItem(KEY, JSON.stringify(found));
  window.localStorage.setItem("math-mentor-ai:last-class-code:v1", found.classCode);
  return found;
}

export function deleteTeacherClass(classCode: string): TeacherClassSettings[] {
  if (typeof window === "undefined") return [];
  const normalized = normalizeClassCode(classCode);
  const remaining = loadTeacherClassRegistry().filter((item) => item.classCode !== normalized);
  saveRegistry(remaining);

  const current = loadTeacherClassSettings();
  if (current?.classCode === normalized) {
    window.localStorage.removeItem(KEY);
    const next = remaining[0];
    if (next) {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      window.localStorage.setItem("math-mentor-ai:last-class-code:v1", next.classCode);
    } else {
      window.localStorage.removeItem("math-mentor-ai:last-class-code:v1");
    }
  }
  return remaining;
}
