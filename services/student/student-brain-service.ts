import { demoStudentBrain } from "@/data/student/demo-student";
import type {
  MistakeRecord,
  StudentBrainSnapshot,
  StudentSkill,
} from "@/types/student";

export function getDemoStudentBrain(): StudentBrainSnapshot {
  return demoStudentBrain;
}

export function getAverageMastery(skills: StudentSkill[]): number {
  if (skills.length === 0) return 0;

  const total = skills.reduce((sum, skill) => sum + skill.masteryScore, 0);
  return Math.round(total / skills.length);
}

export function getPrioritySkills(skills: StudentSkill[]): StudentSkill[] {
  return [...skills]
    .filter((skill) => skill.status !== "MASTERED")
    .sort((a, b) => a.masteryScore - b.masteryScore);
}

export function getOpenMistakes(mistakes: MistakeRecord[]): MistakeRecord[] {
  return mistakes
    .filter((mistake) => !mistake.resolved)
    .sort((a, b) => b.count - a.count);
}

export function getStudentRecommendation(brain: StudentBrainSnapshot): string {
  const prioritySkill = getPrioritySkills(brain.skills)[0];
  const priorityMistake = getOpenMistakes(brain.mistakes)[0];

  if (!prioritySkill) {
    return "Các kỹ năng hiện tại đều ổn. Có thể chuyển sang bài vận dụng tiếp theo.";
  }

  if (priorityMistake && priorityMistake.skillId === prioritySkill.id) {
    return `Ưu tiên ${prioritySkill.skillName}: ${priorityMistake.description}`;
  }

  return `Ưu tiên luyện ${prioritySkill.skillName} vì mức thành thạo hiện tại là ${prioritySkill.masteryScore}/100.`;
}
