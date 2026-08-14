import { lesson1AdvancedProblems } from "@/data/advanced/lesson-1-advanced";
import { lesson2AdvancedProblems } from "@/data/advanced/lesson-2-advanced";
import { lesson3AdvancedProblems } from "@/data/advanced/lesson-3-advanced";
import { lesson4AdvancedProblems } from "@/data/advanced/lesson-4-advanced";
import type { AdvancedMathProblem } from "@/types/advanced";

const banks: Record<string, AdvancedMathProblem[]> = {
  "lesson-player-01": lesson1AdvancedProblems,
  "lesson-player-02": lesson2AdvancedProblems,
  "lesson-player-03": lesson3AdvancedProblems,
  "lesson-player-04": lesson4AdvancedProblems,
};

export function getAdvancedProblemsByLessonId(lessonId: string): AdvancedMathProblem[] {
  return banks[lessonId] ?? [];
}

export function hasAdvancedProblems(lessonId: string): boolean {
  return (banks[lessonId]?.length ?? 0) > 0;
}
