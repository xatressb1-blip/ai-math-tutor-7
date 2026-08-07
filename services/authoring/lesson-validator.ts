import type { LessonDefinition, LessonStep } from "@/types/lesson";
import type {
  LessonValidationIssue,
  LessonValidationResult,
} from "@/types/lesson-authoring";

const VALID_ACTIONS = new Set([
  "WELCOME",
  "OBJECTIVE",
  "EXPLAIN",
  "EXAMPLE",
  "QUESTION",
  "SUMMARY",
]);

function issue(
  level: "ERROR" | "WARNING",
  path: string,
  message: string,
): LessonValidationIssue {
  return { level, path, message };
}

function validateStep(step: LessonStep, index: number): LessonValidationIssue[] {
  const issues: LessonValidationIssue[] = [];
  const base = `steps[${index}]`;

  if (!step.id.trim()) issues.push(issue("ERROR", `${base}.id`, "Bước học phải có id."));
  if (!VALID_ACTIONS.has(step.action)) {
    issues.push(issue("ERROR", `${base}.action`, `Teaching action "${step.action}" không hợp lệ.`));
  }
  if (!step.title.trim()) issues.push(issue("ERROR", `${base}.title`, "Bước học phải có tiêu đề."));
  if (!step.content.trim()) issues.push(issue("WARNING", `${base}.content`, "Nội dung bước đang để trống."));
  if (!Number.isFinite(step.estimatedMinutes) || step.estimatedMinutes <= 0) {
    issues.push(issue("ERROR", `${base}.estimatedMinutes`, "Thời lượng ước tính phải lớn hơn 0."));
  }

  if (step.action === "QUESTION") {
    if (!step.question) {
      issues.push(issue("ERROR", `${base}.question`, "Bước QUESTION phải có dữ liệu câu hỏi."));
      return issues;
    }

    const q = step.question;
    if (!q.prompt.trim()) issues.push(issue("ERROR", `${base}.question.prompt`, "Câu hỏi không được để trống."));
    if (q.choices.length < 2) {
      issues.push(issue("ERROR", `${base}.question.choices`, "Câu hỏi trắc nghiệm cần ít nhất 2 lựa chọn."));
    }

    const choiceIds = q.choices.map((choice) => choice.id);
    if (new Set(choiceIds).size !== choiceIds.length) {
      issues.push(issue("ERROR", `${base}.question.choices`, "Các lựa chọn phải có id khác nhau."));
    }
    if (!choiceIds.includes(q.correctChoiceId)) {
      issues.push(issue("ERROR", `${base}.question.correctChoiceId`, "correctChoiceId phải trùng với một lựa chọn."));
    }
    if (!q.skillName.trim()) {
      issues.push(issue("ERROR", `${base}.question.skillName`, "Câu hỏi phải gắn với một kỹ năng."));
    }
    if (!q.hint.trim()) issues.push(issue("WARNING", `${base}.question.hint`, "Nên có gợi ý lần đầu."));
    if (!q.retryHint.trim()) issues.push(issue("WARNING", `${base}.question.retryHint`, "Nên có gợi ý khi học sinh thử lại."));
    if (!q.explanation.trim()) {
      issues.push(issue("WARNING", `${base}.question.explanation`, "Nên có lời giải thích sau khi trả lời đúng."));
    }
  } else if (step.question) {
    issues.push(issue("WARNING", `${base}.question`, "Bước không phải QUESTION nhưng đang chứa dữ liệu câu hỏi."));
  }

  return issues;
}

export function validateLessonDefinition(
  lesson: LessonDefinition,
): LessonValidationResult {
  const issues: LessonValidationIssue[] = [];

  if (!lesson.id.trim()) issues.push(issue("ERROR", "id", "Bài học phải có id."));
  if (!lesson.knowledgeNodeId.trim()) {
    issues.push(issue("ERROR", "knowledgeNodeId", "Bài học phải liên kết Knowledge Node."));
  }
  if (lesson.grade <= 0) issues.push(issue("ERROR", "grade", "Khối lớp không hợp lệ."));
  if (lesson.chapter <= 0 || lesson.lessonNumber <= 0) {
    issues.push(issue("ERROR", "chapter", "Số chương và số bài phải lớn hơn 0."));
  }
  if (!lesson.title.trim()) issues.push(issue("ERROR", "title", "Tên bài học không được để trống."));
  if (lesson.objectives.length === 0) {
    issues.push(issue("ERROR", "objectives", "Bài học cần ít nhất một mục tiêu."));
  }
  if (lesson.steps.length === 0) issues.push(issue("ERROR", "steps", "Bài học cần ít nhất một bước dạy."));

  const stepIds = lesson.steps.map((step) => step.id);
  if (new Set(stepIds).size !== stepIds.length) {
    issues.push(issue("ERROR", "steps", "Mỗi bước học phải có id duy nhất."));
  }

  lesson.steps.forEach((step, index) => issues.push(...validateStep(step, index)));

  const estimatedTotal = lesson.steps.reduce((sum, step) => sum + step.estimatedMinutes, 0);
  if (Math.abs(estimatedTotal - lesson.estimatedMinutes) >= 6) {
    issues.push(
      issue(
        "WARNING",
        "estimatedMinutes",
        `Tổng thời lượng các bước là ${estimatedTotal} phút, khác khá nhiều so với thời lượng bài ${lesson.estimatedMinutes} phút.`,
      ),
    );
  }

  const questionCount = lesson.steps.filter((step) => step.action === "QUESTION").length;
  if (questionCount < 3) {
    issues.push(issue("WARNING", "steps", "Nên có ít nhất 3 checkpoint để kiểm tra mức độ hiểu bài."));
  }

  return {
    isValid: !issues.some((item) => item.level === "ERROR"),
    errors: issues.filter((item) => item.level === "ERROR"),
    warnings: issues.filter((item) => item.level === "WARNING"),
  };
}

export function parseLessonJson(input: string): LessonDefinition {
  const value: unknown = JSON.parse(input);
  if (!value || typeof value !== "object") {
    throw new Error("JSON không chứa một Lesson Definition hợp lệ.");
  }
  return value as LessonDefinition;
}
