export type MasteryStatus =
  | "NOT_STARTED"
  | "LEARNING"
  | "NEEDS_REVIEW"
  | "MASTERED";

export type MistakeCategory =
  | "CONCEPT"
  | "CALCULATION"
  | "SIGN"
  | "ORDER_OF_OPERATIONS"
  | "PROCEDURE"
  | "READING";


export type MasteryEvidenceSource =
  | "DIAGNOSTIC"
  | "LESSON_CORE"
  | "ADAPTIVE"
  | "REASONING"
  | "LEGACY";

export type SkillEvidenceProfile = {
  diagnosticCorrect: number;
  lessonCoreCorrect: number;
  adaptiveCorrect: number;
  reasoningCorrectSteps: number;
  independentFirstTryCorrect: number;
  wrongAttempts: number;
  misconceptionCount: number;
  sources: MasteryEvidenceSource[];
};

export type StudentProfile = {
  id: string;
  displayName: string;
  grade: number;
  className?: string;
  goal: string;
  preferredSessionMinutes: number;
  createdAt: string;
};

export type StudentSkill = {
  id: string;
  studentId: string;
  skillName: string;
  knowledgeNodeId: string;
  masteryScore: number;
  confidence: number;
  attempts: number;
  correctAttempts: number;
  status: MasteryStatus;
  lastPracticedAt?: string;
  /**
   * Evidence metadata added in v2.8.2-beta.3.
   * Optional for backward compatibility with Student Brain snapshots from older betas.
   */
  evidence?: SkillEvidenceProfile;
};

export type MistakeRecord = {
  id: string;
  studentId: string;
  skillId: string;
  category: MistakeCategory;
  description: string;
  count: number;
  lastSeenAt: string;
  resolved: boolean;
};

export type LearningSession = {
  id: string;
  studentId: string;
  knowledgeNodeId: string;
  startedAt: string;
  durationMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  note: string;
};


export type DiagnosticHistoryEntry = {
  id: string;
  completedAt: string;
  score: number;
  confidence: number;
  startingLessonId: string;
  startingLessonNumber: 1 | 2 | 3 | 4;
  recommendation: string;
};

export type StudentBrainSnapshot = {
  profile: StudentProfile;
  skills: StudentSkill[];
  mistakes: MistakeRecord[];
  sessions: LearningSession[];

  /**
   * Lịch sử Diagnostic đầu vào gần nhất.
   * Optional để tương thích ngược với Student Brain đã lưu từ các Beta cũ.
   */
  diagnostics?: DiagnosticHistoryEntry[];
};
