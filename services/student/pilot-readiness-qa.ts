import { getCanonicalLessonNumbers, getCanonicalSkillDefinitions, sameCanonicalSkill } from "@/services/student/canonical-skill-registry";
import { buildSemesterRevisionPlan } from "@/services/revision/semester-revision-engine";
import { buildChapterProgress } from "@/services/learning/chapter-progress-engine";
import type { LessonDefinition } from "@/types/lesson";
import type { StudentBrainSnapshot } from "@/types/student";

export type PilotReadinessCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

function emptyBrain(): StudentBrainSnapshot {
  return {
    profile: {
      id: "qa-student",
      displayName: "QA",
      grade: 7,
      goal: "QA",
      preferredSessionMinutes: 25,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    skills: [],
    mistakes: [],
    sessions: [],
    diagnostics: [],
  };
}

export function runPilotReadinessQa(): PilotReadinessCheck[] {
  const defs = getCanonicalSkillDefinitions();
  const ids = defs.map((item) => item.skillId);
  const uniqueIds = new Set(ids);
  const b12Alias = sameCanonicalSkill(
    "Tính góc còn lại của tam giác",
    "Tính góc còn lại của tam giác.",
  );
  const b17Alias = sameCanonicalSkill(
    "Phân loại dữ liệu",
    "Phân loại dữ liệu.",
  );

  const freshReadinessPlan = buildSemesterRevisionPlan(emptyBrain());
  const freshReadiness = freshReadinessPlan.readinessScore;
  const canonicalLessons = getCanonicalLessonNumbers();
  const fullSemesterCanonical =
    canonicalLessons.length === 19 &&
    canonicalLessons.every((lesson, index) => lesson === index + 1);

  const reasoningCoverageBrain = emptyBrain();
  for (let lessonNumber = 1; lessonNumber <= 19; lessonNumber += 1) {
    reasoningCoverageBrain.sessions.push({
      id: `reasoning-${lessonNumber}`,
      studentId: reasoningCoverageBrain.profile.id,
      knowledgeNodeId: `lesson-${lessonNumber}-qa`,
      startedAt: "2026-01-01T00:00:00.000Z",
      durationMinutes: 5,
      questionsAttempted: 4,
      questionsCorrect: 4,
      note: "Reasoning-only coverage QA",
      source: "REASONING",
    });
  }
  const reasoningCoverage =
    buildSemesterRevisionPlan(reasoningCoverageBrain).curriculumCoverage;

  const partialCoverageBrain = emptyBrain();
  for (let lessonNumber = 8; lessonNumber <= 19; lessonNumber += 1) {
    partialCoverageBrain.sessions.push({
      id: `lesson-${lessonNumber}`,
      studentId: partialCoverageBrain.profile.id,
      knowledgeNodeId: `lesson-${lessonNumber}-qa`,
      startedAt: "2026-01-01T00:00:00.000Z",
      durationMinutes: 20,
      questionsAttempted: 4,
      questionsCorrect: 4,
      note: "Lesson coverage QA",
      source: "LESSON",
    });
  }
  const partialCoverage =
    buildSemesterRevisionPlan(partialCoverageBrain).curriculumCoverage;

  const fakeLesson: LessonDefinition = {
    id: "lesson-player-08",
    knowledgeNodeId: "lesson-8-goc-o-vi-tri-dac-biet",
    grade: 7,
    chapter: 3,
    lessonNumber: 8,
    title: "QA",
    subtitle: "QA",
    objectives: [],
    estimatedMinutes: 1,
    steps: [],
  };
  const reasoningOnly = emptyBrain();
  reasoningOnly.sessions.push({
    id: "r1",
    studentId: reasoningOnly.profile.id,
    knowledgeNodeId: fakeLesson.knowledgeNodeId,
    startedAt: "2026-01-01T00:00:00.000Z",
    durationMinutes: 5,
    questionsAttempted: 4,
    questionsCorrect: 4,
    note: "Reasoning 100/100",
    source: "REASONING",
  });
  const progress = buildChapterProgress({
    lessons: [fakeLesson],
    brain: reasoningOnly,
    chapterTitle: "QA",
  });
  const reasoningCannotComplete =
    progress.lessons[0]?.status !== "COMPLETED";

  return [
    {
      id: "canonical-unique",
      label: "Canonical Skill IDs duy nhất",
      passed: uniqueIds.size === ids.length,
      detail: `${uniqueIds.size}/${ids.length} ID duy nhất.`,
    },
    {
      id: "canonical-semester",
      label: "Canonical Registry bao phủ đủ 19 bài",
      passed: fullSemesterCanonical,
      detail: `Bao phủ ${canonicalLessons.length}/19 bài: ${canonicalLessons.join(", ")}.`,
    },
    {
      id: "reasoning-coverage-isolation",
      label: "Reasoning không thay thế curriculum coverage",
      passed: reasoningCoverage === 0,
      detail: `19 Reasoning-only sessions tạo curriculum coverage ${reasoningCoverage}%.`,
    },
    {
      id: "partial-semester-coverage",
      label: "Học Bài 8–19 không thể thành 100% semester coverage",
      passed: partialCoverage < 100,
      detail: `12/19 Lesson sessions tạo coverage ${partialCoverage}%.`,
    },
    {
      id: "alias-b12",
      label: "Bài 12 không phân mảnh vì dấu chấm",
      passed: b12Alias,
      detail: "Hai display string phải quy về cùng skillId.",
    },
    {
      id: "alias-b17",
      label: "Bài 17 không phân mảnh vì dấu chấm",
      passed: b17Alias,
      detail: "Phân loại dữ liệu phải có một identity.",
    },
    {
      id: "fresh-readiness",
      label: "Học sinh mới không có false semester readiness",
      passed: freshReadiness <= 10,
      detail: `Readiness học sinh mới: ${freshReadiness}/100.`,
    },
    {
      id: "reasoning-progress-gate",
      label: "Reasoning-only không mở khóa Lesson Core",
      passed: reasoningCannotComplete,
      detail: `Trạng thái lesson sau Reasoning-only: ${progress.lessons[0]?.status ?? "UNKNOWN"}.`,
    },
  ];
}
