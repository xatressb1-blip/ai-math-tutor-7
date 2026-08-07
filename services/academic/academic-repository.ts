import {
  academicChapter2,
  academicChapter2Lessons,
} from "@/data/academic/chapter-2-foundation";
import {
  academicChapter3,
  academicChapter3Lessons,
} from "@/data/academic/chapter-3-full";
import { academicSources } from "@/data/academic/sources";
import { validateAcademicLesson } from "@/services/academic/academic-validator";
import type { AcademicChapter, AcademicLesson } from "@/types/academic";

const chapters: AcademicChapter[] = [academicChapter2, academicChapter3];
const lessons: AcademicLesson[] = [
  ...academicChapter2Lessons,
  ...academicChapter3Lessons,
];

export function getAcademicChapters(): AcademicChapter[] {
  return [...chapters].sort((a, b) => a.number - b.number);
}

export function getAcademicLessons(): AcademicLesson[] {
  return [...lessons].sort(
    (a, b) => a.chapterNumber - b.chapterNumber || a.lessonNumber - b.lessonNumber,
  );
}

export function getAcademicLessonsByChapter(chapterId: string): AcademicLesson[] {
  return getAcademicLessons().filter((lesson) => lesson.chapterId === chapterId);
}

export function getAcademicLessonById(id: string): AcademicLesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getAcademicSources() {
  return [...academicSources];
}

export function getAcademicEngineStats() {
  const validations = lessons.map(validateAcademicLesson);
  return {
    schemaVersion: "1.0",
    chapters: chapters.length,
    lessons: lessons.length,
    concepts: lessons.reduce((sum, lesson) => sum + lesson.concepts.length, 0),
    objectives: lessons.reduce((sum, lesson) => sum + lesson.objectives.length, 0),
    misconceptions: lessons.reduce((sum, lesson) => sum + lesson.misconceptions.length, 0),
    hintLadders: lessons.reduce((sum, lesson) => sum + lesson.hintLadders.length, 0),
    reasoningTemplates: lessons.reduce((sum, lesson) => sum + lesson.reasoningTemplates.length, 0),
    sources: academicSources.length,
    validLessons: validations.filter((item) => item.valid).length,
    warnings: validations.reduce((sum, item) => sum + item.warnings.length, 0),
  };
}
