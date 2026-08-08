import type { StudentBrainSnapshot } from "@/types/student";

export type CloudPilotStudent = {
  studentId: string;
  classCode: string;
  displayName: string;
  accessCodeMasked?: string;
  brain: StudentBrainSnapshot;
  updatedAt: string;
};

export type CloudStudentIdentity = {
  classCode: string;
  accessCode: string;
};

export type CloudHealth = {
  configured: boolean;
  provider: "supabase-rest" | "not-configured";
  databaseReachable: boolean;
  schemaReady: boolean;
  message: string;
  checkedAt: string;
};

export type CloudSyncReceipt = {
  student: CloudPilotStudent;
  serverUpdatedAt: string;
  direction: "PULL" | "PUSH";
};
