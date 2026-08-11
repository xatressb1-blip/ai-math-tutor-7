import type {
  MasteryEvidenceSource,
  MasteryStatus,
  SkillEvidenceProfile,
  StudentSkill,
} from "@/types/student";
import type { SessionAttempt } from "@/types/teaching-session";

export const EMPTY_SKILL_EVIDENCE: SkillEvidenceProfile = {
  diagnosticCorrect: 0,
  lessonCoreCorrect: 0,
  adaptiveCorrect: 0,
  reasoningCorrectSteps: 0,
  independentFirstTryCorrect: 0,
  wrongAttempts: 0,
  misconceptionCount: 0,
  sources: [],
};

function uniqueSources(sources: MasteryEvidenceSource[]): MasteryEvidenceSource[] {
  return [...new Set(sources)];
}

export function normalizeSkillEvidence(
  evidence?: SkillEvidenceProfile,
  legacySkill?: Pick<StudentSkill, "attempts" | "correctAttempts">,
): SkillEvidenceProfile {
  if (evidence) {
    return {
      ...EMPTY_SKILL_EVIDENCE,
      ...evidence,
      sources: uniqueSources(evidence.sources ?? []),
    };
  }

  if (legacySkill && legacySkill.attempts > 0) {
    return {
      ...EMPTY_SKILL_EVIDENCE,
      lessonCoreCorrect: legacySkill.correctAttempts,
      independentFirstTryCorrect: Math.min(
        legacySkill.correctAttempts,
        legacySkill.attempts,
      ),
      wrongAttempts: Math.max(0, legacySkill.attempts - legacySkill.correctAttempts),
      sources: ["LEGACY"],
    };
  }

  return { ...EMPTY_SKILL_EVIDENCE };
}

export function mergeSkillEvidence(
  current: SkillEvidenceProfile | undefined,
  delta: Partial<SkillEvidenceProfile>,
  legacySkill?: Pick<StudentSkill, "attempts" | "correctAttempts">,
): SkillEvidenceProfile {
  const base = normalizeSkillEvidence(current, legacySkill);
  return {
    diagnosticCorrect: base.diagnosticCorrect + (delta.diagnosticCorrect ?? 0),
    lessonCoreCorrect: base.lessonCoreCorrect + (delta.lessonCoreCorrect ?? 0),
    adaptiveCorrect: base.adaptiveCorrect + (delta.adaptiveCorrect ?? 0),
    reasoningCorrectSteps:
      base.reasoningCorrectSteps + (delta.reasoningCorrectSteps ?? 0),
    independentFirstTryCorrect:
      base.independentFirstTryCorrect + (delta.independentFirstTryCorrect ?? 0),
    wrongAttempts: base.wrongAttempts + (delta.wrongAttempts ?? 0),
    misconceptionCount:
      base.misconceptionCount + (delta.misconceptionCount ?? 0),
    sources: uniqueSources([...base.sources, ...(delta.sources ?? [])]),
  };
}

export function evidenceDeltaFromTeachingAttempts(
  attempts: SessionAttempt[],
): Partial<SkillEvidenceProfile> {
  const firstTryCorrectQuestionIds = new Set(
    attempts
      .filter((item) => item.isCorrect && item.attemptNumber === 1)
      .map((item) => item.questionId),
  );
  const coreCorrect = new Set(
    attempts
      .filter(
        (item) =>
          item.isCorrect &&
          (item.evidenceSource ?? "LEGACY") === "LESSON_CORE",
      )
      .map((item) => item.questionId),
  ).size;
  const adaptiveCorrect = new Set(
    attempts
      .filter((item) => item.isCorrect && item.evidenceSource === "ADAPTIVE")
      .map((item) => item.questionId),
  ).size;
  const anyCorrect = attempts.some((item) => item.isCorrect);
  const sources: MasteryEvidenceSource[] = [];
  if (coreCorrect > 0) sources.push("LESSON_CORE");
  if (adaptiveCorrect > 0) sources.push("ADAPTIVE");
  if (anyCorrect && sources.length === 0) sources.push("LEGACY");

  return {
    lessonCoreCorrect: coreCorrect,
    adaptiveCorrect,
    independentFirstTryCorrect: firstTryCorrectQuestionIds.size,
    wrongAttempts: attempts.filter((item) => !item.isCorrect).length,
    misconceptionCount: attempts.filter(
      (item) => !item.isCorrect && Boolean(item.diagnosisLabel),
    ).length,
    sources,
  };
}

export function getNonDiagnosticCorrectEvidence(evidence: SkillEvidenceProfile): number {
  return (
    evidence.lessonCoreCorrect +
    evidence.adaptiveCorrect +
    evidence.reasoningCorrectSteps
  );
}

export function getNonDiagnosticSourceCount(evidence: SkillEvidenceProfile): number {
  return new Set(
    evidence.sources.filter(
      (source) =>
        source === "LESSON_CORE" ||
        source === "ADAPTIVE" ||
        source === "REASONING" ||
        source === "LEGACY",
    ),
  ).size;
}

export function getMasteryEvidenceCap(evidence: SkillEvidenceProfile): number {
  const nonDiagnosticCorrect = getNonDiagnosticCorrectEvidence(evidence);
  const nonDiagnosticSources = getNonDiagnosticSourceCount(evidence);

  if (nonDiagnosticCorrect === 0) return 72;
  if (nonDiagnosticSources < 2) return 84;
  if (nonDiagnosticCorrect < 4) return 84;
  if (evidence.independentFirstTryCorrect < 2) return 84;
  return 100;
}

export function capMasteryByEvidence(
  rawMastery: number,
  evidence: SkillEvidenceProfile,
): number {
  return Math.min(
    Math.max(0, Math.min(100, Math.round(rawMastery))),
    getMasteryEvidenceCap(evidence),
  );
}

export function hasSufficientMasteryEvidence(
  evidence: SkillEvidenceProfile,
): boolean {
  return (
    getNonDiagnosticSourceCount(evidence) >= 2 &&
    getNonDiagnosticCorrectEvidence(evidence) >= 4 &&
    evidence.independentFirstTryCorrect >= 2
  );
}

export function statusFromMasteryWithEvidence(
  score: number,
  evidence: SkillEvidenceProfile,
): MasteryStatus {
  if (score >= 85 && hasSufficientMasteryEvidence(evidence)) {
    return "MASTERED";
  }
  if (score >= 65) return "LEARNING";
  return "NEEDS_REVIEW";
}

export function evidenceLabel(evidence: SkillEvidenceProfile): string {
  const sourceLabels: Record<MasteryEvidenceSource, string> = {
    DIAGNOSTIC: "Diagnostic",
    LESSON_CORE: "Lesson Core",
    ADAPTIVE: "Adaptive",
    REASONING: "Reasoning",
    LEGACY: "Legacy",
  };
  return evidence.sources.map((source) => sourceLabels[source]).join(" + ");
}
