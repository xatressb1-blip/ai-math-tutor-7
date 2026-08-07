import type { DiagnosticResult } from "@/types/diagnostic";
import type {
  DiagnosticHistoryEntry,
  MasteryStatus,
  StudentBrainSnapshot,
  StudentSkill,
} from "@/types/student";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function status(score: number): MasteryStatus {
  if (score >= 85) return "MASTERED";
  if (score >= 60) return "LEARNING";
  return "NEEDS_REVIEW";
}

const nodeByLesson: Record<number, string> = {
  1: "lesson-1-tap-hop-so-huu-ti",
  2: "lesson-2-phep-tinh-so-huu-ti",
  3: "lesson-3-luy-thua-so-huu-ti",
  4: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
};

export function syncDiagnosticToStudentBrain({
  brain,
  result,
}: {
  brain: StudentBrainSnapshot;
  result: DiagnosticResult;
}): StudentBrainSnapshot {
  const skills = [...brain.skills];

  for (const answer of result.answers.filter((item) => item.lessonNumber > 0)) {
    const existingIndex = skills.findIndex(
      (skill) => skill.skillName === answer.skillName,
    );
    const current = existingIndex >= 0 ? skills[existingIndex] : undefined;
    const sampleScore = answer.isCorrect
      ? 70 + answer.difficulty * 8
      : 30 - answer.difficulty * 5;
    const mastery = current
      ? clamp(current.masteryScore * 0.8 + sampleScore * 0.2)
      : clamp(sampleScore);
    const confidenceSample = answer.isCorrect
      ? Math.max(45, 90 - answer.responseSeconds)
      : Math.max(20, 55 - answer.responseSeconds);
    const confidence = current
      ? clamp(current.confidence * 0.8 + confidenceSample * 0.2)
      : clamp(confidenceSample);

    const next: StudentSkill = {
      id:
        current?.id ??
        `skill-diagnostic-${answer.skillName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`,
      studentId: brain.profile.id,
      skillName: answer.skillName,
      knowledgeNodeId:
        current?.knowledgeNodeId ?? nodeByLesson[answer.lessonNumber] ?? "diagnostic",
      masteryScore: mastery,
      confidence,
      attempts: (current?.attempts ?? 0) + 1,
      correctAttempts: (current?.correctAttempts ?? 0) + (answer.isCorrect ? 1 : 0),
      status: status(mastery),
      lastPracticedAt: result.completedAt,
    };

    if (existingIndex >= 0) skills[existingIndex] = next;
    else skills.push(next);
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
    diagnostics: [entry, ...(brain.diagnostics ?? [])].slice(0, 10),
  };
}
