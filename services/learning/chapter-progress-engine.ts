import type { LessonDefinition } from "@/types/lesson";
import type {
  ChapterProgressSnapshot,
  LessonPathStatus,
  LessonProgressSnapshot,
} from "@/types/chapter-progress";
import type { LearningSession, StudentBrainSnapshot } from "@/types/student";

function parseConfidence(note: string): number | null {
  const match = note.match(/Confidence\s+(\d{1,3})\/100/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
}

function isCoreProgressSession(session: LearningSession): boolean {
  return !session.source || session.source === "LEGACY" || session.source === "LESSON" || session.source === "ADAPTIVE";
}

function getLatestSession(
  sessions: LearningSession[],
  knowledgeNodeId: string,
): LearningSession | null {
  const matches = sessions
    .filter((session) => session.knowledgeNodeId === knowledgeNodeId && isCoreProgressSession(session))
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );

  return matches[0] ?? null;
}

function getMasteryAverage(
  brain: StudentBrainSnapshot,
  knowledgeNodeId: string,
): number | null {
  const skills = brain.skills.filter(
    (skill) => skill.knowledgeNodeId === knowledgeNodeId,
  );
  if (skills.length === 0) return null;

  return Math.round(
    skills.reduce((sum, skill) => sum + skill.masteryScore, 0) / skills.length,
  );
}

function evaluateStudiedLesson({
  session,
  masteryAverage,
}: {
  session: LearningSession;
  masteryAverage: number | null;
}): {
  status: Exclude<LessonPathStatus, "LOCKED" | "AVAILABLE">;
  reason: string;
  accuracy: number;
  confidence: number | null;
} {
  const accuracy =
    session.questionsAttempted > 0
      ? Math.round(
          (session.questionsCorrect / session.questionsAttempted) * 100,
        )
      : 0;
  const confidence = parseConfidence(session.note);

  const ready =
    accuracy >= 70 &&
    (confidence === null || confidence >= 55) &&
    (masteryAverage === null || masteryAverage >= 55);

  if (ready) {
    return {
      status: "COMPLETED",
      reason:
        accuracy >= 85 && (confidence ?? 70) >= 70
          ? "Đã hoàn thành chắc chắn; đủ điều kiện mở bài tiếp theo."
          : "Đã đạt ngưỡng hoàn thành của lộ trình Beta.",
      accuracy,
      confidence,
    };
  }

  const needsReview =
    accuracy < 60 ||
    (confidence !== null && confidence < 45) ||
    (masteryAverage !== null && masteryAverage < 50);

  return {
    status: needsReview ? "NEEDS_REVIEW" : "IN_PROGRESS",
    reason: needsReview
      ? "Kết quả hiện tại cho thấy nên ôn lại trước khi chuyển bài."
      : "Đã học nhưng chưa đạt đủ ngưỡng mở bài tiếp theo.",
    accuracy,
    confidence,
  };
}

export function buildChapterProgress({
  lessons,
  brain,
  chapterTitle,
}: {
  lessons: LessonDefinition[];
  brain: StudentBrainSnapshot;
  chapterTitle: string;
}): ChapterProgressSnapshot {
  const ordered = [...lessons].sort(
    (a, b) => a.lessonNumber - b.lessonNumber,
  );

  const lessonSnapshots: LessonProgressSnapshot[] = [];
  let previousCompleted = true;

  for (const lesson of ordered) {
    const sessions = brain.sessions.filter(
      (session) =>
        session.knowledgeNodeId === lesson.knowledgeNodeId &&
        isCoreProgressSession(session),
    );
    const latest = getLatestSession(brain.sessions, lesson.knowledgeNodeId);
    const masteryAverage = getMasteryAverage(brain, lesson.knowledgeNodeId);

    if (latest) {
      const evaluated = evaluateStudiedLesson({
        session: latest,
        masteryAverage,
      });

      lessonSnapshots.push({
        lessonId: lesson.id,
        knowledgeNodeId: lesson.knowledgeNodeId,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        status: evaluated.status,
        attempts: sessions.length,
        latestAccuracy: evaluated.accuracy,
        latestConfidence: evaluated.confidence,
        masteryAverage,
        lastStudiedAt: latest.startedAt,
        reason: evaluated.reason,
      });

      previousCompleted = evaluated.status === "COMPLETED";
      continue;
    }

    if (previousCompleted) {
      lessonSnapshots.push({
        lessonId: lesson.id,
        knowledgeNodeId: lesson.knowledgeNodeId,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        status: "AVAILABLE",
        attempts: 0,
        latestAccuracy: null,
        latestConfidence: null,
        masteryAverage,
        lastStudiedAt: null,
        reason:
          lesson.lessonNumber === ordered[0]?.lessonNumber
            ? "Bài đầu tiên luôn sẵn sàng."
            : "Bài trước đã hoàn thành; em có thể bắt đầu bài này.",
      });
    } else {
      lessonSnapshots.push({
        lessonId: lesson.id,
        knowledgeNodeId: lesson.knowledgeNodeId,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        status: "LOCKED",
        attempts: 0,
        latestAccuracy: null,
        latestConfidence: null,
        masteryAverage,
        lastStudiedAt: null,
        reason: "Hoàn thành bài trước để mở khóa bài này.",
      });
    }

    previousCompleted = false;
  }

  const completedLessons = lessonSnapshots.filter(
    (lesson) => lesson.status === "COMPLETED",
  ).length;
  const reviewLessons = lessonSnapshots.filter(
    (lesson) => lesson.status === "NEEDS_REVIEW",
  ).length;
  const availableLessons = lessonSnapshots.filter((lesson) =>
    ["AVAILABLE", "IN_PROGRESS", "NEEDS_REVIEW"].includes(lesson.status),
  ).length;

  const weighted = lessonSnapshots.reduce((sum, lesson) => {
    if (lesson.status === "COMPLETED") return sum + 100;
    if (lesson.status === "IN_PROGRESS") return sum + 60;
    if (lesson.status === "NEEDS_REVIEW") return sum + 45;
    if (lesson.status === "AVAILABLE") return sum + 15;
    return sum;
  }, 0);

  const recommended =
    lessonSnapshots.find((lesson) => lesson.status === "NEEDS_REVIEW") ??
    lessonSnapshots.find((lesson) => lesson.status === "IN_PROGRESS") ??
    lessonSnapshots.find((lesson) => lesson.status === "AVAILABLE") ??
    null;

  const overallProgress =
    lessonSnapshots.length > 0
      ? Math.round(weighted / lessonSnapshots.length)
      : 0;

  return {
    chapter: ordered[0]?.chapter ?? 1,
    title: chapterTitle,
    lessons: lessonSnapshots,
    completedLessons,
    availableLessons,
    reviewLessons,
    overallProgress,
    recommendedLessonId: recommended?.lessonId ?? null,
    recommendation: recommended
      ? recommended.status === "NEEDS_REVIEW"
        ? `Ưu tiên ôn lại Bài ${recommended.lessonNumber}: ${recommended.title}.`
        : recommended.status === "IN_PROGRESS"
          ? `Tiếp tục hoàn thiện Bài ${recommended.lessonNumber}: ${recommended.title}.`
          : `Bài tiếp theo phù hợp là Bài ${recommended.lessonNumber}: ${recommended.title}.`
      : "Em đã hoàn thành toàn bộ lộ trình hiện có của Chương 1.",
  };
}
