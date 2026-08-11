import type { LessonDefinition } from "@/types/lesson";
import {
  canonicalSkillId,
  canonicalSkillName,
  sameCanonicalSkill,
} from "@/services/student/canonical-skill-registry";
import type { ReasoningSessionSummary } from "@/types/reasoning";
import {
  capMasteryByEvidence,
  mergeSkillEvidence,
  statusFromMasteryWithEvidence,
} from "@/services/student/mastery-integrity-policy";
import type { StudentBrainSnapshot, StudentSkill } from "@/types/student";

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

export function syncReasoningSessionToStudentBrain({
  brain,
  lesson,
  summary,
}: {
  brain: StudentBrainSnapshot;
  lesson: LessonDefinition;
  summary: ReasoningSessionSummary;
}): StudentBrainSnapshot {
  const now = summary.completedAt;
  const existingIndex = brain.skills.findIndex(
    (skill) => sameCanonicalSkill(skill.skillName, summary.skillName),
  );
  const existing = existingIndex >= 0 ? brain.skills[existingIndex] : undefined;

  const independenceScore = 100 - summary.hintDependencyScore;
  const sessionMastery = clamp(
    summary.reasoningScore * 0.55 +
      summary.persistenceScore * 0.15 +
      summary.firstAttemptAccuracy * 0.15 +
      summary.recoveryScore * 0.1 +
      independenceScore * 0.05,
  );

  const rawMastery = existing
    ? clamp(existing.masteryScore * 0.75 + sessionMastery * 0.25)
    : sessionMastery;
  const confidence = existing
    ? clamp(
        existing.confidence * 0.7 +
          summary.firstAttemptAccuracy * 0.15 +
          independenceScore * 0.15,
      )
    : clamp(summary.firstAttemptAccuracy * 0.55 + independenceScore * 0.45);

  const correctSteps = new Set(
    summary.attempts.filter((item) => item.isCorrect).map((item) => item.stepId),
  ).size;
  const firstTryCorrect = new Set(
    summary.attempts
      .filter((item) => item.isCorrect && item.attemptNumber === 1)
      .map((item) => item.stepId),
  ).size;
  const evidence = mergeSkillEvidence(
    existing?.evidence,
    {
      reasoningCorrectSteps: correctSteps,
      independentFirstTryCorrect: firstTryCorrect,
      wrongAttempts: summary.attempts.filter((item) => !item.isCorrect).length,
      misconceptionCount: summary.attempts.filter((item) => Boolean(item.category)).length,
      sources: correctSteps > 0 ? ["REASONING"] : [],
    },
    existing,
  );
  const mastery = capMasteryByEvidence(rawMastery, evidence);

  const skill: StudentSkill = {
    id: existing?.id ?? `skill-${canonicalSkillId(summary.skillName).toLowerCase()}`,
    studentId: brain.profile.id,
    skillName: canonicalSkillName(summary.skillName),
    canonicalSkillId: canonicalSkillId(summary.skillName),
    knowledgeNodeId: lesson.knowledgeNodeId,
    masteryScore: mastery,
    confidence,
    attempts: (existing?.attempts ?? 0) + summary.attempts.length,
    correctAttempts:
      (existing?.correctAttempts ?? 0) +
      summary.attempts.filter((item) => item.isCorrect).length,
    status: statusFromMasteryWithEvidence(mastery, evidence),
    lastPracticedAt: now,
    evidence,
  };

  const skills = [...brain.skills];
  if (existingIndex >= 0) skills[existingIndex] = skill;
  else skills.push(skill);

  const mistakes = [...brain.mistakes];
  for (const attempt of summary.attempts.filter((item) => item.category)) {
    const description = `${attempt.diagnosis ?? "Lập luận chưa đúng"} · Kỹ năng: ${summary.skillName}.`;
    const found = mistakes.findIndex(
      (item) =>
        item.skillId === skill.id &&
        item.category === attempt.category &&
        item.description === description,
    );
    if (found >= 0) {
      mistakes[found] = {
        ...mistakes[found],
        count: mistakes[found].count + 1,
        lastSeenAt: now,
        resolved: false,
      };
    } else {
      mistakes.push({
        id: `mistake-reasoning-${Date.now()}-${mistakes.length}`,
        studentId: brain.profile.id,
        skillId: skill.id,
        category: attempt.category ?? "CONCEPT",
        description,
        count: 1,
        lastSeenAt: now,
        resolved: false,
      });
    }
  }

  return {
    ...brain,
    skills,
    mistakes,
    sessions: [
      ...brain.sessions,
      {
        id: `reasoning-session-${Date.now()}`,
        studentId: brain.profile.id,
        knowledgeNodeId: lesson.knowledgeNodeId,
        startedAt: summary.startedAt,
        durationMinutes: Math.max(
          1,
          Math.round(
            (new Date(summary.completedAt).getTime() -
              new Date(summary.startedAt).getTime()) /
              60000,
          ),
        ),
        questionsAttempted: summary.attempts.length,
        questionsCorrect: summary.attempts.filter((item) => item.isCorrect).length,
        note:
          `Step Analyzer · Reasoning ${summary.reasoningScore}/100 · ` +
          `First attempt ${summary.firstAttemptAccuracy}% · ` +
          `Hint dependency ${summary.hintDependencyScore}% · ` +
          `Recovery ${summary.recoveryScore}% · ` +
          `Persistence ${summary.persistenceScore}/100 · ` +
          `Misconceptions ${summary.misconceptionCount} · Evidence-gated mastery.`,
      },
    ],
  };
}
