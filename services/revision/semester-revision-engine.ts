import type { SemesterRevisionPlan } from "@/types/revision";
import type { StudentBrainSnapshot } from "@/types/student";

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

  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        masteryAverage * 0.45 +
          confidenceAverage * 0.2 +
          accuracyAverage * 0.35,
      ),
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
  };
}
