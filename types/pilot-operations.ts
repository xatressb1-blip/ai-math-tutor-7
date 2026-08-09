export type PilotChecklistItem = {
  id: string;
  label: string;
  phase: "BEFORE" | "DURING" | "AFTER";
  done: boolean;
};

export type PilotStudentSignal = {
  studentId: string;
  displayName: string;
  classCode: string;
  sessions: number;
  skills: number;
  mastery: number;
  accuracy: number;
  openMistakes: number;
  updatedAt: string;
  freshness: "FRESH" | "TODAY" | "STALE";
  needsAttention: boolean;
  reasons: string[];
};

export type PilotOperationsSnapshot = {
  classCode: string;
  generatedAt: string;
  students: PilotStudentSignal[];
  totalStudents: number;
  activeToday: number;
  staleStudents: number;
  attentionStudents: number;
  averageMastery: number;
  averageAccuracy: number;
};
