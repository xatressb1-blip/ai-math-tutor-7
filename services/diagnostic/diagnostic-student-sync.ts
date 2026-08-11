import type { DiagnosticResult } from "@/types/diagnostic";
import {
  capMasteryByEvidence,
  mergeSkillEvidence,
  statusFromMasteryWithEvidence,
} from "@/services/student/mastery-integrity-policy";
import type {
  DiagnosticHistoryEntry,
  MistakeRecord,
  StudentBrainSnapshot,
  StudentSkill,
} from "@/types/student";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const nodeByLesson: Record<number, string> = {
  1: "lesson-1-tap-hop-so-huu-ti",
  2: "lesson-2-phep-tinh-so-huu-ti",
  3: "lesson-3-luy-thua-so-huu-ti",
  4: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
};

function upsertDiagnosticMistake({
  mistakes,
  studentId,
  skill,
  category,
  label,
  timestamp,
}: {
  mistakes: MistakeRecord[];
  studentId: string;
  skill: StudentSkill;
  category: MistakeRecord["category"];
  label: string;
  timestamp: string;
}): void {
  const description = `${label} · Diagnostic · Kỹ năng: ${skill.skillName}.`;
  const index = mistakes.findIndex(
    (item) =>
      item.skillId === skill.id &&
      item.category === category &&
      item.description === description,
  );
  if (index >= 0) {
    mistakes[index] = {
      ...mistakes[index],
      count: mistakes[index].count + 1,
      lastSeenAt: timestamp,
      resolved: false,
    };
    return;
  }
  mistakes.push({
    id: `mistake-diagnostic-${slug(skill.skillName)}-${Date.now()}-${mistakes.length}`,
    studentId,
    skillId: skill.id,
    category,
    description,
    count: 1,
    lastSeenAt: timestamp,
    resolved: false,
  });
}

export function syncDiagnosticToStudentBrain({
  brain,
  result,
}: {
  brain: StudentBrainSnapshot;
  result: DiagnosticResult;
}): StudentBrainSnapshot {
  const skills = [...brain.skills];
  const mistakes = [...brain.mistakes];

  for (const answer of result.answers.filter((item) => item.lessonNumber > 0)) {
    const existingIndex = skills.findIndex(
      (skill) => skill.skillName === answer.skillName,
    );
    const current = existingIndex >= 0 ? skills[existingIndex] : undefined;

    // Diagnostic is screening evidence, not mastery proof.
    const sampleScore = answer.isCorrect
      ? 70 + answer.difficulty * 8
      : 30 - answer.difficulty * 5;
    const rawMastery = current
      ? clamp(current.masteryScore * 0.8 + sampleScore * 0.2)
      : clamp(sampleScore);
    const confidenceSample = answer.isCorrect
      ? Math.max(45, 90 - answer.responseSeconds)
      : Math.max(20, 55 - answer.responseSeconds);
    const confidence = current
      ? clamp(current.confidence * 0.8 + confidenceSample * 0.2)
      : clamp(confidenceSample);

    const evidence = mergeSkillEvidence(
      current?.evidence,
      {
        diagnosticCorrect: answer.isCorrect ? 1 : 0,
        independentFirstTryCorrect: 0,
        wrongAttempts: answer.isCorrect ? 0 : 1,
        misconceptionCount: answer.isCorrect || !answer.diagnosisLabel ? 0 : 1,
        sources: ["DIAGNOSTIC"],
      },
      current,
    );
    const mastery = capMasteryByEvidence(rawMastery, evidence);

    const next: StudentSkill = {
      id: current?.id ?? `skill-diagnostic-${slug(answer.skillName)}`,
      studentId: brain.profile.id,
      skillName: answer.skillName,
      knowledgeNodeId:
        current?.knowledgeNodeId ?? nodeByLesson[answer.lessonNumber] ?? "diagnostic",
      masteryScore: mastery,
      confidence,
      attempts: (current?.attempts ?? 0) + 1,
      correctAttempts: (current?.correctAttempts ?? 0) + (answer.isCorrect ? 1 : 0),
      status: statusFromMasteryWithEvidence(mastery, evidence),
      lastPracticedAt: result.completedAt,
      evidence,
    };

    if (existingIndex >= 0) skills[existingIndex] = next;
    else skills.push(next);

    if (!answer.isCorrect) {
      upsertDiagnosticMistake({
        mistakes,
        studentId: brain.profile.id,
        skill: next,
        category: answer.mistakeCategory ?? "CONCEPT",
        label: answer.diagnosisLabel ?? `Diagnostic chưa chắc: ${answer.skillName}`,
        timestamp: result.completedAt,
      });
    }
  }

  const entry: DiagnosticHistoryEntry = {
    id: result.id,
    completedAt: result.completedAt,
    score: result.score,
    confidence: result.confidence,
    startingLessonId: result.startingLessonId,
    startingLessonNumber: result.startingLessonNumber,
    recommendation: result.recommendation,
  };

  return {
    ...brain,
    skills,
    mistakes,
    diagnostics: [entry, ...(brain.diagnostics ?? [])].slice(0, 10),
  };
}
