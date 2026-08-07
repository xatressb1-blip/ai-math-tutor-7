import { lesson1AdaptiveExerciseBank } from "@/data/exercises/lesson-1-bank";
import { lesson2AdaptiveExerciseBank } from "@/data/exercises/lesson-2-bank";
import { lesson3AdaptiveExerciseBank } from "@/data/exercises/lesson-3-bank";
import { lesson4AdaptiveExerciseBank } from "@/data/exercises/lesson-4-bank";
import type { AdaptiveExercise } from "@/types/adaptive-exercise";

const banks: Record<string, AdaptiveExercise[]> = {
  "lesson-player-01": lesson1AdaptiveExerciseBank,
  "lesson-player-02": lesson2AdaptiveExerciseBank,
  "lesson-player-03": lesson3AdaptiveExerciseBank,
  "lesson-player-04": lesson4AdaptiveExerciseBank,
};

export function getAdaptiveExerciseBank(lessonId: string): AdaptiveExercise[] {
  return banks[lessonId] ?? [];
}

export function hasAdaptiveExerciseBank(lessonId: string): boolean {
  return getAdaptiveExerciseBank(lessonId).length > 0;
}
