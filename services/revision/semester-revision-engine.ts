import type { SemesterRevisionPlan } from "@/types/revision";
import type { StudentBrainSnapshot } from "@/types/student";
import { getCanonicalSkillDefinitions } from "@/services/student/canonical-skill-registry";
import { hasSufficientMasteryEvidence, normalizeSkillEvidence } from "@/services/student/mastery-integrity-policy";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function buildSemesterRevisionPlan(
  brain: StudentBrainSnapshot,
): SemesterRevisionPlan {
  const skills = [...brain.skills].sort(
    (a, b) => a.masteryScore - b.masteryScore,
  );

  const masteryAverage = average(brain.skills.map((item) => item.masteryScore));
  const confidenceAverage = average(
    brain.skills.map((item) => item.confidence),
  );
  const questionsAttempted = brain.sessions.reduce(
    (sum, session) => sum + session.questionsAttempted,
    0,
  );
  const questionsCorrect = brain.sessions.reduce(
    (sum, session) => sum + session.questionsCorrect,
    0,
  );
  const accuracyAverage =
    questionsAttempted > 0
      ? Math.round((questionsCorrect / questionsAttempted) * 100)
      : 0;

  const weakestSkills = skills.slice(0, 5).map((item) => item.skillName);
  const strongestSkills = skills.slice(-3).reverse().map((item) => item.skillName);

  const tasks = weakestSkills.map((skillName, index) => {
    const skill = skills.find((item) => item.skillName === skillName)!;
    return {
      id: `revision-${index + 1}`,
      title: `Củng cố: ${skillName}`,
      description:
        "Ôn lại kiến thức trọng tâm, làm Adaptive Practice và hoàn thành ít nhất một câu Reasoning.",
      href: "/",
      priority:
        skill.masteryScore < 55
          ? ("HIGH" as const)
          : skill.masteryScore < 70
            ? ("MEDIUM" as const)
            : ("LOW" as const),
      reason: `Mastery ${skill.masteryScore}/100 · Confidence ${skill.confidence}/100.`,
      estimatedMinutes: skill.masteryScore < 55 ? 20 : 12,
    };
  });

  tasks.push({
    id: "revision-mock-test",
    title: "Làm đề mô phỏng học kỳ I",
    description:
      "Đề tổng hợp nhiều chương, chấm điểm ngay và chỉ ra nhóm kỹ năng cần ôn tiếp.",
    href: "/mock-test",
    priority: masteryAverage < 70 ? "HIGH" : "MEDIUM",
    reason: "Kiểm tra mức sẵn sàng trên toàn bộ nội dung học kỳ I.",
    estimatedMinutes: 25,
  });

  // Curriculum coverage is intentionally based only on approved core-progress
  // sessions. Diagnostic/Reasoning evidence is valuable, but it cannot stand in
  // for studying a semester lesson.
  const approvedCoverageSources = new Set(["LESSON", "ADAPTIVE", "LEGACY"]);
  const coveredLessonNumbers = new Set<number>();
  for (const session of brain.sessions) {
    const source = session.source ?? "LEGACY";
    if (!approvedCoverageSources.has(source)) continue;
    const match = session.knowledgeNodeId.match(/^lesson-(\d+)(?:-|$)/);
    if (!match) continue;
    const lessonNumber = Number(match[1]);
    if (lessonNumber >= 1 && lessonNumber <= 19) {
      coveredLessonNumbers.add(lessonNumber);
    }
  }
  const curriculumCoverage = Math.round(
    (coveredLessonNumbers.size / 19) * 100,
  );

  const coreDefinitions = getCanonicalSkillDefinitions().filter(
    (item) => item.tier === "CORE",
  );
  const verifiedCore = new Set(
    brain.skills
      .filter((skill) => {
        const evidence = normalizeSkillEvidence(skill.evidence, skill);
        return skill.status === "MASTERED" && hasSufficientMasteryEvidence(evidence);
      })
      .map((skill) => skill.canonicalSkillId)
      .filter(Boolean),
  );
  const verifiedMasteryCoverage = coreDefinitions.length
    ? Math.round(
        (coreDefinitions.filter((item) => verifiedCore.has(item.skillId)).length /
          coreDefinitions.length) *
          100,
      )
    : 0;

  const unresolvedMisconceptions = brain.mistakes.filter(
    (item) => !item.resolved,
  ).length;
  const unresolvedMisconceptionPenalty = Math.min(
    20,
    unresolvedMisconceptions * 2,
  );

  const observedPerformance = Math.round(
    masteryAverage * 0.45 +
      confidenceAverage * 0.2 +
      accuracyAverage * 0.35,
  );
  const coverageGate = Math.round(
    curriculumCoverage * 0.6 + verifiedMasteryCoverage * 0.4,
  );
  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.min(observedPerformance, coverageGate + 10) -
        unresolvedMisconceptionPenalty,
    ),
  );

  return {
    generatedAt: new Date().toISOString(),
    masteryAverage,
    confidenceAverage,
    accuracyAverage,
    weakestSkills,
    strongestSkills,
    tasks,
    readinessScore,
    curriculumCoverage,
    verifiedMasteryCoverage,
    unresolvedMisconceptionPenalty,
  };
}
