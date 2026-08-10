import type { DifficultyLevel } from "@/types/knowledge";

export type AcademicSourceType =
  | "SGK"
  | "SBT"
  | "SUPPLEMENT"
  | "ADVANCED"
  | "OFFICIAL_GUIDANCE";

export type AcademicSourceRef = {
  sourceId: string;
  role: "PRIMARY" | "PRACTICE" | "ENRICHMENT" | "ADVANCED_ONLY";
  locator?: string;
  note?: string;
};

export type BloomLevel =
  | "REMEMBER"
  | "UNDERSTAND"
  | "APPLY"
  | "ANALYZE"
  | "EVALUATE"
  | "CREATE";

export type AcademicObjective = {
  id: string;
  statement: string;
  bloom: BloomLevel;
  required: boolean;
  masteryThreshold: number;
};

export type AcademicConcept = {
  id: string;
  title: string;
  summary: string;
  keyIdeas: string[];
  prerequisites: string[];
  representations: Array<"TEXT" | "NUMBER_LINE" | "TABLE" | "DIAGRAM" | "FORMULA" | "REAL_LIFE">;
};

export type AcademicVocabulary = {
  term: string;
  studentFriendlyMeaning: string;
  aliases?: string[];
};

export type TeachingMove = {
  id: string;
  phase: "HOOK" | "DISCOVER" | "EXPLAIN" | "CHECK" | "PRACTICE" | "REFLECT";
  teacherIntent: string;
  aiPrompt: string;
  expectedStudentEvidence: string;
};

export type WorkedExampleBlueprint = {
  id: string;
  title: string;
  purpose: string;
  difficulty: DifficultyLevel;
  context: "PURE_MATH" | "REAL_LIFE";
  keySteps: string[];
  sourceRef?: AcademicSourceRef;
};

export type MisconceptionRule = {
  id: string;
  label: string;
  evidencePattern: string;
  likelyCause: string;
  correctionStrategy: string;
  retrySkill: string;
};

export type HintLadder = {
  skill: string;
  hint1: string;
  hint2: string;
  hint3: string;
  revealPolicy: "NEVER_FIRST" | "AFTER_THREE_ATTEMPTS";
};

export type ReasoningTemplate = {
  id: string;
  skill: string;
  prompt: string;
  requiredIdeas: string[];
  firstErrorFocus: string[];
};

export type PracticeBlueprint = {
  skill: string;
  foundation: number;
  basic: number;
  applied: number;
  advanced: number;
  allowAdvancedOnlyAfterMastery: boolean;
};

export type AcademicEnrichment = {
  id: string;
  level: "PRACTICE" | "APPLIED" | "ADVANCED";
  title: string;
  summary: string;
  gate: "ALWAYS" | "AFTER_FOUNDATION" | "AFTER_MASTERY";
  sourceRef: AcademicSourceRef;
};

export type AcademicActivity = {
  schemaVersion: "1.0";
  id: string;
  grade: 7;
  semester: 1;
  curriculum: "KNTT";
  title: string;
  summary: string;
  skills: string[];
  sourceRefs: AcademicSourceRef[];
};

export type AssessmentBlueprint = {
  diagnosticItems: number;
  checkpointItems: number;
  exitTicketItems: number;
  masteryThreshold: number;
  reasoningRequired: boolean;
};

export type StudentBrainMapping = {
  skillNames: string[];
  mistakeCategories: string[];
  masterySignals: string[];
  confidenceSignals: string[];
};

export type TeacherAnalyticsTag = {
  code: string;
  label: string;
  dimension: "CONTENT" | "PROCESS" | "REASONING" | "SUPPORT";
};

export type AcademicQualityStatus =
  | "SCHEMA_ONLY"
  | "FOUNDATION_READY"
  | "CONTENT_READY"
  | "ACADEMIC_VERIFIED"
  | "PILOT_VERIFIED";

export type AcademicLesson = {
  schemaVersion: "1.0";
  id: string;
  lessonPlayerId?: string;
  chapterId: string;
  chapterNumber: number;
  lessonNumber: number;
  grade: 7;
  semester: 1;
  curriculum: "KNTT";
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: AcademicObjective[];
  concepts: AcademicConcept[];
  vocabulary: AcademicVocabulary[];
  teachingScript: TeachingMove[];
  workedExamples: WorkedExampleBlueprint[];
  misconceptions: MisconceptionRule[];
  hintLadders: HintLadder[];
  reasoningTemplates: ReasoningTemplate[];
  practiceBlueprint: PracticeBlueprint[];
  enrichment?: AcademicEnrichment[];
  assessment: AssessmentBlueprint;
  studentBrain: StudentBrainMapping;
  teacherTags: TeacherAnalyticsTag[];
  sourceRefs: AcademicSourceRef[];
  qualityStatus: AcademicQualityStatus;
};

export type AcademicChapter = {
  schemaVersion: "1.0";
  id: string;
  number: number;
  title: string;
  grade: 7;
  semester: 1;
  curriculum: "KNTT";
  summary: string;
  lessonIds: string[];
  sourceRefs: AcademicSourceRef[];
  qualityStatus: AcademicQualityStatus;
};

export type AcademicValidationIssue = {
  level: "ERROR" | "WARNING";
  path: string;
  message: string;
};

export type AcademicValidationResult = {
  valid: boolean;
  errors: AcademicValidationIssue[];
  warnings: AcademicValidationIssue[];
};
