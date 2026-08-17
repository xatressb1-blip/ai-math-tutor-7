import { lesson1AdvancedProblems } from "@/data/advanced/lesson-1-advanced";
import { lesson2AdvancedProblems } from "@/data/advanced/lesson-2-advanced";
import { lesson3AdvancedProblems } from "@/data/advanced/lesson-3-advanced";
import { lesson4AdvancedProblems } from "@/data/advanced/lesson-4-advanced";
import { lesson5AdvancedProblems } from "@/data/advanced/lesson-5-advanced";
import { lesson6AdvancedProblems } from "@/data/advanced/lesson-6-advanced";
import { lesson7AdvancedProblems } from "@/data/advanced/lesson-7-advanced";
import { lesson8AdvancedProblems } from "@/data/advanced/lesson-8-advanced";
import { lesson9AdvancedProblems } from "@/data/advanced/lesson-9-advanced";
import { lesson10AdvancedProblems } from "@/data/advanced/lesson-10-advanced";
import { lesson11AdvancedProblems } from "@/data/advanced/lesson-11-advanced";
import { lesson12AdvancedProblems } from "@/data/advanced/lesson-12-advanced";
import { lesson13AdvancedProblems } from "@/data/advanced/lesson-13-advanced";
import { lesson14AdvancedProblems } from "@/data/advanced/lesson-14-advanced";
import { lesson15AdvancedProblems } from "@/data/advanced/lesson-15-advanced";
import { lesson16AdvancedProblems } from "@/data/advanced/lesson-16-advanced";
import { lesson17AdvancedProblems } from "@/data/advanced/lesson-17-advanced";
import { lesson18AdvancedProblems } from "@/data/advanced/lesson-18-advanced";
import { lesson19AdvancedProblems } from "@/data/advanced/lesson-19-advanced";
import type { AdvancedMathProblem } from "@/types/advanced";

const banks: Record<string, AdvancedMathProblem[]> = {
  "lesson-player-01": lesson1AdvancedProblems,
  "lesson-player-02": lesson2AdvancedProblems,
  "lesson-player-03": lesson3AdvancedProblems,
  "lesson-player-04": lesson4AdvancedProblems,
  "lesson-player-05": lesson5AdvancedProblems,
  "lesson-player-06": lesson6AdvancedProblems,
  "lesson-player-07": lesson7AdvancedProblems,
  "lesson-player-08": lesson8AdvancedProblems,
  "lesson-player-09": lesson9AdvancedProblems,
  "lesson-player-10": lesson10AdvancedProblems,
  "lesson-player-11": lesson11AdvancedProblems,
  "lesson-player-12": lesson12AdvancedProblems,
  "lesson-player-13": lesson13AdvancedProblems,
  "lesson-player-14": lesson14AdvancedProblems,
  "lesson-player-15": lesson15AdvancedProblems,
  "lesson-player-16": lesson16AdvancedProblems,
  "lesson-player-17": lesson17AdvancedProblems,
  "lesson-player-18": lesson18AdvancedProblems,
  "lesson-player-19": lesson19AdvancedProblems,
};

export function getAdvancedProblemsByLessonId(lessonId: string): AdvancedMathProblem[] {
  return banks[lessonId] ?? [];
}

export function hasAdvancedProblems(lessonId: string): boolean {
  return (banks[lessonId]?.length ?? 0) > 0;
}
