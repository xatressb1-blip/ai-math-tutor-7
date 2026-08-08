import { getAllLessons } from "@/services/lesson/lesson-repository";
import { getAdaptiveExerciseBank } from "@/services/exercise/adaptive-exercise-bank-registry";
import type { MockTestQuestion } from "@/types/revision";

export function buildSemesterMockTest(limit = 20): MockTestQuestion[] {
  const lessons = getAllLessons();

  const all = lessons.flatMap((lesson) =>
    getAdaptiveExerciseBank(lesson.id).map((question) => ({
      id: `${lesson.id}-${question.id}`,
      lessonId: lesson.id,
      chapter: lesson.chapter,
      lessonNumber: lesson.lessonNumber,
      prompt: question.prompt,
      choices: question.choices,
      correctChoiceId: question.correctChoiceId,
      skillName: question.skillName,
      explanation: question.explanation,
      difficulty: question.difficulty,
    })),
  );

  const selected: MockTestQuestion[] = [];
  const byChapter = new Map<number, MockTestQuestion[]>();

  for (const question of all) {
    const group = byChapter.get(question.chapter) ?? [];
    group.push(question);
    byChapter.set(question.chapter, group);
  }

  for (const chapter of [...byChapter.keys()].sort()) {
    const group = byChapter.get(chapter) ?? [];
    selected.push(...group.slice(0, Math.min(6, group.length)));
  }

  for (const question of all) {
    if (selected.length >= limit) break;
    if (!selected.some((item) => item.id === question.id)) {
      selected.push(question);
    }
  }

  return selected.slice(0, limit);
}
