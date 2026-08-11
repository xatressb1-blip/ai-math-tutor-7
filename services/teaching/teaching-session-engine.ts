import { decideTeachingAction } from "@/services/teaching/teaching-brain";
import type { LessonQuestion } from "@/types/lesson";
import type { TeachingBrainDecision } from "@/types/teaching-brain";
import type {
  SessionAttempt,
  SkillSessionSummary,
  TeachingSessionSummary,
  TeachingStrategy,
} from "@/types/teaching-session";

export type TeachingFeedback = {
  kind: "correct" | "hint" | "explain";
  title: string;
  text: string;
  strategy: TeachingStrategy;
  brainDecision: TeachingBrainDecision;
};

export function calculateConfidenceScore({
  isCorrect,
  attemptNumber,
  responseSeconds,
}: {
  isCorrect: boolean;
  attemptNumber: number;
  responseSeconds: number;
}): number {
  let score = isCorrect ? 92 : 42;

  if (responseSeconds <= 12) score += isCorrect ? 6 : -4;
  if (responseSeconds >= 45) score -= 10;
  if (responseSeconds >= 90) score -= 10;

  score -= Math.max(0, attemptNumber - 1) * 12;

  return Math.max(10, Math.min(100, Math.round(score)));
}

export function evaluateTeachingResponse({
  question,
  selectedChoiceId,
  attemptNumber,
  responseSeconds,
}: {
  question: LessonQuestion;
  selectedChoiceId: string;
  attemptNumber: number;
  responseSeconds: number;
}): {
  isCorrect: boolean;
  confidenceScore: number;
  feedback: TeachingFeedback;
} {
  const isCorrect = selectedChoiceId === question.correctChoiceId;
  const confidenceScore = calculateConfidenceScore({
    isCorrect,
    attemptNumber,
    responseSeconds,
  });
  const brainDecision = decideTeachingAction({
    question,
    selectedChoiceId,
    isCorrect,
    attemptNumber,
    responseSeconds,
  });

  if (isCorrect) {
    return {
      isCorrect,
      confidenceScore,
      feedback: {
        kind: "correct",
        title: attemptNumber === 1 ? "Em làm rất tốt" : "Em đã tự sửa được",
        text: question.explanation,
        strategy: "PRAISE_AND_ADVANCE",
        brainDecision,
      },
    };
  }

  const strategy: TeachingStrategy =
    brainDecision.intervention === "CONTRAST_EXAMPLE"
      ? "CONTRAST_EXAMPLE"
      : brainDecision.intervention === "STEP_BY_STEP_RETEACH"
        ? "STEP_BY_STEP_RETEACH"
        : brainDecision.intervention === "TARGETED_HINT" ||
            brainDecision.intervention === "SLOW_DOWN_AND_RECHECK"
          ? "TARGET_MISCONCEPTION"
          : "GIVE_HINT";

  return {
    isCorrect,
    confidenceScore,
    feedback: {
      kind:
        brainDecision.intervention === "STEP_BY_STEP_RETEACH"
          ? "explain"
          : "hint",
      title:
        brainDecision.intervention === "STEP_BY_STEP_RETEACH"
          ? "Teaching Brain đổi cách dạy"
          : "Teaching Brain đã phát hiện một điểm cần kiểm tra",
      text: brainDecision.coachText,
      strategy,
      brainDecision,
    },
  };
}

function summarizeSkill(
  skillName: string,
  attempts: SessionAttempt[],
): SkillSessionSummary {
  const skillAttempts = attempts.filter((item) => item.skillName === skillName);
  const questionIds = [...new Set(skillAttempts.map((item) => item.questionId))];
  const correctQuestionIds = new Set(
    skillAttempts.filter((item) => item.isCorrect).map((item) => item.questionId),
  );
  const firstTryCorrect = questionIds.filter((questionId) =>
    skillAttempts.some(
      (item) =>
        item.questionId === questionId &&
        item.attemptNumber === 1 &&
        item.isCorrect,
    ),
  ).length;
  const confidenceValues = skillAttempts
    .filter((item) => item.isCorrect)
    .map((item) => item.confidenceScore);

  return {
    skillName,
    questionsSeen: questionIds.length,
    correctQuestions: correctQuestionIds.size,
    firstTryCorrect,
    averageConfidence:
      confidenceValues.length === 0
        ? 0
        : Math.round(
            confidenceValues.reduce((sum, value) => sum + value, 0) /
              confidenceValues.length,
          ),
  };
}

function buildDiagnosticInsights(attempts: SessionAttempt[]) {
  const counts = new Map<string, { category: NonNullable<SessionAttempt["mistakeCategory"]>; label: string; count: number }>();

  for (const attempt of attempts) {
    if (attempt.isCorrect || !attempt.mistakeCategory || !attempt.diagnosisLabel) {
      continue;
    }
    const key = `${attempt.mistakeCategory}::${attempt.diagnosisLabel}`;
    const current = counts.get(key);
    counts.set(key, {
      category: attempt.mistakeCategory,
      label: attempt.diagnosisLabel,
      count: (current?.count ?? 0) + 1,
    });
  }

  return [...counts.values()].sort((a, b) => b.count - a.count);
}

export function buildTeachingSessionSummary({
  attempts,
  totalQuestions,
  elapsedSeconds,
}: {
  attempts: SessionAttempt[];
  totalQuestions: number;
  elapsedSeconds: number;
}): TeachingSessionSummary {
  const correctQuestionIds = new Set(
    attempts.filter((item) => item.isCorrect).map((item) => item.questionId),
  );
  const questionIds = [...new Set(attempts.map((item) => item.questionId))];
  const firstTryCorrect = questionIds.filter((questionId) =>
    attempts.some(
      (item) =>
        item.questionId === questionId &&
        item.attemptNumber === 1 &&
        item.isCorrect,
    ),
  ).length;
  const correctAttemptConfidences = attempts
    .filter((item) => item.isCorrect)
    .map((item) => item.confidenceScore);
  const skillNames = [...new Set(attempts.map((item) => item.skillName))];
  const skills = skillNames.map((skillName) => summarizeSkill(skillName, attempts));

  const questionQualityScores: number[] = questionIds.map((questionId) => {
    const firstCorrectAttempt = attempts.find(
      (item) => item.questionId === questionId && item.isCorrect,
    );

    if (!firstCorrectAttempt) return 0;
    if (firstCorrectAttempt.attemptNumber === 1) return 100;
    if (firstCorrectAttempt.attemptNumber === 2) return 82;
    if (firstCorrectAttempt.attemptNumber === 3) return 68;
    return 55;
  });
  const score =
    totalQuestions === 0
      ? 0
      : Math.round(
          questionQualityScores.reduce((sum, value) => sum + value, 0) /
            totalQuestions,
        );
  const confidenceScore =
    correctAttemptConfidences.length === 0
      ? 0
      : Math.round(
          correctAttemptConfidences.reduce((sum, value) => sum + value, 0) /
            correctAttemptConfidences.length,
        );

  return {
    score,
    confidenceScore,
    totalAttempts: attempts.length,
    totalQuestions,
    correctQuestions: correctQuestionIds.size,
    firstTryCorrect,
    elapsedMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
    skills,
    strengths: skills
      .filter(
        (skill) =>
          skill.questionsSeen >= 2 &&
          skill.correctQuestions === skill.questionsSeen &&
          skill.firstTryCorrect >= 2 &&
          skill.averageConfidence >= 70,
      )
      .map((skill) => skill.skillName),
    reviewSkills: skills
      .filter(
        (skill) =>
          skill.firstTryCorrect < skill.questionsSeen ||
          skill.averageConfidence < 65,
      )
      .map((skill) => skill.skillName),
    diagnosticInsights: buildDiagnosticInsights(attempts),
  };
}
