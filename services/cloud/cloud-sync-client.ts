"use client";

import type { CloudHealth, CloudPilotStudent, CloudStudentIdentity, CloudSyncReceipt } from "@/types/cloud-pilot";
import type { StudentBrainSnapshot } from "@/types/student";

const IDENTITY_KEY = "math-mentor-ai:cloud-student-identity:v1";
const LAST_SYNC_KEY = "math-mentor-ai:cloud-last-sync:v1";

async function request<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/pilot-cloud", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Cloud request failed (${response.status})`);
  return payload as T;
}

export async function getCloudHealth(): Promise<CloudHealth> {
  const response = await fetch("/api/pilot-cloud?health=1", { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || "Không kiểm tra được Cloud.");
  return payload as CloudHealth;
}

export function loadCloudIdentity(): CloudStudentIdentity | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(IDENTITY_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as CloudStudentIdentity; } catch { return null; }
}
export function saveCloudIdentity(identity: CloudStudentIdentity): void {
  if (typeof window !== "undefined") window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
}
export function clearCloudIdentity(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(IDENTITY_KEY);
}
export function saveLastCloudSync(value: string): void {
  if (typeof window !== "undefined") window.localStorage.setItem(LAST_SYNC_KEY, value);
}
export function loadLastCloudSync(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem(LAST_SYNC_KEY);
}

export async function pullCloudStudent(identity: CloudStudentIdentity): Promise<CloudSyncReceipt> {
  return request<CloudSyncReceipt>({ action: "studentPull", ...identity });
}
export async function pushCloudStudent(identity: CloudStudentIdentity, brain: StudentBrainSnapshot): Promise<CloudSyncReceipt> {
  return request<CloudSyncReceipt>({ action: "studentPush", ...identity, brain });
}
export async function teacherListCloudStudents(classCode: string, teacherKey: string): Promise<CloudPilotStudent[]> {
  const result = await request<{ students: CloudPilotStudent[] }>({ action: "teacherList", classCode, teacherKey });
  return result.students;
}
export async function teacherUpsertCloudStudent(input: {
  classCode: string; accessCode: string; teacherKey: string; brain: StudentBrainSnapshot;
}): Promise<CloudPilotStudent> {
  const result = await request<{ student: CloudPilotStudent }>({ action: "teacherUpsert", ...input });
  return result.student;
}
export async function teacherDeleteCloudStudent(input: {
  classCode: string; studentId: string; teacherKey: string;
}): Promise<void> {
  await request<{ ok: true }>({ action: "teacherDelete", ...input });
}
