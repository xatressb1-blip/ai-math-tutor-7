import {
  capMasteryByEvidence,
  getMasteryEvidenceCap,
  hasSufficientMasteryEvidence,
  statusFromMasteryWithEvidence,
} from "@/services/student/mastery-integrity-policy";
import type { SkillEvidenceProfile } from "@/types/student";

export type MasteryIntegrityQaCheck = {
  id: string;
  title: string;
  expected: string;
  actual: string;
  pass: boolean;
};

function evidence(
  partial: Partial<SkillEvidenceProfile>,
): SkillEvidenceProfile {
  return {
    diagnosticCorrect: 0,
    lessonCoreCorrect: 0,
    adaptiveCorrect: 0,
    reasoningCorrectSteps: 0,
    independentFirstTryCorrect: 0,
    wrongAttempts: 0,
    misconceptionCount: 0,
    sources: [],
    ...partial,
  };
}

export function runMasteryIntegrityQa(): MasteryIntegrityQaCheck[] {
  const diagnosticOnly = evidence({
    diagnosticCorrect: 1,
    sources: ["DIAGNOSTIC"],
  });
  const oneCore = evidence({
    lessonCoreCorrect: 1,
    independentFirstTryCorrect: 1,
    sources: ["LESSON_CORE"],
  });
  const reasoningOnly = evidence({
    reasoningCorrectSteps: 3,
    independentFirstTryCorrect: 3,
    sources: ["REASONING"],
  });
  const mixedEnough = evidence({
    lessonCoreCorrect: 2,
    adaptiveCorrect: 2,
    independentFirstTryCorrect: 3,
    sources: ["LESSON_CORE", "ADAPTIVE"],
  });
  const mixedWithReasoning = evidence({
    lessonCoreCorrect: 2,
    reasoningCorrectSteps: 2,
    independentFirstTryCorrect: 3,
    sources: ["LESSON_CORE", "REASONING"],
  });

  const rows: MasteryIntegrityQaCheck[] = [];

  const diagnosticScore = capMasteryByEvidence(96, diagnosticOnly);
  rows.push({
    id: "diagnostic-not-mastery",
    title: "Một câu Diagnostic đúng không tạo mastery",
    expected: "Score ≤ 72 và không MASTERED",
    actual: `${diagnosticScore}/100 · ${statusFromMasteryWithEvidence(diagnosticScore, diagnosticOnly)}`,
    pass:
      diagnosticScore <= 72 &&
      statusFromMasteryWithEvidence(diagnosticScore, diagnosticOnly) !== "MASTERED",
  });

  const coreScore = capMasteryByEvidence(100, oneCore);
  rows.push({
    id: "one-mcq-not-mastery",
    title: "Một MCQ core đúng lần đầu không tạo mastery",
    expected: "Score ≤ 84 và không MASTERED",
    actual: `${coreScore}/100 · ${statusFromMasteryWithEvidence(coreScore, oneCore)}`,
    pass:
      coreScore <= 84 &&
      statusFromMasteryWithEvidence(coreScore, oneCore) !== "MASTERED",
  });

  const reasoningScore = capMasteryByEvidence(98, reasoningOnly);
  rows.push({
    id: "reasoning-one-context-not-mastery",
    title: "Một Reasoning context duy nhất chưa đủ mastery",
    expected: "Score ≤ 84 và cần thêm nguồn evidence",
    actual: `${reasoningScore}/100 · cap ${getMasteryEvidenceCap(reasoningOnly)}`,
    pass: reasoningScore <= 84 && !hasSufficientMasteryEvidence(reasoningOnly),
  });

  rows.push({
    id: "core-adaptive-sufficient",
    title: "Core + Adaptive đủ số lượng mở mastery gate",
    expected: "Evidence sufficient = true",
    actual: `sufficient = ${hasSufficientMasteryEvidence(mixedEnough)}`,
    pass: hasSufficientMasteryEvidence(mixedEnough),
  });

  rows.push({
    id: "core-reasoning-sufficient",
    title: "Core + Reasoning có thể xác minh mastery",
    expected: "Evidence sufficient = true",
    actual: `sufficient = ${hasSufficientMasteryEvidence(mixedWithReasoning)}`,
    pass: hasSufficientMasteryEvidence(mixedWithReasoning),
  });

  return rows;
}
