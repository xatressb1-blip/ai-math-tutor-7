import type { LessonQuestion } from "@/types/lesson";
import type {
  TeachingBrainDecision,
  TeachingDiagnosis,
  TeachingIntervention,
} from "@/types/teaching-brain";
import type { MistakeCategory } from "@/types/student";

function inferFallbackCategory(question: LessonQuestion): MistakeCategory {
  const skill = question.skillName.toLowerCase();
  if (skill.includes("số đối")) return "SIGN";
  if (skill.includes("trục số")) return "PROCEDURE";
  return "CONCEPT";
}

function inferFallbackLabel(question: LessonQuestion): string {
  const skill = question.skillName.toLowerCase();
  if (skill.includes("số đối")) {
    return "Có thể đang nhầm quy tắc số đối";
  }
  if (skill.includes("trục số")) {
    return "Có thể chưa chắc cách xác định vị trí trên trục số";
  }
  return "Có thể chưa chắc khái niệm cốt lõi";
}

function diagnosisConfidence({
  hasExplicitRule,
  attemptNumber,
}: {
  hasExplicitRule: boolean;
  attemptNumber: number;
}): TeachingDiagnosis["confidence"] {
  if (hasExplicitRule && attemptNumber >= 2) return "HIGH";
  if (hasExplicitRule) return "MEDIUM";
  return attemptNumber >= 2 ? "MEDIUM" : "LOW";
}

function chooseIntervention({
  attemptNumber,
  responseSeconds,
}: {
  attemptNumber: number;
  responseSeconds: number;
}): TeachingIntervention {
  if (attemptNumber === 1 && responseSeconds <= 5) {
    return "SLOW_DOWN_AND_RECHECK";
  }
  if (attemptNumber === 1) return "TARGETED_HINT";
  if (attemptNumber === 2) return "CONTRAST_EXAMPLE";
  return "STEP_BY_STEP_RETEACH";
}

export function decideTeachingAction({
  question,
  selectedChoiceId,
  isCorrect,
  attemptNumber,
  responseSeconds,
}: {
  question: LessonQuestion;
  selectedChoiceId: string;
  isCorrect: boolean;
  attemptNumber: number;
  responseSeconds: number;
}): TeachingBrainDecision {
  if (isCorrect) {
    return {
      diagnosis: null,
      intervention: "ADVANCE",
      nextActionLabel: "Củng cố ngắn rồi chuyển bước",
      coachText: question.explanation,
    };
  }

  const explicitRule = question.diagnostics?.find(
    (rule) => rule.choiceId === selectedChoiceId,
  );
  const diagnosis: TeachingDiagnosis = explicitRule
    ? {
        category: explicitRule.category,
        label: explicitRule.label,
        evidence: explicitRule.evidence,
        confidence: diagnosisConfidence({
          hasExplicitRule: true,
          attemptNumber,
        }),
      }
    : {
        category: inferFallbackCategory(question),
        label: inferFallbackLabel(question),
        evidence: `AI suy đoán từ lựa chọn của em trong kỹ năng “${question.skillName}”.`,
        confidence: diagnosisConfidence({
          hasExplicitRule: false,
          attemptNumber,
        }),
      };

  const intervention = chooseIntervention({ attemptNumber, responseSeconds });

  if (intervention === "SLOW_DOWN_AND_RECHECK") {
    return {
      diagnosis,
      intervention,
      nextActionLabel: "Đọc lại đề và kiểm tra dấu/điều kiện",
      coachText:
        "Em trả lời khá nhanh. Chưa cần đổi cách làm; hãy đọc lại câu hỏi một lượt, gạch chân dữ kiện quan trọng rồi thử lại.",
    };
  }

  if (intervention === "TARGETED_HINT") {
    return {
      diagnosis,
      intervention,
      nextActionLabel: "Gợi ý đúng vào chỗ đang vướng",
      coachText: explicitRule?.targetedHint ?? question.hint,
    };
  }

  if (intervention === "CONTRAST_EXAMPLE") {
    return {
      diagnosis,
      intervention,
      nextActionLabel: "Đưa ví dụ đối chiếu rồi cho thử lại",
      coachText:
        explicitRule?.contrastExample ??
        `${question.retryHint} Hãy so sánh điều này với lựa chọn em vừa chọn rồi thử lại.`,
    };
  }

  return {
    diagnosis,
    intervention,
    nextActionLabel: "Dạy lại từng bước, vẫn để em tự chọn đáp án",
    coachText: `${question.retryHint} Bước 1: nhắc lại quy tắc. Bước 2: áp dụng vào dữ kiện của câu hỏi. Bước 3: loại các lựa chọn không thỏa quy tắc rồi em chọn lại.`,
  };
}
