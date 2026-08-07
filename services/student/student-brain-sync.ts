import type { LessonDefinition } from "@/types/lesson";
import type {
  MasteryStatus,
  MistakeRecord,
  StudentBrainSnapshot,
  StudentSkill,
} from "@/types/student";
import type {
  SessionAttempt,
  SkillSessionSummary,
  TeachingSessionSummary,
} from "@/types/teaching-session";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function statusFromMastery(score: number): MasteryStatus {
  if (score >= 85) return "MASTERED";
  if (score >= 65) return "LEARNING";
  return "NEEDS_REVIEW";
}

function calculateSessionMastery(skill: SkillSessionSummary): number {
  if (skill.questionsSeen === 0) return 0;

  const correctRatio = skill.correctQuestions / skill.questionsSeen;
  const firstTryRatio = skill.firstTryCorrect / skill.questionsSeen;

  return clamp(
    correctRatio * 50 + firstTryRatio * 25 + skill.averageConfidence * 0.25,
  );
}

function mergeSkill({
  current,
  session,
  studentId,
  knowledgeNodeId,
  timestamp,
}: {
  current?: StudentSkill;
  session: SkillSessionSummary;
  studentId: string;
  knowledgeNodeId: string;
  timestamp: string;
}): StudentSkill {
  const sessionMastery = calculateSessionMastery(session);
  const nextMastery = current
    ? clamp(current.masteryScore * 0.7 + sessionMastery * 0.3)
    : sessionMastery;
  const nextConfidence = current
    ? clamp(current.confidence * 0.65 + session.averageConfidence * 0.35)
    : clamp(session.averageConfidence);

  return {
    id: current?.id ?? `skill-${slugify(session.skillName)}`,
    studentId,
    skillName: session.skillName,
    knowledgeNodeId: current?.knowledgeNodeId ?? knowledgeNodeId,
    masteryScore: nextMastery,
    confidence: nextConfidence,
    attempts: (current?.attempts ?? 0) + session.questionsSeen,
    correctAttempts: (current?.correctAttempts ?? 0) + session.correctQuestions,
    status: statusFromMastery(nextMastery),
    lastPracticedAt: timestamp,
  };
}

function buildMistakeDescription({
  skillName,
  diagnosisLabel,
}: {
  skillName: string;
  diagnosisLabel?: string;
}): string {
  return diagnosisLabel
    ? `${diagnosisLabel} · Kỹ năng: ${skillName}.`
    : `Cần củng cố kỹ năng “${skillName}” vì có lượt trả lời chưa đúng trong buổi học.`;
}

function mergeMistakes({
  currentMistakes,
  attempts,
  skills,
  studentId,
  timestamp,
}: {
  currentMistakes: MistakeRecord[];
  attempts: SessionAttempt[];
  skills: StudentSkill[];
  studentId: string;
  timestamp: string;
}): MistakeRecord[] {
  const next = currentMistakes.map((item) => ({ ...item }));
  const wrongGroups = new Map<
    string,
    {
      skillName: string;
      diagnosisLabel?: string;
      category: MistakeRecord["category"];
      count: number;
    }
  >();

  for (const attempt of attempts) {
    if (attempt.isCorrect) continue;

    const category = attempt.mistakeCategory ?? "CONCEPT";
    const diagnosisLabel = attempt.diagnosisLabel;
    const key = `${attempt.skillName}::${category}::${diagnosisLabel ?? "generic"}`;
    const current = wrongGroups.get(key);
    wrongGroups.set(key, {
      skillName: attempt.skillName,
      diagnosisLabel,
      category,
      count: (current?.count ?? 0) + 1,
    });
  }

  for (const group of wrongGroups.values()) {
    const skill = skills.find((item) => item.skillName === group.skillName);
    if (!skill) continue;

    const description = buildMistakeDescription({
      skillName: group.skillName,
      diagnosisLabel: group.diagnosisLabel,
    });
    const existingIndex = next.findIndex(
      (item) =>
        item.skillId === skill.id &&
        item.category === group.category &&
        item.description === description,
    );

    if (existingIndex >= 0) {
      next[existingIndex] = {
        ...next[existingIndex],
        count: next[existingIndex].count + group.count,
        lastSeenAt: timestamp,
        resolved: false,
      };
    } else {
      next.push({
        id: `mistake-${slugify(group.skillName)}-${Date.now()}-${next.length}`,
        studentId,
        skillId: skill.id,
        category: group.category,
        description,
        count: group.count,
        lastSeenAt: timestamp,
        resolved: false,
      });
    }
  }

  return next;
}

export function syncTeachingSessionToStudentBrain({
  brain,
  lesson,
  summary,
  attempts,
  startedAt,
  completedAt,
}: {
  brain: StudentBrainSnapshot;
  lesson: LessonDefinition;
  summary: TeachingSessionSummary;
  attempts: SessionAttempt[];
  startedAt: string;
  completedAt: string;
}): StudentBrainSnapshot {
  const skills = [...brain.skills];

  for (const skillSummary of summary.skills) {
    const existingIndex = skills.findIndex(
      (item) => item.skillName === skillSummary.skillName,
    );
    const current = existingIndex >= 0 ? skills[existingIndex] : undefined;
    const merged = mergeSkill({
      current,
      session: skillSummary,
      studentId: brain.profile.id,
      knowledgeNodeId: lesson.knowledgeNodeId,
      timestamp: completedAt,
    });

    if (existingIndex >= 0) skills[existingIndex] = merged;
    else skills.push(merged);
  }

  const mistakes = mergeMistakes({
    currentMistakes: brain.mistakes,
    attempts,
    skills,
    studentId: brain.profile.id,
    timestamp: completedAt,
  });

  const strengths = summary.strengths.length
    ? `Điểm mạnh: ${summary.strengths.join(", ")}.`
    : "Chưa có kỹ năng đủ dữ liệu để xác định là điểm mạnh.";
  const review = summary.reviewSkills.length
    ? ` Cần ôn: ${summary.reviewSkills.join(", ")}.`
    : " Không có kỹ năng cần ưu tiên ôn lại.";

  return {
    ...brain,
    skills,
    mistakes,
    sessions: [
      ...brain.sessions,
      {
        id: `session-${Date.now()}`,
        studentId: brain.profile.id,
        knowledgeNodeId: lesson.knowledgeNodeId,
        startedAt,
        durationMinutes: summary.elapsedMinutes,
        questionsAttempted: summary.totalQuestions,
        questionsCorrect: summary.correctQuestions,
        note: `${strengths}${review} Confidence ${summary.confidenceScore}/100.`,
      },
    ],
  };
}
