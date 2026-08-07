import type { LessonDefinition } from "@/types/lesson";

export function lessonToJson(lesson: LessonDefinition): string {
  return JSON.stringify(lesson, null, 2);
}

export function downloadLessonJson(lesson: LessonDefinition): void {
  const blob = new Blob([lessonToJson(lesson)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeTitle = lesson.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  anchor.href = url;
  anchor.download = `lesson-${lesson.grade}-${lesson.chapter}-${lesson.lessonNumber}-${safeTitle || "draft"}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
