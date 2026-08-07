import { lesson1 } from "@/data/lessons/lesson-1";
import { lesson2 } from "@/data/lessons/lesson-2";
import { lesson3 } from "@/data/lessons/lesson-3";
import { lesson4 } from "@/data/lessons/lesson-4";
import { lesson5 } from "@/data/lessons/lesson-5";
import { lesson6 } from "@/data/lessons/lesson-6";
import { lesson7 } from "@/data/lessons/lesson-7";
import { lesson8 } from "@/data/lessons/lesson-8";
import { lesson9 } from "@/data/lessons/lesson-9";
import { lesson10 } from "@/data/lessons/lesson-10";
import { lesson11 } from "@/data/lessons/lesson-11";
import type { LessonDefinition } from "@/types/lesson";

const lessons: LessonDefinition[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10, lesson11];

export function getAllLessons(): LessonDefinition[] {
  return [...lessons].sort(
    (a, b) => a.chapter - b.chapter || a.lessonNumber - b.lessonNumber,
  );
}

export function getLessonsByChapter(chapter: number): LessonDefinition[] {
  return getAllLessons().filter((lesson) => lesson.chapter === chapter);
}

export function getLessonById(id: string): LessonDefinition | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonByKnowledgeNodeId(
  knowledgeNodeId: string,
): LessonDefinition | undefined {
  return lessons.find((lesson) => lesson.knowledgeNodeId === knowledgeNodeId);
}

export function getNextLesson(currentLessonId: string): LessonDefinition | undefined {
  const ordered = getAllLessons();
  const index = ordered.findIndex((lesson) => lesson.id === currentLessonId);
  if (index < 0) return undefined;
  return ordered[index + 1];
}
