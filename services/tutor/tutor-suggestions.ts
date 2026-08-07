import type { LessonDefinition } from "@/types/lesson";

export function getTutorSuggestions(lesson: LessonDefinition): string[] {
  const questionStep = lesson.steps.find((step) => step.question);
  const explainStep = lesson.steps.find((step) => step.action === "EXPLAIN");

  return [
    `Giải thích ngắn gọn ${explainStep?.title ?? lesson.title} cho em.`,
    questionStep
      ? `Gợi ý cho em câu: ${questionStep.question?.prompt}`
      : "Cho em một ví dụ dễ hiểu.",
    "Em hay sai ở đâu trong bài này?",
    "Hỏi em một câu để kiểm tra xem em đã hiểu chưa.",
  ];
}
