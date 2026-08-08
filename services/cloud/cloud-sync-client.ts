"use client";

import type { CloudPilotStudent, CloudStudentIdentity } from "@/types/cloud-pilot";
import type { StudentBrainSnapshot } from "@/types/student";

const IDENTITY_KEY = "math-mentor-ai:cloud-student-identity:v1";

async function post<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/pilot-cloud", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || `Cloud request failed (${response.status})`);
  }
  return payload as T;
}

export function loadCloudIdentity(): CloudStudentIdentity | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(IDENTITY_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CloudStudentIdentity;
  } catch {
    return null;
  }
}

export function saveCloudIdentity(identity: CloudStudentIdentity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
}

export function clearCloudIdentity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(IDENTITY_KEY);
}

export async function pullCloudStudent(identity: CloudStudentIdentity): Promise<CloudPilotStudent> {
  return post<CloudPilotStudent>({ action: "studentPull", ...identity });
}

export async function pushCloudStudent(
  identity: CloudStudentIdentity,
  brain: StudentBrainSnapshot,
): Promise<CloudPilotStudent> {
  return post<CloudPilotStudent>({ action: "studentPush", ...identity, brain });
}

export async function teacherListCloudStudents(classCode: string, teacherKey: string): Promise<CloudPilotStudent[]> {
  const result = await post<{ students: CloudPilotStudent[] }>({
    action: "teacherList",
    classCode,
    teacherKey,
  });
  return result.students;
}

export async function teacherUpsertCloudStudent(input: {
  classCode: string;
  accessCode: string;
  teacherKey: string;
  brain: StudentBrainSnapshot;
}): Promise<CloudPilotStudent> {
  return post<CloudPilotStudent>({ action: "teacherUpsert", ...input });
}
