import type {
  ReasoningEvaluation,
  ReasoningScoreBreakdown,
  ReasoningStepAttempt,
  ReasoningStepDefinition,
} from "@/types/reasoning";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function includesPattern(input: string, pattern: string): boolean {
  return normalize(input).includes(normalize(pattern));
}

export function evaluateReasoningStep({
  step,
  input,
  previousAttempts,
}: {
  step: ReasoningStepDefinition;
  input: string;
  previousAttempts: ReasoningStepAttempt[];
}): ReasoningEvaluation {
  const trimmed = input.trim();
  const attemptNumber = previousAttempts.length + 1;

  if (!trimmed) {
    return {
      isCorrect: false,
      feedback: "Em hãy viết ít nhất một bước suy nghĩ để AI có thể kiểm tra.",
      nextHint: step.hint1,
      hintLevel: 1,
      shouldRevealExplanation: false,
    };
  }

  const misconception = step.misconceptionPatterns?.find((rule) =>
    includesPattern(trimmed, rule.pattern),
  );

  if (misconception) {
    const hintLevel: 1 | 2 | 3 =
      attemptNumber >= 3 ? 3 : attemptNumber >= 2 ? 2 : 1;

    return {
      isCorrect: false,
      feedback: misconception.feedback,
      nextHint:
        hintLevel === 3
          ? step.explanation
          : hintLevel === 2
            ? step.hint2
            : step.hint1,
      hintLevel,
      diagnosis: misconception.label,
      category: misconception.category,
      shouldRevealExplanation: hintLevel === 3,
    };
  }

  const correct = step.acceptedPatterns.some((pattern) =>
    includesPattern(trimmed, pattern),
  );

  if (correct) {
    return {
      isCorrect: true,
      feedback: `Đúng hướng. ${step.keyIdea}`,
      hintLevel: 0,
      shouldRevealExplanation: false,
    };
  }

  if (attemptNumber === 1) {
    return {
      isCorrect: false,
      feedback:
        "AI chưa thấy ý chính cần có ở bước này. Đây là lỗi đầu tiên ở bước hiện tại; mình chưa xem đáp án vội.",
      nextHint: step.hint1,
      hintLevel: 1,
      shouldRevealExplanation: false,
    };
  }

  if (attemptNumber === 2) {
    return {
      isCorrect: false,
      feedback:
        "Em đã thử lại nhưng bước này vẫn chưa chắc. AI sẽ thu hẹp phạm vi để em tự sửa.",
      nextHint: step.hint2,
      hintLevel: 2,
      shouldRevealExplanation: false,
    };
  }

  return {
    isCorrect: false,
    feedback:
      "Bước này đang cản trở phần còn lại. AI sẽ giải thích ngắn, sau đó em tự viết lại bằng lời của mình.",
    nextHint: step.explanation,
    hintLevel: 3,
    shouldRevealExplanation: true,
  };
}

export function calculateReasoningScores(
  attempts: ReasoningStepAttempt[],
): ReasoningScoreBreakdown {
  const grouped = new Map<string, ReasoningStepAttempt[]>();
  for (const attempt of attempts) {
    const current = grouped.get(attempt.stepId) ?? [];
    current.push(attempt);
    grouped.set(attempt.stepId, current);
  }

  const groups = [...grouped.values()];
  const attemptedSteps = groups.length || 1;
  const completedSteps = groups.filter((items) =>
    items.some((item) => item.isCorrect),
  ).length;
  const firstTryCorrect = groups.filter((items) => items[0]?.isCorrect).length;
  const initiallyWrong = groups.filter((items) => items[0] && !items[0].isCorrect);
  const recovered = initiallyWrong.filter((items) =>
    items.some((item) => item.isCorrect),
  ).length;
  const misconceptionCount = attempts.filter((item) => item.category).length;
  const totalHintWeight = attempts.reduce(
    (sum, item) => sum + (item.isCorrect ? 0 : item.hintLevel),
    0,
  );
  const maxHintWeight = Math.max(1, groups.length * 3);

  const firstAttemptAccuracy = Math.round(
    (firstTryCorrect / attemptedSteps) * 100,
  );
  const hintDependencyScore = Math.max(
    0,
    Math.min(100, Math.round((totalHintWeight / maxHintWeight) * 100)),
  );
  const recoveryScore =
    initiallyWrong.length === 0
      ? 100
      : Math.round((recovered / initiallyWrong.length) * 100);

  const reasoningScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (completedSteps / attemptedSteps) * 55 +
          (firstTryCorrect / attemptedSteps) * 30 +
          recoveryScore * 0.15 -
          misconceptionCount * 4 -
          hintDependencyScore * 0.08,
      ),
    ),
  );

  const wrongAttempts = attempts.filter((item) => !item.isCorrect).length;
  const persistenceScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        55 +
          Math.min(wrongAttempts, 5) * 7 +
          recoveryScore * 0.15 -
          misconceptionCount * 3,
      ),
    ),
  );

  return {
    reasoningScore,
    persistenceScore,
    misconceptionCount,
    firstAttemptAccuracy,
    hintDependencyScore,
    recoveryScore,
    firstErrorStepId: attempts.find((item) => !item.isCorrect)?.stepId,
  };
}
