import type { LessonDefinition, LessonStep } from "@/types/lesson";

export function getLessonProgress(
  lesson: LessonDefinition,
  stepIndex: number,
): number {
  if (lesson.steps.length === 0) return 0;
  return Math.round(((stepIndex + 1) / lesson.steps.length) * 100);
}

export function getCurrentStep(
  lesson: LessonDefinition,
  stepIndex: number,
): LessonStep {
  return lesson.steps[Math.min(Math.max(stepIndex, 0), lesson.steps.length - 1)];
}

export function getRemainingMinutes(
  lesson: LessonDefinition,
  stepIndex: number,
): number {
  return lesson.steps
    .slice(stepIndex)
    .reduce((total, step) => total + step.estimatedMinutes, 0);
}

export function isLastStep(
  lesson: LessonDefinition,
  stepIndex: number,
): boolean {
  return stepIndex >= lesson.steps.length - 1;
}
