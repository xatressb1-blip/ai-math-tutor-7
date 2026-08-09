import type { CloudPilotStudent } from "@/types/cloud-pilot";
import type {
  PilotOperationsSnapshot,
  PilotStudentSignal,
} from "@/types/pilot-operations";

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getFreshness(updatedAt: string): PilotStudentSignal["freshness"] {
  const ageMinutes = (Date.now() - new Date(updatedAt).getTime()) / 60_000;
  if (ageMinutes <= 30) return "FRESH";
  if (ageMinutes <= 24 * 60) return "TODAY";
  return "STALE";
}

export function buildPilotOperationsSnapshot(
  classCode: string,
  cloud: CloudPilotStudent[],
): PilotOperationsSnapshot {
  const students = cloud.map<PilotStudentSignal>((row) => {
    const brain = row.brain;
    const attempts = brain.sessions.reduce(
      (sum, item) => sum + item.questionsAttempted,
      0,
    );
    const correct = brain.sessions.reduce(
      (sum, item) => sum + item.questionsCorrect,
      0,
    );
    const mastery = average(brain.skills.map((item) => item.masteryScore));
    const openMistakes = brain.mistakes
      .filter((item) => !item.resolved)
      .reduce((sum, item) => sum + item.count, 0);
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
    const freshness = getFreshness(row.updatedAt);

    const reasons: string[] = [];
    if (freshness === "STALE") reasons.push("Chưa đồng bộ trong 24 giờ");
    if (brain.sessions.length === 0) reasons.push("Chưa có phiên học");
    if (brain.skills.length > 0 && mastery < 55) reasons.push("Mastery dưới 55");
    if (openMistakes >= 3) reasons.push("Có nhiều lỗi chưa xử lý");

    return {
      studentId: row.studentId,
      displayName: row.displayName,
      classCode: row.classCode,
      sessions: brain.sessions.length,
      skills: brain.skills.length,
      mastery,
      accuracy,
      openMistakes,
      updatedAt: row.updatedAt,
      freshness,
      needsAttention: reasons.length > 0,
      reasons,
    };
  });

  return {
    classCode,
    generatedAt: new Date().toISOString(),
    students,
    totalStudents: students.length,
    activeToday: students.filter((item) => item.freshness !== "STALE").length,
    staleStudents: students.filter((item) => item.freshness === "STALE").length,
    attentionStudents: students.filter((item) => item.needsAttention).length,
    averageMastery: average(students.map((item) => item.mastery)),
    averageAccuracy: average(students.map((item) => item.accuracy)),
  };
}
