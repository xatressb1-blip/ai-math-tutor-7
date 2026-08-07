import type {
  AcademicLesson,
  AcademicValidationIssue,
  AcademicValidationResult,
} from "@/types/academic";

function issue(
  level: "ERROR" | "WARNING",
  path: string,
  message: string,
): AcademicValidationIssue {
  return { level, path, message };
}

export function validateAcademicLesson(
  lesson: AcademicLesson,
): AcademicValidationResult {
  const issues: AcademicValidationIssue[] = [];

  if (!lesson.id.trim()) issues.push(issue("ERROR", "id", "Academic Lesson phải có id."));
  if (!lesson.title.trim()) issues.push(issue("ERROR", "title", "Bài học phải có tiêu đề."));
  if (lesson.objectives.length === 0) issues.push(issue("ERROR", "objectives", "Cần ít nhất một mục tiêu học tập."));
  if (lesson.concepts.length === 0) issues.push(issue("ERROR", "concepts", "Cần ít nhất một concept."));
  if (lesson.sourceRefs.length === 0) issues.push(issue("ERROR", "sourceRefs", "Phải khai báo nguồn học thuật."));
  if (!lesson.sourceRefs.some((source) => source.role === "PRIMARY")) {
    issues.push(issue("ERROR", "sourceRefs", "Phải có nguồn PRIMARY để bảo đảm bám SGK."));
  }
  if (lesson.teachingScript.length < 3) {
    issues.push(issue("WARNING", "teachingScript", "Nên có ít nhất 3 teaching moves để AI không chỉ đọc định nghĩa."));
  }
  if (lesson.misconceptions.length === 0) {
    issues.push(issue("WARNING", "misconceptions", "Chưa có Mistake Library cho bài học."));
  }
  if (lesson.reasoningTemplates.length === 0) {
    issues.push(issue("WARNING", "reasoningTemplates", "Chưa có Reasoning Template."));
  }
  if (lesson.practiceBlueprint.length === 0) {
    issues.push(issue("WARNING", "practiceBlueprint", "Chưa có Practice Blueprint."));
  }

  for (const objective of lesson.objectives) {
    if (objective.masteryThreshold < 50 || objective.masteryThreshold > 100) {
      issues.push(issue("ERROR", `objectives.${objective.id}.masteryThreshold`, "Mastery threshold phải nằm trong 50-100."));
    }
  }

  return {
    valid: !issues.some((item) => item.level === "ERROR"),
    errors: issues.filter((item) => item.level === "ERROR"),
    warnings: issues.filter((item) => item.level === "WARNING"),
  };
}
