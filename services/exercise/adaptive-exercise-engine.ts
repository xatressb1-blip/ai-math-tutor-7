import { sameCanonicalSkill } from "@/services/student/canonical-skill-registry";
import type {
  AdaptiveDifficulty,
  AdaptiveExercise,
  AdaptiveExerciseDecision,
  AdaptivePracticeReport,
} from "@/types/adaptive-exercise";
import type { StudentBrainSnapshot } from "@/types/student";
import type { SessionAttempt } from "@/types/teaching-session";

function clampDifficulty(value: number): AdaptiveDifficulty {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return 2;
}

function getSkillBaseline(
  brain: StudentBrainSnapshot,
  skillName: string,
): { mastery: number; confidence: number } {
  const skill = brain.skills.find((item) => sameCanonicalSkill(item.skillName, skillName));
  return {
    mastery: skill?.masteryScore ?? 50,
    confidence: skill?.confidence ?? 50,
  };
}

function getSessionWrongCount(
  attempts: SessionAttempt[],
  skillName: string,
): number {
  return attempts.filter(
    (attempt) => sameCanonicalSkill(attempt.skillName, skillName) && !attempt.isCorrect,
  ).length;
}

function getSessionFirstTryCorrect(
  attempts: SessionAttempt[],
  skillName: string,
): number {
  return attempts.filter(
    (attempt) =>
      sameCanonicalSkill(attempt.skillName, skillName) &&
      attempt.attemptNumber === 1 &&
      attempt.isCorrect,
  ).length;
}

export function rankAdaptiveSkills({
  brain,
  attempts,
  skillNames,
}: {
  brain: StudentBrainSnapshot;
  attempts: SessionAttempt[];
  skillNames: string[];
}): string[] {
  return [...skillNames]
    .map((skillName) => {
      const baseline = getSkillBaseline(brain, skillName);
      const wrongCount = getSessionWrongCount(attempts, skillName);
      const firstTryCorrect = getSessionFirstTryCorrect(attempts, skillName);

      const priority =
        (100 - baseline.mastery) * 0.55 +
        (100 - baseline.confidence) * 0.2 +
        wrongCount * 18 -
        firstTryCorrect * 8;

      return { skillName, priority };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.skillName);
}

export function decideInitialAdaptiveDifficulty({
  brain,
  skillName,
  attempts,
}: {
  brain: StudentBrainSnapshot;
  skillName: string;
  attempts: SessionAttempt[];
}): AdaptiveExerciseDecision {
  const baseline = getSkillBaseline(brain, skillName);
  const wrongCount = getSessionWrongCount(attempts, skillName);
  let difficulty: AdaptiveDifficulty = 2;
  let reason = "AI chọn mức vừa để kiểm tra độ chắc kiến thức.";

  if (baseline.mastery < 55 || baseline.confidence < 50 || wrongCount >= 2) {
    difficulty = 1;
    reason = "AI giảm độ khó để củng cố nền tảng trước khi tăng thử thách.";
  } else if (
    baseline.mastery >= 85 &&
    baseline.confidence >= 75 &&
    wrongCount === 0
  ) {
    difficulty = 3;
    reason = "AI tăng độ khó vì kỹ năng này đang có mastery và confidence tốt.";
  }

  return { focusSkill: skillName, difficulty, reason };
}

export function updateAdaptiveDifficulty({
  current,
  solved,
  attemptCount,
  responseSeconds,
}: {
  current: AdaptiveDifficulty;
  solved: boolean;
  attemptCount: number;
  responseSeconds: number;
}): AdaptiveDifficulty {
  if (!solved) return clampDifficulty(current - 1);
  if (attemptCount === 1 && responseSeconds <= 30) {
    return clampDifficulty(current + 1);
  }
  if (attemptCount >= 3 || responseSeconds >= 75) {
    return clampDifficulty(current - 1);
  }
  return current;
}

export function selectAdaptiveExercise({
  bank,
  skillName,
  difficulty,
  usedIds,
}: {
  bank: AdaptiveExercise[];
  skillName: string;
  difficulty: AdaptiveDifficulty;
  usedIds: string[];
}): AdaptiveExercise | null {
  const unused = bank.filter(
    (question) => sameCanonicalSkill(question.skillName, skillName) && !usedIds.includes(question.id),
  );
  if (unused.length === 0) return null;

  const exact = unused.find((question) => question.difficulty === difficulty);
  if (exact) return exact;

  return [...unused].sort(
    (a, b) =>
      Math.abs(a.difficulty - difficulty) -
      Math.abs(b.difficulty - difficulty),
  )[0];
}

export function buildAdaptivePracticeReport({
  focusSkills,
  attempts,
  startDifficulty,
  endDifficulty,
}: {
  focusSkills: string[];
  attempts: SessionAttempt[];
  startDifficulty: AdaptiveDifficulty;
  endDifficulty: AdaptiveDifficulty;
}): AdaptivePracticeReport {
  const questionIds = [...new Set(attempts.map((item) => item.questionId))];
  const firstTryCorrect = questionIds.filter((questionId) =>
    attempts.some(
      (item) =>
        item.questionId === questionId &&
        item.attemptNumber === 1 &&
        item.isCorrect,
    ),
  ).length;

  const direction =
    endDifficulty > startDifficulty
      ? "AI đã tăng thử thách vì em xử lý tốt."
      : endDifficulty < startDifficulty
        ? "AI đã giảm độ khó để em củng cố chắc nền tảng."
        : "AI giữ độ khó ổn định vì mức hiện tại phù hợp.";

  return {
    focusSkills,
    questionsCompleted: questionIds.length,
    firstTryCorrect,
    startDifficulty,
    endDifficulty,
    message: direction,
  };
}

export function formatAdaptiveDifficulty(difficulty: AdaptiveDifficulty): string {
  const labels: Record<AdaptiveDifficulty, string> = {
    1: "Củng cố",
    2: "Vừa sức",
    3: "Thử thách",
  };
  return labels[difficulty];
}
