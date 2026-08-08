import type { MultiStudentWorkspace } from "@/types/multi-student";

export function buildMultiStudentClassSummary(workspace: MultiStudentWorkspace) {
  return workspace.students.map((student) => {
    const brain = workspace.brains[student.profile.id];
    const attempts = brain?.sessions.reduce((sum, item) => sum + item.questionsAttempted, 0) ?? 0;
    const correct = brain?.sessions.reduce((sum, item) => sum + item.questionsCorrect, 0) ?? 0;
    const mastery = brain?.skills.length
      ? Math.round(brain.skills.reduce((sum, item) => sum + item.masteryScore, 0) / brain.skills.length)
      : 0;
    const openMistakes = brain?.mistakes.filter((item) => !item.resolved).reduce((sum, item) => sum + item.count, 0) ?? 0;
    return {
      studentId: student.profile.id,
      displayName: student.profile.displayName,
      className: student.profile.className || "Chưa xếp lớp",
      mastery,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      sessions: brain?.sessions.length ?? 0,
      openMistakes,
      needsAttention: mastery < 55 || openMistakes >= 3,
    };
  });
}
