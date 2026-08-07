import { lesson1AdaptiveExerciseBank } from "@/data/exercises/lesson-1-bank";
import { lesson2AdaptiveExerciseBank } from "@/data/exercises/lesson-2-bank";
import { lesson3AdaptiveExerciseBank } from "@/data/exercises/lesson-3-bank";
import { lesson4AdaptiveExerciseBank } from "@/data/exercises/lesson-4-bank";
import { lesson5AdaptiveExerciseBank } from "@/data/exercises/lesson-5-bank";
import { lesson6AdaptiveExerciseBank } from "@/data/exercises/lesson-6-bank";
import { lesson7AdaptiveExerciseBank } from "@/data/exercises/lesson-7-bank";
import { lesson8AdaptiveExerciseBank } from "@/data/exercises/lesson-8-bank";
import { lesson9AdaptiveExerciseBank } from "@/data/exercises/lesson-9-bank";
import { lesson10AdaptiveExerciseBank } from "@/data/exercises/lesson-10-bank";
import { lesson11AdaptiveExerciseBank } from "@/data/exercises/lesson-11-bank";
import type { AdaptiveExercise } from "@/types/adaptive-exercise";

const banks: Record<string, AdaptiveExercise[]> = {
  "lesson-player-01": lesson1AdaptiveExerciseBank,
  "lesson-player-02": lesson2AdaptiveExerciseBank,
  "lesson-player-03": lesson3AdaptiveExerciseBank,
  "lesson-player-04": lesson4AdaptiveExerciseBank,
  "lesson-player-05": lesson5AdaptiveExerciseBank,
  "lesson-player-06": lesson6AdaptiveExerciseBank,
  "lesson-player-07": lesson7AdaptiveExerciseBank,
  "lesson-player-08": lesson8AdaptiveExerciseBank,
  "lesson-player-09": lesson9AdaptiveExerciseBank,
  "lesson-player-10": lesson10AdaptiveExerciseBank,
  "lesson-player-11": lesson11AdaptiveExerciseBank,
};

export function getAdaptiveExerciseBank(lessonId: string): AdaptiveExercise[] {
  return banks[lessonId] ?? [];
}

export function hasAdaptiveExerciseBank(lessonId: string): boolean {
  return getAdaptiveExerciseBank(lessonId).length > 0;
}
