import { chapter1DiagnosticBank } from "@/data/diagnostic/chapter-1-diagnostic-bank";
import { getLessonById } from "@/services/lesson/lesson-repository";
import type {
  DiagnosticAnswer,
  DiagnosticDifficulty,
  DiagnosticLessonScore,
  DiagnosticPlacement,
  DiagnosticQuestion,
  DiagnosticResult,
} from "@/types/diagnostic";

const ORDER = [0, 1, 2, 3, 4] as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function getDiagnosticQuestions(): DiagnosticQuestion[] {
  return chapter1DiagnosticBank;
}

export function getNextDiagnosticQuestion({
  answers,
}: {
  answers: DiagnosticAnswer[];
}): DiagnosticQuestion | null {
  const unanswered = chapter1DiagnosticBank.filter(
    (question) => !answers.some((answer) => answer.questionId === question.id),
  );
  if (unanswered.length === 0) return null;

  const currentDomain = ORDER.find((lessonNumber) =>
    unanswered.some((question) => question.lessonNumber === lessonNumber),
  );
  if (currentDomain === undefined) return unanswered[0] ?? null;

  const domainAnswers = answers.filter(
    (answer) => answer.lessonNumber === currentDomain,
  );
  const correct = domainAnswers.filter((answer) => answer.isCorrect).length;
  const targetDifficulty: DiagnosticDifficulty =
    domainAnswers.length === 0
      ? 2
      : correct / domainAnswers.length >= 0.67
        ? 3
        : correct / domainAnswers.length <= 0.34
          ? 1
          : 2;

  return (
    unanswered.find(
      (question) =>
        question.lessonNumber === currentDomain &&
        question.difficulty === targetDifficulty,
    ) ??
    unanswered.find((question) => question.lessonNumber === currentDomain) ??
    unanswered[0] ??
    null
  );
}

function lessonScore(
  lessonNumber: 0 | 1 | 2 | 3 | 4,
  answers: DiagnosticAnswer[],
): DiagnosticLessonScore {
  const rows = answers.filter((answer) => answer.lessonNumber === lessonNumber);
  const correct = rows.filter((answer) => answer.isCorrect).length;
  const weightedMax = rows.reduce((sum, row) => sum + row.difficulty, 0) || 1;
  const weightedCorrect = rows.reduce(
    (sum, row) => sum + (row.isCorrect ? row.difficulty : 0),
    0,
  );
  const score = clamp((weightedCorrect / weightedMax) * 100);
  const speed = rows.length
    ? rows.reduce((sum, row) => sum + Math.min(row.responseSeconds, 45), 0) /
      rows.length
    : 45;
  const stability = rows.length ? (correct / rows.length) * 70 : 0;
  const speedSignal = Math.max(0, 30 - Math.max(0, speed - 12));

  return {
    lessonNumber,
    score,
    confidence: clamp(stability + speedSignal),
    questions: rows.length,
    correct,
  };
}

function decidePlacement(scores: DiagnosticLessonScore[]): {
  placement: DiagnosticPlacement;
  lessonNumber: 1 | 2 | 3 | 4;
  recommendation: string;
} {
  const pre = scores.find((row) => row.lessonNumber === 0)?.score ?? 0;
  const l1 = scores.find((row) => row.lessonNumber === 1)?.score ?? 0;
  const l2 = scores.find((row) => row.lessonNumber === 2)?.score ?? 0;
  const l3 = scores.find((row) => row.lessonNumber === 3)?.score ?? 0;

  if (pre < 50) {
    return {
      placement: "PRE_CHAPTER_REVIEW",
      lessonNumber: 1,
      recommendation:
        "Kiến thức tiền đề về phân số hoặc số nguyên chưa thật chắc. AI đề xuất bắt đầu ở Bài 1 và dành thêm thời gian củng cố nền tảng.",
    };
  }
  if (l1 < 65) {
    return {
      placement: "LESSON_1",
      lessonNumber: 1,
      recommendation:
        "Bắt đầu từ Bài 1 để củng cố khái niệm số hữu tỉ, số đối và so sánh.",
    };
  }
  if (l2 < 65) {
    return {
      placement: "LESSON_2",
      lessonNumber: 2,
      recommendation:
        "Nền tảng Bài 1 khá ổn. AI đề xuất bắt đầu ở Bài 2 – các phép tính số hữu tỉ.",
    };
  }
  if (l3 < 65) {
    return {
      placement: "LESSON_3",
      lessonNumber: 3,
      recommendation:
        "Em đã vượt qua phần số hữu tỉ cơ bản và phép tính. Điểm bắt đầu phù hợp là Bài 3 – Lũy thừa.",
    };
  }
  return {
    placement: "LESSON_4",
    lessonNumber: 4,
    recommendation:
      "Kết quả đầu vào cho thấy Bài 1–3 đã khá chắc. AI đề xuất bắt đầu ở Bài 4 – Thứ tự phép tính và quy tắc chuyển vế.",
  };
}

export function buildDiagnosticResult(
  answers: DiagnosticAnswer[],
): DiagnosticResult {
  const lessonScores = ORDER.map((lessonNumber) =>
    lessonScore(lessonNumber, answers),
  );
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const score = answers.length
    ? clamp((correctAnswers / answers.length) * 100)
    : 0;
  const confidence = answers.length
    ? clamp(
        lessonScores.reduce((sum, row) => sum + row.confidence, 0) /
          lessonScores.length,
      )
    : 0;
  const decision = decidePlacement(lessonScores);
  const lessonId = `lesson-player-0${decision.lessonNumber}`;
  const lesson = getLessonById(lessonId);

  const bySkill = new Map<string, { total: number; correct: number }>();
  for (const answer of answers) {
    const current = bySkill.get(answer.skillName) ?? { total: 0, correct: 0 };
    current.total += 1;
    current.correct += answer.isCorrect ? 1 : 0;
    bySkill.set(answer.skillName, current);
  }

  const skillRows = [...bySkill.entries()].map(([skillName, value]) => ({
    skillName,
    total: value.total,
    rate: value.total ? value.correct / value.total : 0,
  }));

  return {
    id: `diagnostic-${Date.now()}`,
    completedAt: new Date().toISOString(),
    totalQuestions: answers.length,
    correctAnswers,
    score,
    confidence,
    lessonScores,
    startingPoint: decision.placement,
    startingLessonId: lessonId,
    startingLessonNumber: decision.lessonNumber,
    startingLessonTitle: lesson?.title ?? `Bài ${decision.lessonNumber}`,
    recommendation: decision.recommendation,
    weakSkills: skillRows
      .filter((row) => row.rate < 0.5)
      .map((row) => row.skillName),
    strongSkills: skillRows
      .filter((row) => row.total >= 2 && row.rate >= 0.8)
      .map((row) => row.skillName),
    answers,
  };
}
