import type { StudentBrainSnapshot } from "@/types/student";

export type CloudPilotStudent = {
  studentId: string;
  classCode: string;
  displayName: string;
  accessCode: string;
  brain: StudentBrainSnapshot;
  updatedAt: string;
};

export type CloudStudentIdentity = {
  classCode: string;
  accessCode: string;
};

export type CloudSyncStatus =
  | { configured: false; message: string }
  | { configured: true; provider: "supabase-rest"; message: string };
