import { getReasoningProblemsByLesson } from "@/data/reasoning/reasoning-problems";
import { getAcademicLessons } from "@/services/academic/academic-repository";
import {
  getAdaptiveExerciseBank,
  hasAdaptiveExerciseBank,
} from "@/services/exercise/adaptive-exercise-bank-registry";
import {
  getAllLessons,
  getLessonById,
} from "@/services/lesson/lesson-repository";
import type {
  KnowledgeQaReport,
  LessonKnowledgeQa,
} from "@/types/knowledge-qa";

export function buildKnowledgeQaReport(): KnowledgeQaReport {
  const academic = getAcademicLessons();
  const runnable = getAllLessons();

  const rows: LessonKnowledgeQa[] = academic.map((academicLesson) => {
    const expectedId =
      academicLesson.lessonPlayerId ??
      `lesson-player-${String(academicLesson.lessonNumber).padStart(2, "0")}`;
    const lesson = getLessonById(expectedId);
    const adaptive = getAdaptiveExerciseBank(expectedId);
    const reasoning = getReasoningProblemsByLesson(expectedId);
    const questions =
      lesson?.steps
        .map((step) => step.question)
        .filter((question): question is NonNullable<typeof question> => Boolean(question)) ?? [];
    const genericMetaQuestions = questions.filter((question) =>
      question.prompt.includes("cách làm nào phù hợp nhất với mục tiêu"),
    );
    const coreQuestions = questions.length;
    const studentBrainSkills = lesson
      ? [
          ...new Set(
            lesson.steps
              .map((step) => step.question?.skillName)
              .filter((value): value is string => Boolean(value)),
          ),
        ]
      : [];

    const notes: string[] = [];
    if (!lesson) notes.push("Chưa có Lesson Player.");
    if (!adaptive.length) notes.push("Chưa có Adaptive Practice bank.");
    if (!reasoning.length) notes.push("Chưa có Reasoning Lab problem.");
    const reasoningIntegrityRequired =
      academicLesson.lessonNumber >= 8 && academicLesson.lessonNumber <= 14;
    if (reasoningIntegrityRequired && reasoning.length < 2)
      notes.push("Wave 2 yêu cầu ít nhất 2 Reasoning Lab problems cho Bài 8–14.");
    if (!coreQuestions) notes.push("Lesson Player chưa có checkpoint question.");
    if (genericMetaQuestions.length)
      notes.push("Có generic meta-question; không được dùng làm bằng chứng mastery.");
    if (!studentBrainSkills.length)
      notes.push("Chưa có skill để Teaching Session ghi vào Student Brain.");

    const lessonPlayerMapped = Boolean(lesson);
    const adaptivePracticeMapped = hasAdaptiveExerciseBank(expectedId);
    const tutorMapped = Boolean(lesson); // Tutor route consumes Lesson Repository.
    const reasoningLabMapped =
      reasoning.length > 0 &&
      (!reasoningIntegrityRequired || reasoning.length >= 2);
    const studentBrainMapped =
      Boolean(lesson) &&
      coreQuestions > 0 &&
      genericMetaQuestions.length === 0 &&
      studentBrainSkills.length > 0;

    const allMapped =
      lessonPlayerMapped &&
      adaptivePracticeMapped &&
      tutorMapped &&
      reasoningLabMapped &&
      studentBrainMapped;

    const status: LessonKnowledgeQa["status"] = allMapped
      ? "PASS"
      : lessonPlayerMapped
        ? "WARN"
        : "FAIL";

    return {
      lessonNumber: academicLesson.lessonNumber,
      lessonId: expectedId,
      title: academicLesson.title,
      chapter: academicLesson.chapterNumber,
      academicMapped: true,
      lessonPlayerMapped,
      adaptivePracticeMapped,
      tutorMapped,
      reasoningLabMapped,
      studentBrainMapped,
      coreQuestionCount: coreQuestions,
      adaptiveQuestionCount: adaptive.length,
      reasoningProblemCount: reasoning.length,
      academicObjectiveCount: academicLesson.objectives.length,
      studentBrainSkillCount: studentBrainSkills.length,
      status,
      notes,
    };
  });

  const passed = rows.filter((row) => row.status === "PASS").length;
  const warned = rows.filter((row) => row.status === "WARN").length;
  const failed = rows.filter((row) => row.status === "FAIL").length;
  const coveragePercent = Math.round(
    (passed / Math.max(1, rows.length)) * 100,
  );

  return {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    totalLessons: rows.length,
    passed,
    warned,
    failed,
    coveragePercent,
    lessons: rows.sort((a, b) => a.lessonNumber - b.lessonNumber),
  };
}

export function assertKnowledgeQaComplete(): void {
  const report = buildKnowledgeQaReport();
  const missing = report.lessons.filter((row) => row.status !== "PASS");
  if (missing.length) {
    throw new Error(
      `Knowledge QA incomplete: ${missing
        .map((row) => `Bài ${row.lessonNumber}`)
        .join(", ")}`,
    );
  }
}
