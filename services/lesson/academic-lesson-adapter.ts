import { getAcademicLessons } from "@/services/academic/academic-repository";
import type { LessonDefinition, LessonStep } from "@/types/lesson";

/**
 * Fallback adapter only.
 * It MUST NOT create QUESTION steps or be used as mastery evidence.
 * Lessons 12–19 use domain-specific definitions.
 */
export function getAcademicBackedLessonDefinitions(): LessonDefinition[] {
  return getAcademicLessons()
    .filter((lesson) => Boolean(lesson.lessonPlayerId))
    .map((lesson) => {
      const steps: LessonStep[] = [
        {
          id: `${lesson.lessonPlayerId}-fallback-welcome`,
          action: "WELCOME",
          title: `Bài ${lesson.lessonNumber}. ${lesson.title}`,
          content: "Nội dung fallback từ Academic Knowledge Base; không dùng để quyết định mastery.",
          estimatedMinutes: 1,
        },
        ...lesson.concepts.map((concept, index) => ({
          id: `${lesson.lessonPlayerId}-fallback-concept-${index + 1}`,
          action: "EXPLAIN" as const,
          title: concept.title,
          content: `${concept.summary}\n\nCần nhớ: ${concept.keyIdeas.join("; ")}.`,
          estimatedMinutes: 5,
        })),
        {
          id: `${lesson.lessonPlayerId}-fallback-summary`,
          action: "SUMMARY",
          title: "Tóm tắt",
          content: "Hãy dùng Lesson Player chính thức để thực hiện checkpoint kiến thức.",
          estimatedMinutes: 1,
        },
      ];
      return {
        id: lesson.lessonPlayerId!,
        knowledgeNodeId: `fallback-${lesson.id}`,
        grade: lesson.grade,
        chapter: lesson.chapterNumber,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        subtitle: lesson.summary,
        objectives: lesson.objectives.map((item) => item.statement),
        estimatedMinutes: lesson.estimatedMinutes,
        steps,
      };
    });
}
