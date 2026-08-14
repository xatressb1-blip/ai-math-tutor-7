import { lesson1AdvancedProblems } from "@/data/advanced/lesson-1-advanced";
import { lesson2AdvancedProblems } from "@/data/advanced/lesson-2-advanced";
import { lesson3AdvancedProblems } from "@/data/advanced/lesson-3-advanced";
import { lesson4AdvancedProblems } from "@/data/advanced/lesson-4-advanced";
import { evaluateAdvancedReasoningStep } from "@/services/advanced/advanced-reasoning-evaluator";
import type { AdvancedMathProblem } from "@/types/advanced";
import type { ReasoningStepDefinition } from "@/types/reasoning";

export type AdvancedQualityCase = {
  id: string;
  stepId: string;
  expected: "PASS" | "FAIL";
  input: string;
  purpose: string;
};

export type AdvancedQualityCaseResult = AdvancedQualityCase & {
  actual: "PASS" | "FAIL";
  passed: boolean;
  feedback: string;
};

export type AdvancedQualityReport = {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  results: AdvancedQualityCaseResult[];
  diversity: AdvancedReasoningDiversityItem[];
};

export type AdvancedReasoningDiversityItem = {
  lesson: number;
  lessonTitle: string;
  primaryModes: string[];
  warning?: string;
};

const problems: AdvancedMathProblem[] = [
  ...lesson1AdvancedProblems,
  ...lesson2AdvancedProblems,
  ...lesson3AdvancedProblems,
  ...lesson4AdvancedProblems,
];

function getStep(stepId: string): ReasoningStepDefinition {
  for (const problem of problems) {
    const step = problem.steps.find((item) => item.id === stepId);
    if (step) return step;
  }
  throw new Error(`Không tìm thấy Advanced step ${stepId}`);
}

export const advancedAdversarialQualityCases: AdvancedQualityCase[] = [
  {
    id: "exact-fraction-pass",
    stepId: "l1a1-step1",
    expected: "PASS",
    input: "Em chọn 9/20 vì 2/5 = 8/20 < 9/20 < 10/20 = 1/2.",
    purpose: "Phân số hợp lệ nằm giữa hai cận phải được chấp nhận.",
  },
  {
    id: "fraction-substring-trap",
    stepId: "l1a1-step1",
    expected: "FAIL",
    input: "Em chọn 9/200.",
    purpose: "Không được nhận nhầm 9/20 bên trong một phân số khác.",
  },
  {
    id: "contradictory-claim",
    stepId: "l1a1-step1",
    expected: "FAIL",
    input: "9/20 không nằm giữa 2/5 và 1/2.",
    purpose: "Câu chứa đúng token nhưng phủ định kết luận phải bị chặn.",
  },
  {
    id: "proof-not-conclusion-only",
    stepId: "l1a1-step3",
    expected: "FAIL",
    input: "a < (a+b)/2 < b.",
    purpose: "Chỉ viết lại kết luận không được tính là chứng minh.",
  },
  {
    id: "proof-structural-pass",
    stepId: "l1a1-step3",
    expected: "PASS",
    input: "Từ a<b suy ra 2a<a+b<2b. Vì 2>0 nên chia cả ba vế cho 2 vẫn giữ chiều, do đó a<(a+b)/2<b.",
    purpose: "Chuỗi chứng minh đầy đủ phải PASS.",
  },
  {
    id: "division-answer-only",
    stepId: "l2a2-step2",
    expected: "FAIL",
    input: "Kết quả là -7/10.",
    purpose: "Đúng đáp số nhưng thiếu nghịch đảo không được PASS.",
  },
  {
    id: "division-transform-pass",
    stepId: "l2a2-step2",
    expected: "PASS",
    input: "3/5 : (-6/7) = 3/5 × (-7/6) = -7/10.",
    purpose: "Có phép biến đổi nghịch đảo và kết quả đúng phải PASS.",
  },
  {
    id: "power-answer-only",
    stepId: "l3a2-step2",
    expected: "FAIL",
    input: "64/729.",
    purpose: "Không được chấp nhận giá trị cuối nếu thiếu 2×3=6 và dấu.",
  },
  {
    id: "power-reasoning-pass",
    stepId: "l3a2-step2",
    expected: "PASS",
    input: "Số mũ phải là 2×3=6, nên ((-2/3)^2)^3=(-2/3)^6=64/729. Kết quả dương vì số mũ 6 là số chẵn.",
    purpose: "Lập luận số mũ + dấu + kết quả phải PASS.",
  },
  {
    id: "exponent-guess-only",
    stepId: "l3a3-step2",
    expected: "FAIL",
    input: "x=5.",
    purpose: "Đoán đúng nghiệm nhưng thiếu phương trình số mũ phải FAIL.",
  },
  {
    id: "exponent-equation-pass",
    stepId: "l3a3-step2",
    expected: "PASS",
    input: "Hai vế là lũy thừa cùng cơ số 2/3 khác 0 và khác 1 nên x+1=6, suy ra x=5.",
    purpose: "Nghiệm có căn cứ so sánh số mũ phải PASS.",
  },
  {
    id: "nested-operation-substring-trap",
    stepId: "l4a1-step3",
    expected: "FAIL",
    input: "A=13/40. Em làm đúng thứ tự từ ngoặc trong ra ngoài để tránh sai dấu.",
    purpose: "Không được nhận 3/4 khi nó chỉ xuất hiện như substring của 13/40.",
  },
  {
    id: "nested-operation-pass",
    stepId: "l4a1-step3",
    expected: "PASS",
    input: "A=3/4 vì sau khi xử lí ngoặc trong ra ngoài thì ngoặc vuông bằng 0. Làm đúng thứ tự giúp giữ cấu trúc biểu thức và tránh sai dấu.",
    purpose: "Đúng giá trị và có đánh giá chiến lược phải PASS.",
  },
  {
    id: "keyword-stuffing-wrong-equality",
    stepId: "l4a2-step2",
    expected: "FAIL",
    input: "x=-1/6; em có -5/6+2/3=-9/6 và cũng có -5/6+4/6.",
    purpose: "Không được PASS chỉ vì chứa đúng các token nếu đẳng thức trung gian sai.",
  },
  {
    id: "transpose-chain-pass",
    stepId: "l4a2-step2",
    expected: "PASS",
    input: "x=-5/6+2/3=-5/6+4/6=-1/6.",
    purpose: "Chuỗi biến đổi đúng phải PASS.",
  },
  {
    id: "reverse-equation-answer-only",
    stepId: "l4a3-step2",
    expected: "FAIL",
    input: "x=-1/12.",
    purpose: "Không được PASS nếu chỉ có nghiệm cuối.",
  },
  {
    id: "reverse-equation-pass",
    stepId: "l4a3-step2",
    expected: "PASS",
    input: "Từ x-1/4=-1/3, chuyển vế được x=-1/3+1/4=-4/12+3/12=-1/12.",
    purpose: "Có chuyển vế và quy đồng đúng phải PASS.",
  },
];

export const advancedReasoningDiversityMatrix: AdvancedReasoningDiversityItem[] = [
  {
    lesson: 1,
    lessonTitle: "Tập hợp các số hữu tỉ",
    primaryModes: ["Khái quát hóa", "Chứng minh", "Tính duy nhất", "So sánh có căn cứ"],
  },
  {
    lesson: 2,
    lessonTitle: "Cộng, trừ, nhân, chia số hữu tỉ",
    primaryModes: ["Chiến lược tính", "Phản biện lời giải", "Bài toán ngược", "Kiểm chứng"],
  },
  {
    lesson: 3,
    lessonTitle: "Lũy thừa với số mũ tự nhiên",
    primaryModes: ["Phát hiện quy luật", "Phân biệt quy tắc", "Suy luận số mũ", "Kiểm chứng"],
  },
  {
    lesson: 4,
    lessonTitle: "Thứ tự phép tính và chuyển vế",
    primaryModes: ["Lập kế hoạch nhiều bước", "Phân tích lỗi", "Biến đổi tương đương", "Kiểm chứng"],
    warning: "Có mô-típ bắt lỗi + bài toán ngược gần Bài 2; từ Bài 5 nên ưu tiên dạng tư duy khác.",
  },
];

export function runAdvancedQualityAudit(): AdvancedQualityReport {
  const results = advancedAdversarialQualityCases.map((item) => {
    const step = getStep(item.stepId);
    const evaluation = evaluateAdvancedReasoningStep({
      step,
      input: item.input,
      previousAttempts: [],
    });
    const actual: "PASS" | "FAIL" = evaluation.isCorrect ? "PASS" : "FAIL";
    return {
      ...item,
      actual,
      passed: actual === item.expected,
      feedback: evaluation.feedback,
    };
  });

  const passedCount = results.filter((item) => item.passed).length;
  return {
    passed: passedCount === results.length,
    passedCount,
    totalCount: results.length,
    results,
    diversity: advancedReasoningDiversityMatrix,
  };
}
