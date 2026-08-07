import type { LessonDefinition } from "@/types/lesson";
import type { StudentBrainSnapshot } from "@/types/student";
import type { TutorStudentContext } from "@/types/tutor";

export function buildTutorStudentContext({
  lesson,
  brain,
}: {
  lesson: LessonDefinition;
  brain: StudentBrainSnapshot;
}): TutorStudentContext {
  const weakSkills = brain.skills
    .filter((skill) => skill.knowledgeNodeId === lesson.knowledgeNodeId)
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, 3)
    .map((skill) => ({
      skillName: skill.skillName,
      masteryScore: skill.masteryScore,
      confidence: skill.confidence,
    }));

  const skillIds = new Set(
    brain.skills
      .filter((skill) => skill.knowledgeNodeId === lesson.knowledgeNodeId)
      .map((skill) => skill.id),
  );

  const recentMistakes = brain.mistakes
    .filter((mistake) => skillIds.has(mistake.skillId) && !mistake.resolved)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((mistake) => ({
      category: mistake.category,
      description: mistake.description,
      count: mistake.count,
    }));

  return {
    displayName: brain.profile.displayName,
    lessonId: lesson.id,
    knowledgeNodeId: lesson.knowledgeNodeId,
    weakSkills,
    recentMistakes,
  };
}
