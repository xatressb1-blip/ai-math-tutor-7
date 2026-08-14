import type { LearningSession, StudentBrainSnapshot } from "@/types/student";
import type {
  ClassAnalyticsSnapshot,
  SkillClassAnalytics,
  StudentAnalytics,
  TeacherStudentRecord,
} from "@/types/teacher";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function parseMetric(note: string, label: string): number | null {
  const expression = new RegExp(`${label}\\s+(\\d{1,3})`, "i");
  const match = note.match(expression);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
}

function sessionAccuracy(session: LearningSession): number {
  if (session.questionsAttempted <= 0) return 0;
  return Math.round(
    (session.questionsCorrect / session.questionsAttempted) * 100,
  );
}

function getReasoningMetrics(brain: StudentBrainSnapshot): {
  reasoning: number | null;
  hintDependency: number | null;
} {
  const reasoning: number[] = [];
  const hint: number[] = [];

  for (const session of brain.sessions) {
    const reasoningValue = parseMetric(session.note, "Reasoning");
    const hintValue = parseMetric(session.note, "Hint dependency");
    if (reasoningValue !== null) reasoning.push(reasoningValue);
    if (hintValue !== null) hint.push(hintValue);
  }

  return {
    reasoning: reasoning.length > 0 ? average(reasoning) : null,
    hintDependency: hint.length > 0 ? average(hint) : null,
  };
}

export function buildStudentAnalytics(
  record: TeacherStudentRecord,
): StudentAnalytics {
  const brain = record.brain;
  const masteryAverage = average(brain.skills.map((skill) => skill.masteryScore));
  const confidenceAverage = average(
    brain.skills.map((skill) => skill.confidence),
  );
  const accuracyAverage = average(brain.sessions.map(sessionAccuracy));
  const totalStudyMinutes = brain.sessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0,
  );
  const activeMistakes = brain.mistakes
    .filter((mistake) => !mistake.resolved)
    .reduce((sum, mistake) => sum + mistake.count, 0);
  const { reasoning, hintDependency } = getReasoningMetrics(brain);

  const sortedSkills = [...brain.skills].sort(
    (a, b) => a.masteryScore - b.masteryScore,
  );
  const weakestSkill = sortedSkills[0]?.skillName ?? null;
  const strongestSkill = sortedSkills.at(-1)?.skillName ?? null;

  const completionScore = Math.round(
    masteryAverage * 0.35 +
      confidenceAverage * 0.2 +
      accuracyAverage * 0.3 +
      (reasoning ?? accuracyAverage) * 0.15,
  );

  const supportLevel =
    completionScore < 58 || activeMistakes >= 8
      ? "NEEDS_SUPPORT"
      : completionScore < 72 || activeMistakes >= 5
        ? "WATCH"
        : "ON_TRACK";

  const recommendation =
    supportLevel === "NEEDS_SUPPORT"
      ? `Cần hỗ trợ trực tiếp. Ưu tiên ${weakestSkill ?? "kỹ năng nền tảng"} và giảm phụ thuộc gợi ý.`
      : supportLevel === "WATCH"
        ? `Theo dõi thêm. Nên luyện ${weakestSkill ?? "kỹ năng yếu nhất"} trong 10–15 phút.`
        : `Đang tiến triển tốt. Có thể tăng dần độ khó ở ${strongestSkill ?? "kỹ năng mạnh"}.`;

  return {
    studentId: record.id,
    displayName: record.displayName,
    className: record.className,
    source: record.source,
    masteryAverage,
    confidenceAverage,
    accuracyAverage,
    totalStudyMinutes,
    sessionCount: brain.sessions.length,
    activeMistakes,
    reasoningScore: reasoning,
    hintDependency,
    completionScore,
    supportLevel,
    strongestSkill,
    weakestSkill,
    recommendation,
  };
}

function buildSkillAnalytics(
  students: TeacherStudentRecord[],
): SkillClassAnalytics[] {
  const groups = new Map<
    string,
    { mastery: number[]; confidence: number[]; struggling: number }
  >();

  for (const student of students) {
    for (const skill of student.brain.skills) {
      const current = groups.get(skill.skillName) ?? {
        mastery: [],
        confidence: [],
        struggling: 0,
      };
      current.mastery.push(skill.masteryScore);
      current.confidence.push(skill.confidence);
      if (skill.masteryScore < 60) current.struggling += 1;
      groups.set(skill.skillName, current);
    }
  }

  return [...groups.entries()]
    .map(([skillName, values]) => ({
      skillName,
      studentCount: values.mastery.length,
      masteryAverage: average(values.mastery),
      confidenceAverage: average(values.confidence),
      strugglingCount: values.struggling,
    }))
    .sort(
      (a, b) =>
        b.strugglingCount - a.strugglingCount ||
        a.masteryAverage - b.masteryAverage,
    );
}

export function buildClassAnalytics(
  students: TeacherStudentRecord[],
  className = "7A",
): ClassAnalyticsSnapshot {
  const studentAnalytics = students
    .map(buildStudentAnalytics)
    .sort((a, b) => a.completionScore - b.completionScore);

  const mistakeMap = new Map<string, number>();
  for (const student of students) {
    for (const mistake of student.brain.mistakes.filter(
      (item) => !item.resolved,
    )) {
      mistakeMap.set(
        mistake.description,
        (mistakeMap.get(mistake.description) ?? 0) + mistake.count,
      );
    }
  }

  const reasoningScores = studentAnalytics
    .map((student) => student.reasoningScore)
    .filter((value): value is number => value !== null);

  return {
    className,
    studentCount: studentAnalytics.length,
    averageMastery: average(
      studentAnalytics.map((student) => student.masteryAverage),
    ),
    averageConfidence: average(
      studentAnalytics.map((student) => student.confidenceAverage),
    ),
    averageAccuracy: average(
      studentAnalytics.map((student) => student.accuracyAverage),
    ),
    averageReasoning:
      reasoningScores.length > 0 ? average(reasoningScores) : null,
    totalStudyMinutes: studentAnalytics.reduce(
      (sum, student) => sum + student.totalStudyMinutes,
      0,
    ),
    studentsNeedingSupport: studentAnalytics.filter(
      (student) => student.supportLevel === "NEEDS_SUPPORT",
    ).length,
    studentsOnTrack: studentAnalytics.filter(
      (student) => student.supportLevel === "ON_TRACK",
    ).length,
    commonMistakes: [...mistakeMap.entries()]
      .map(([description, count]) => ({ description, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    skills: buildSkillAnalytics(students),
    students: studentAnalytics,
  };
}
