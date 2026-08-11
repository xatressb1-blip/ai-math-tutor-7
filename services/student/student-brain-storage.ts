import { migrateBrainToCanonicalSkills } from "@/services/student/canonical-skill-registry";
import type { StudentBrainSnapshot } from "@/types/student";

const STORAGE_KEY = "math-mentor-ai:student-brain:v1";
const WORKSPACE_KEY = "math-mentor-ai:multi-student-workspace:v1";

export function loadStudentBrainFromStorage(): StudentBrainSnapshot | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StudentBrainSnapshot;
    return migrateBrainToCanonicalSkills({
      ...parsed,
      diagnostics: parsed.diagnostics ?? [],
    });
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveStudentBrainToStorage(brain: StudentBrainSnapshot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brain));

  // v2.8.2-beta.4 compatibility bridge: every legacy save also updates the
  // matching active brain in the multi-student workspace.
  const rawWorkspace = window.localStorage.getItem(WORKSPACE_KEY);
  if (!rawWorkspace) return;
  try {
    const workspace = JSON.parse(rawWorkspace) as {
      schemaVersion?: number;
      activeStudentId?: string;
      brains?: Record<string, StudentBrainSnapshot>;
      updatedAt?: string;
    };
    if (
      workspace.schemaVersion === 1 &&
      workspace.activeStudentId === brain.profile.id &&
      workspace.brains
    ) {
      workspace.brains[brain.profile.id] = brain;
      workspace.updatedAt = new Date().toISOString();
      window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
    }
  } catch {
    // Preserve legacy save even if an old/corrupt workspace cannot be parsed.
  }
}

export function clearStudentBrainStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getStudentBrainStorageKey(): string {
  return STORAGE_KEY;
}
