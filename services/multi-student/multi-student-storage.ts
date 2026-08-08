"use client";

import type { StudentBrainSnapshot, StudentProfile } from "@/types/student";
import type { MultiStudentWorkspace, StudentDataProvider } from "@/types/multi-student";
import { getDemoStudentBrain } from "@/services/student/student-brain-service";
import { loadStudentBrainFromStorage } from "@/services/student/student-brain-storage";

const KEY = "math-mentor-ai:multi-student-workspace:v1";

const localProvider: StudentDataProvider = {
  loadWorkspace() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as MultiStudentWorkspace;
      return parsed?.schemaVersion === 1 ? parsed : null;
    } catch {
      return null;
    }
  },
  saveWorkspace(workspace) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(workspace));
  },
};

export function loadMultiStudentWorkspace(): MultiStudentWorkspace {
  const existing = localProvider.loadWorkspace();
  if (existing) return existing;

  const legacyBrain = loadStudentBrainFromStorage() ?? getDemoStudentBrain();
  const workspace: MultiStudentWorkspace = {
    schemaVersion: 1,
    activeStudentId: legacyBrain.profile.id,
    students: [{
      profile: legacyBrain.profile,
      status: "ACTIVE",
      joinedAt: legacyBrain.profile.createdAt,
      lastActiveAt: new Date().toISOString(),
    }],
    brains: { [legacyBrain.profile.id]: legacyBrain },
    updatedAt: new Date().toISOString(),
  };
  localProvider.saveWorkspace(workspace);
  return workspace;
}

export function saveMultiStudentWorkspace(workspace: MultiStudentWorkspace): void {
  localProvider.saveWorkspace({ ...workspace, updatedAt: new Date().toISOString() });
}

export function createPilotStudent(
  workspace: MultiStudentWorkspace,
  input: { displayName: string; className: string; goal?: string },
): MultiStudentWorkspace {
  const id = `pilot-student-${Date.now()}`;
  const now = new Date().toISOString();
  const profile: StudentProfile = {
    id,
    displayName: input.displayName.trim(),
    grade: 7,
    className: input.className.trim(),
    goal: input.goal?.trim() || "Nắm vững Toán 7 học kỳ I",
    preferredSessionMinutes: 25,
    createdAt: now,
  };
  const brain: StudentBrainSnapshot = {
    profile,
    skills: [],
    mistakes: [],
    sessions: [],
    diagnostics: [],
  };
  return {
    ...workspace,
    activeStudentId: id,
    students: [...workspace.students, { profile, status: "ACTIVE", joinedAt: now, lastActiveAt: now }],
    brains: { ...workspace.brains, [id]: brain },
    updatedAt: now,
  };
}

export function setActivePilotStudent(
  workspace: MultiStudentWorkspace,
  studentId: string,
): MultiStudentWorkspace {
  if (!workspace.brains[studentId]) return workspace;
  return {
    ...workspace,
    activeStudentId: studentId,
    students: workspace.students.map((item) =>
      item.profile.id === studentId ? { ...item, lastActiveAt: new Date().toISOString() } : item
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function upsertStudentBrain(
  workspace: MultiStudentWorkspace,
  brain: StudentBrainSnapshot,
): MultiStudentWorkspace {
  return {
    ...workspace,
    brains: { ...workspace.brains, [brain.profile.id]: brain },
    updatedAt: new Date().toISOString(),
  };
}
