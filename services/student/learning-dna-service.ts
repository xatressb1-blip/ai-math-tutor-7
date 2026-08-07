import type { LearningDnaProfile, LearningPace, SupportNeed } from "@/types/learning-dna";
import type { SessionAttempt, TeachingSessionSummary } from "@/types/teaching-session";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getPace(seconds: number): LearningPace {
  if (seconds <= 10) return "FAST";
  if (seconds <= 25) return "BALANCED";
  return "DELIBERATE";
}

function getSupportNeed(attemptsPerQuestion: number, firstTryRate: number): SupportNeed {
  if (attemptsPerQuestion <= 1.2 && firstTryRate >= 75) return "INDEPENDENT";
  if (attemptsPerQuestion <= 1.8 && firstTryRate >= 45) return "GUIDED";
  return "NEEDS_SUPPORT";
}

function buildNote(profile: Pick<LearningDnaProfile, "pace" | "supportNeed">): string {
  const paceText =
    profile.pace === "FAST"
      ? "Em thường phản hồi khá nhanh."
      : profile.pace === "DELIBERATE"
        ? "Em có xu hướng suy nghĩ kỹ trước khi trả lời."
        : "Tốc độ làm bài của em đang khá cân bằng.";

  const supportText =
    profile.supportNeed === "INDEPENDENT"
      ? "Em đang tự xử lý câu hỏi tốt và ít cần gợi ý."
      : profile.supportNeed === "NEEDS_SUPPORT"
        ? "AI nên chia nhỏ bước và tăng ví dụ trước khi nâng độ khó."
        : "AI nên tiếp tục gợi ý vừa đủ rồi để em tự hoàn thành.";

  return `${paceText} ${supportText}`;
}

export function buildLearningDnaProfile({
  studentId,
  attempts,
  summary,
  previous,
}: {
  studentId: string;
  attempts: SessionAttempt[];
  summary: TeachingSessionSummary;
  previous?: LearningDnaProfile | null;
}): LearningDnaProfile {
  const questionIds = [...new Set(attempts.map((attempt) => attempt.questionId))];
  const avgResponseSeconds = attempts.length
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.responseSeconds, 0) /
          attempts.length,
      )
    : 0;
  const attemptsPerQuestion = questionIds.length
    ? attempts.length / questionIds.length
    : 0;
  const firstTryRate = summary.totalQuestions
    ? clamp((summary.firstTryCorrect / summary.totalQuestions) * 100)
    : 0;

  const current = {
    averageResponseSeconds: avgResponseSeconds,
    firstTryRate,
    averageConfidence: clamp(summary.confidenceScore),
    averageAttemptsPerQuestion: Number(attemptsPerQuestion.toFixed(2)),
  };

  const sessionsObserved = (previous?.sessionsObserved ?? 0) + 1;
  const weightPrevious = previous ? Math.min(previous.sessionsObserved, 4) : 0;
  const denominator = weightPrevious + 1;

  const merged = {
    averageResponseSeconds: previous
      ? Math.round(
          (previous.averageResponseSeconds * weightPrevious + current.averageResponseSeconds) /
            denominator,
        )
      : current.averageResponseSeconds,
    firstTryRate: previous
      ? clamp((previous.firstTryRate * weightPrevious + current.firstTryRate) / denominator)
      : current.firstTryRate,
    averageConfidence: previous
      ? clamp(
          (previous.averageConfidence * weightPrevious + current.averageConfidence) /
            denominator,
        )
      : current.averageConfidence,
    averageAttemptsPerQuestion: previous
      ? Number(
          (
            (previous.averageAttemptsPerQuestion * weightPrevious +
              current.averageAttemptsPerQuestion) /
            denominator
          ).toFixed(2),
        )
      : current.averageAttemptsPerQuestion,
  };

  const pace = getPace(merged.averageResponseSeconds);
  const supportNeed = getSupportNeed(
    merged.averageAttemptsPerQuestion,
    merged.firstTryRate,
  );

  const profile: LearningDnaProfile = {
    studentId,
    sessionsObserved,
    ...merged,
    pace,
    supportNeed,
    note: "",
    updatedAt: new Date().toISOString(),
  };

  return { ...profile, note: buildNote(profile) };
}
