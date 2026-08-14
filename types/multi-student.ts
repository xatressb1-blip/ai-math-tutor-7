import type { StudentBrainSnapshot, StudentProfile } from "@/types/student";

export type PilotStudentStatus = "ACTIVE" | "PAUSED";

export type PilotStudentRecord = {
  profile: StudentProfile;
  status: PilotStudentStatus;
  joinedAt: string;
  lastActiveAt?: string;
  classCode?: string;
  accessCode?: string;
  cloudEnabled?: boolean;
};

export type MultiStudentWorkspace = {
  schemaVersion: 1;
  activeStudentId: string;
  students: PilotStudentRecord[];
  brains: Record<string, StudentBrainSnapshot>;
  updatedAt: string;
};

export type StudentDataProvider = {
  loadWorkspace(): MultiStudentWorkspace | null;
  saveWorkspace(workspace: MultiStudentWorkspace): void;
};
