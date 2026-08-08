import type { StudentBrainSnapshot } from "@/types/student";
import type { MockTestResult, PilotAnalyticsSnapshot } from "@/types/revision";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function buildPilotAnalytics({
  brain,
  mockTests,
}: {
  brain: StudentBrainSnapshot;
  mockTests: MockTestResult[];
}): PilotAnalyticsSnapshot {
  const questionsAttempted = brain.sessions.reduce(
    (sum, item) => sum + item.questionsAttempted,
    0,
  );
  const questionsCorrect = brain.sessions.reduce(
    (sum, item) => sum + item.questionsCorrect,
    0,
  );
  const weak = [...brain.skills]
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, 5)
    .map((item) => item.skillName);

  return {
    generatedAt: new Date().toISOString(),
    sessionCount: brain.sessions.length,
    totalStudyMinutes: brain.sessions.reduce(
      (sum, item) => sum + item.durationMinutes,
      0,
    ),
    questionsAttempted,
    questionsCorrect,
    accuracy:
      questionsAttempted > 0
        ? Math.round((questionsCorrect / questionsAttempted) * 100)
        : 0,
    activeMistakes: brain.mistakes
      .filter((item) => !item.resolved)
      .reduce((sum, item) => sum + item.count, 0),
    averageMastery: average(brain.skills.map((item) => item.masteryScore)),
    averageConfidence: average(brain.skills.map((item) => item.confidence)),
    mockTestsCompleted: mockTests.length,
    bestMockTestScore:
      mockTests.length > 0
        ? Math.max(...mockTests.map((item) => item.score))
        : null,
    latestMockTestScore:
      mockTests.length > 0 ? mockTests.at(-1)!.score : null,
    topWeakSkills: weak,
  };
}
