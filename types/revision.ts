export type RevisionPriority = "HIGH" | "MEDIUM" | "LOW";

export type RevisionTask = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: RevisionPriority;
  reason: string;
  estimatedMinutes: number;
};

export type SemesterRevisionPlan = {
  generatedAt: string;
  masteryAverage: number;
  confidenceAverage: number;
  accuracyAverage: number;
  weakestSkills: string[];
  strongestSkills: string[];
  tasks: RevisionTask[];
  readinessScore: number;
  curriculumCoverage: number;
  verifiedMasteryCoverage: number;
  unresolvedMisconceptionPenalty: number;
};

export type MockTestQuestion = {
  id: string;
  lessonId: string;
  chapter: number;
  lessonNumber: number;
  prompt: string;
  choices: Array<{ id: string; text: string }>;
  correctChoiceId: string;
  skillName: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
};

export type MockTestAttempt = {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
};

export type MockTestResult = {
  id: string;
  startedAt: string;
  completedAt: string;
  score: number;
  correct: number;
  total: number;
  chapterBreakdown: Record<string, { correct: number; total: number }>;
  skillMistakes: Record<string, number>;
};

export type PilotAnalyticsSnapshot = {
  generatedAt: string;
  sessionCount: number;
  totalStudyMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  activeMistakes: number;
  averageMastery: number;
  averageConfidence: number;
  mockTestsCompleted: number;
  bestMockTestScore: number | null;
  latestMockTestScore: number | null;
  topWeakSkills: string[];
};
