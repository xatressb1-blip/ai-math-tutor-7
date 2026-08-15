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
  ...lesson5AdvancedProblems,
  ...lesson6AdvancedProblems,
  ...lesson7AdvancedProblems,
  ...lesson8AdvancedProblems,
  ...lesson9AdvancedProblems,
  ...lesson10AdvancedProblems,
  ...lesson11AdvancedProblems,
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

  {
    id: "l5-period-answer-only",
    stepId: "l5a1-step2",
    expected: "FAIL",
    input: "Chu kì là 3.",
    purpose: "Chỉ nêu chu kì nhưng không phân biệt phần 58 và chu kì giả 583 phải FAIL.",
  },
  {
    id: "l5-period-structure-pass",
    stepId: "l5a1-step2",
    expected: "PASS",
    input: "Chu kì là 3; phần 58 đứng trước chu kì. 583 không phải là chu kì vì 583 không lặp lại liên tiếp.",
    purpose: "Phân tích đủ phần trước chu kì và bác bỏ chu kì giả phải PASS.",
  },
  {
    id: "l5-infinite-is-not-enough",
    stepId: "l5a2-step3",
    expected: "PASS",
    input: "Nhận định sai. Số thập phân vô hạn chỉ tuần hoàn khi có một nhóm chữ số cố định lặp lại liên tục vô hạn.",
    purpose: "Phản ví dụ phải dẫn tới điều kiện đúng về tính tuần hoàn.",
  },
  {
    id: "l5-rounding-answer-only",
    stepId: "l5a3-step2",
    expected: "FAIL",
    input: "18,4 kg.",
    purpose: "Chỉ cho giá trị làm tròn mà không kiểm chứng sai số phải FAIL.",
  },
  {
    id: "l5-rounding-error-pass",
    stepId: "l5a3-step2",
    expected: "PASS",
    input: "18,374 kg làm tròn được 18,4 kg; |18,4-18,374|=0,026 kg < 0,05 kg nên đạt yêu cầu.",
    purpose: "Giá trị làm tròn kèm sai số và kiểm tra ngưỡng phải PASS.",
  },

  {
    id: "l6-sqrt-estimate-answer-only",
    stepId: "l6a1-step3",
    expected: "FAIL",
    input: "√10 ≈ 3,2.",
    purpose: "Chỉ đoán giá trị làm tròn mà không dùng mốc 3,15 phải FAIL.",
  },
  {
    id: "l6-sqrt-estimate-pass",
    stepId: "l6a1-step3",
    expected: "PASS",
    input: "Vì √10 > 3,15 nên làm tròn đến hàng phần mười được 3,2.",
    purpose: "Quyết định làm tròn dựa trên mốc giữa phải PASS.",
  },
  {
    id: "l6-plus-minus-trap",
    stepId: "l6a2-step2",
    expected: "FAIL",
    input: "Căn bậc hai số học không âm nên √49=±7.",
    purpose: "Có đúng từ khóa nhưng kết luận √49=±7 phải FAIL.",
  },
  {
    id: "l6-sqrt-definition-pass",
    stepId: "l6a2-step2",
    expected: "PASS",
    input: "Căn bậc hai số học là số không âm có bình phương bằng số đã cho, nên √49=7.",
    purpose: "Định nghĩa đúng và kết luận √49=7 phải PASS.",
  },
  {
    id: "l6-model-answer-only",
    stepId: "l6a3-step2",
    expected: "FAIL",
    input: "Cạnh khu vườn xấp xỉ 5,5 m.",
    purpose: "Kết quả mô hình đúng nhưng thiếu bình phương/mốc giữa phải FAIL.",
  },
  {
    id: "l6-model-rounding-pass",
    stepId: "l6a3-step2",
    expected: "PASS",
    input: "5,4²=29,16<30<30,25=5,5² và 5,45²=29,7025<30 nên √30>5,45; vì vậy cạnh làm tròn là 5,5 m.",
    purpose: "Ước lượng có chặn và mốc làm tròn đầy đủ phải PASS.",
  },

  {
    id: "l7-opposite-answer-only",
    stepId: "l7a1-step3",
    expected: "FAIL",
    input: "Tổng bằng 0.",
    purpose: "Nói đáp án kiểm chứng nhưng không viết phép cộng phải FAIL.",
  },
  {
    id: "l7-opposite-proof-pass",
    stepId: "l7a1-step3",
    expected: "PASS",
    input: "(3-√2)+(√2-3)=0.",
    purpose: "Kiểm chứng số đối bằng tổng bằng 0 phải PASS.",
  },
  {
    id: "l7-line-answer-only",
    stepId: "l7a2-step2",
    expected: "FAIL",
    input: "√2 < 1,42.",
    purpose: "So sánh đúng nhưng thiếu bình phương phải FAIL.",
  },
  {
    id: "l7-line-square-pass",
    stepId: "l7a2-step2",
    expected: "PASS",
    input: "1,42²=2,0164>2 nên √2<1,42.",
    purpose: "So sánh dựa trên bình phương phải PASS.",
  },
  {
    id: "l7-distance-one-root-trap",
    stepId: "l7a3-step2",
    expected: "FAIL",
    input: "x-√2=1 nên x=√2+1.",
    purpose: "Bỏ mất trường hợp âm của giá trị tuyệt đối phải FAIL.",
  },
  {
    id: "l7-distance-two-roots-no-cases",
    stepId: "l7a3-step2",
    expected: "FAIL",
    input: "x=√2-1 hoặc x=√2+1.",
    purpose: "Đoán đúng hai nghiệm nhưng không triển khai hai trường hợp phải FAIL.",
  },
  {
    id: "l7-distance-reasoning-pass",
    stepId: "l7a3-step2",
    expected: "PASS",
    input: "x-√2=1 hoặc x-√2=-1, nên x=√2+1 hoặc x=√2-1.",
    purpose: "Hai trường hợp và hai nghiệm đầy đủ phải PASS.",
  },

  {
    id: "l8-supplementary-overclaim",
    stepId: "l8a1-step1",
    expected: "FAIL",
    input: "Tổng bằng 180° nên hai góc kề bù.",
    purpose: "Không được suy ra kề bù chỉ từ tổng 180°.",
  },
  {
    id: "l8-supplementary-pass",
    stepId: "l8a1-step1",
    expected: "PASS",
    input: "Từ tổng 180° chỉ kết luận được hai góc bù nhau.",
    purpose: "Phân biệt đúng 'bù' và 'kề bù' phải PASS.",
  },
  {
    id: "l8-bisector-perpendicular-answer-only",
    stepId: "l8a2-step3",
    expected: "FAIL",
    input: "Om vuông góc On.",
    purpose: "Kết luận vuông góc không có chuỗi tính góc phải FAIL.",
  },
  {
    id: "l8-bisector-perpendicular-proof",
    stepId: "l8a2-step3",
    expected: "PASS",
    input: "∠mOn=α/2+(180°-α)/2=90°, nên Om vuông góc On.",
    purpose: "Chứng minh tổng quát không phụ thuộc α phải PASS.",
  },
  {
    id: "l8-vertical-bisector-visual-trap",
    stepId: "l8a3-step3",
    expected: "FAIL",
    input: "Nhìn hình thì Om và On là hai tia đối.",
    purpose: "Suy luận chỉ từ hình vẽ phải FAIL.",
  },
  {
    id: "l8-vertical-bisector-proof",
    stepId: "l8a3-step3",
    expected: "PASS",
    input: "Từ hai góc đối đỉnh bằng α, mỗi phân giác tạo α/2; ghép các góc được ∠mOn=180°, nên Om và On là hai tia đối.",
    purpose: "Kết luận quan hệ tia dựa trên chuỗi góc phải PASS.",
  },

  {
    id: "l9-arbitrary-equal-angles-trap",
    stepId: "l9a1-step1",
    expected: "FAIL",
    input: "Hai góc bằng nhau nên hai đường thẳng song song.",
    purpose: "Không được suy ra song song từ hai góc bằng nhau bất kỳ.",
  },
  {
    id: "l9-valid-condition-pass",
    stepId: "l9a1-step1",
    expected: "PASS",
    input: "Chưa đủ điều kiện vì chưa xác định vị trí hai góc và chưa biết chúng có do cùng một đường cắt tạo ra hay không.",
    purpose: "Nhận ra thiếu điều kiện vị trí phải PASS.",
  },
  {
    id: "l9-converse-missing-condition",
    stepId: "l9a2-step3",
    expected: "FAIL",
    input: "Hai góc bằng nhau nên a//b.",
    purpose: "Chiều đảo thiếu loại góc và đường cắt phải FAIL.",
  },
  {
    id: "l9-converse-corrected-pass",
    stepId: "l9a2-step3",
    expected: "PASS",
    input: "Lập luận ban đầu thiếu điều kiện. Nếu hai góc đó là một cặp so le trong bằng nhau trên cùng một đường cắt thì a//b.",
    purpose: "Sửa đúng chiều đảo với đủ điều kiện phải PASS.",
  },
  {
    id: "l9-multistep-answer-only",
    stepId: "l9a3-step3",
    expected: "FAIL",
    input: "a//b.",
    purpose: "Kết luận song song không có chuỗi góc phải FAIL.",
  },
  {
    id: "l9-multistep-proof-pass",
    stepId: "l9a3-step3",
    expected: "PASS",
    input: "180°-115°=65°. Hai góc đồng vị trên cùng đường cắt đều bằng 65°, theo dấu hiệu nhận biết nên a//b.",
    purpose: "Chuỗi kề bù → đồng vị → song song phải PASS.",
  },

  {
    id: "l10-euclid-answer-only",
    stepId: "l10a1-step3",
    expected: "FAIL",
    input: "b=c.",
    purpose: "Kết luận trùng nhau mà không viện dẫn tính duy nhất phải FAIL.",
  },
  {
    id: "l10-euclid-uniqueness-pass",
    stepId: "l10a1-step3",
    expected: "PASS",
    input: "b=c vì qua M chỉ có một đường thẳng song song với a; nếu b khác c thì trái tính duy nhất của tiên đề Euclid.",
    purpose: "Suy luận đúng từ tính duy nhất phải PASS.",
  },
  {
    id: "l10-directionality-trap",
    stepId: "l10a2-step2",
    expected: "FAIL",
    input: "Hai góc so le trong bằng nhau nên a//b.",
    purpose: "Dùng lại chiều Bài 9 khi a//b đã là GIVEN phải FAIL.",
  },
  {
    id: "l10-directionality-pass",
    stepId: "l10a2-step2",
    expected: "PASS",
    input: "Lời giải bị đảo chiều và chứng minh lại điều đã cho: a//b đã là GIVEN, ở đây phải dùng tính chất song song để suy ra quan hệ góc.",
    purpose: "Nhận đúng lỗi chiều suy luận phải PASS.",
  },
  {
    id: "l10-perpendicular-shortcut-trap",
    stepId: "l10a3-step2",
    expected: "FAIL",
    input: "a//b nên d cũng vuông góc với b, góc là 90°.",
    purpose: "Kết luận đúng nhưng bỏ qua quan hệ góc trung gian phải FAIL.",
  },
  {
    id: "l10-perpendicular-property-pass",
    stepId: "l10a3-step2",
    expected: "PASS",
    input: "Vì a//b, d là đường cắt và hai góc đồng vị bằng nhau; góc tại a bằng 90° nên góc tương ứng tại b cũng bằng 90°.",
    purpose: "Chuyển tính vuông góc qua tính chất góc phải PASS.",
  },

  { id:"l11-circular-proof-trap", stepId:"l11a1-step2", expected:"FAIL", input:"Vì hai góc đối đỉnh nên bằng nhau.", purpose:"Không dùng chính định lí đang chứng minh." },
  { id:"l11-proof-map-pass", stepId:"l11a1-step2", expected:"PASS", input:"Chọn góc trung gian kề bù với hai góc; hai tổng cùng bằng 180°.", purpose:"Bước trung gian độc lập phải PASS." },
  { id:"l11-circular-detection-pass", stepId:"l11a2-step2", expected:"PASS", input:"Câu Vì α=β dùng kết luận làm giả thiết nên là vòng tròn.", purpose:"Phát hiện circular reasoning." },
  { id:"l11-goal-only-trap", stepId:"l11a2-step3", expected:"FAIL", input:"α=β.", purpose:"Chỉ nêu GOAL phải FAIL." },
  { id:"l11-converse-auto-trap", stepId:"l11a3-step1", expected:"FAIL", input:"P⇒Q đúng nên Q⇒P cũng đúng.", purpose:"Tự ý đảo định lí phải FAIL." },
  { id:"l11-converse-counterexample-pass", stepId:"l11a3-step2", expected:"PASS", input:"n chia hết cho 4 thì chia hết cho 2; nhưng 6 chia hết cho 2 mà không chia hết cho 4.", purpose:"Phản ví dụ hợp lệ phải PASS." },
  { id:"coverage-l1a1-step2-empty", stepId:"l1a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a1-step2." },
  { id:"coverage-l1a2-step1-empty", stepId:"l1a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a2-step1." },
  { id:"coverage-l1a2-step2-empty", stepId:"l1a2-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a2-step2." },
  { id:"coverage-l1a2-step3-empty", stepId:"l1a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a2-step3." },
  { id:"coverage-l1a3-step1-empty", stepId:"l1a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a3-step1." },
  { id:"coverage-l1a3-step2-empty", stepId:"l1a3-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a3-step2." },
  { id:"coverage-l1a3-step3-empty", stepId:"l1a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l1a3-step3." },
  { id:"coverage-l10a1-step1-empty", stepId:"l10a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a1-step1." },
  { id:"coverage-l10a1-step2-empty", stepId:"l10a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a1-step2." },
  { id:"coverage-l10a2-step1-empty", stepId:"l10a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a2-step1." },
  { id:"coverage-l10a2-step3-empty", stepId:"l10a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a2-step3." },
  { id:"coverage-l10a3-step1-empty", stepId:"l10a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a3-step1." },
  { id:"coverage-l10a3-step3-empty", stepId:"l10a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l10a3-step3." },
  { id:"coverage-l11a1-step1-empty", stepId:"l11a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l11a1-step1." },
  { id:"coverage-l11a1-step3-empty", stepId:"l11a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l11a1-step3." },
  { id:"coverage-l11a2-step1-empty", stepId:"l11a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l11a2-step1." },
  { id:"coverage-l11a3-step3-empty", stepId:"l11a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l11a3-step3." },
  { id:"coverage-l2a1-step1-empty", stepId:"l2a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a1-step1." },
  { id:"coverage-l2a1-step2-empty", stepId:"l2a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a1-step2." },
  { id:"coverage-l2a1-step3-empty", stepId:"l2a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a1-step3." },
  { id:"coverage-l2a2-step1-empty", stepId:"l2a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a2-step1." },
  { id:"coverage-l2a2-step3-empty", stepId:"l2a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a2-step3." },
  { id:"coverage-l2a3-step1-empty", stepId:"l2a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a3-step1." },
  { id:"coverage-l2a3-step2-empty", stepId:"l2a3-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a3-step2." },
  { id:"coverage-l2a3-step3-empty", stepId:"l2a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l2a3-step3." },
  { id:"coverage-l3a1-step1-empty", stepId:"l3a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a1-step1." },
  { id:"coverage-l3a1-step2-empty", stepId:"l3a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a1-step2." },
  { id:"coverage-l3a1-step3-empty", stepId:"l3a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a1-step3." },
  { id:"coverage-l3a2-step1-empty", stepId:"l3a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a2-step1." },
  { id:"coverage-l3a2-step3-empty", stepId:"l3a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a2-step3." },
  { id:"coverage-l3a3-step1-empty", stepId:"l3a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a3-step1." },
  { id:"coverage-l3a3-step3-empty", stepId:"l3a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l3a3-step3." },
  { id:"coverage-l4a1-step1-empty", stepId:"l4a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a1-step1." },
  { id:"coverage-l4a1-step2-empty", stepId:"l4a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a1-step2." },
  { id:"coverage-l4a2-step1-empty", stepId:"l4a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a2-step1." },
  { id:"coverage-l4a2-step3-empty", stepId:"l4a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a2-step3." },
  { id:"coverage-l4a3-step1-empty", stepId:"l4a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a3-step1." },
  { id:"coverage-l4a3-step3-empty", stepId:"l4a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l4a3-step3." },
  { id:"coverage-l5a1-step1-empty", stepId:"l5a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a1-step1." },
  { id:"coverage-l5a1-step3-empty", stepId:"l5a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a1-step3." },
  { id:"coverage-l5a2-step1-empty", stepId:"l5a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a2-step1." },
  { id:"coverage-l5a2-step2-empty", stepId:"l5a2-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a2-step2." },
  { id:"coverage-l5a3-step1-empty", stepId:"l5a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a3-step1." },
  { id:"coverage-l5a3-step3-empty", stepId:"l5a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l5a3-step3." },
  { id:"coverage-l6a1-step1-empty", stepId:"l6a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a1-step1." },
  { id:"coverage-l6a1-step2-empty", stepId:"l6a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a1-step2." },
  { id:"coverage-l6a2-step1-empty", stepId:"l6a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a2-step1." },
  { id:"coverage-l6a2-step3-empty", stepId:"l6a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a2-step3." },
  { id:"coverage-l6a3-step1-empty", stepId:"l6a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a3-step1." },
  { id:"coverage-l6a3-step3-empty", stepId:"l6a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l6a3-step3." },
  { id:"coverage-l7a1-step1-empty", stepId:"l7a1-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a1-step1." },
  { id:"coverage-l7a1-step2-empty", stepId:"l7a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a1-step2." },
  { id:"coverage-l7a2-step1-empty", stepId:"l7a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a2-step1." },
  { id:"coverage-l7a2-step3-empty", stepId:"l7a2-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a2-step3." },
  { id:"coverage-l7a3-step1-empty", stepId:"l7a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a3-step1." },
  { id:"coverage-l7a3-step3-empty", stepId:"l7a3-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l7a3-step3." },
  { id:"coverage-l8a1-step2-empty", stepId:"l8a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a1-step2." },
  { id:"coverage-l8a1-step3-empty", stepId:"l8a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a1-step3." },
  { id:"coverage-l8a2-step1-empty", stepId:"l8a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a2-step1." },
  { id:"coverage-l8a2-step2-empty", stepId:"l8a2-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a2-step2." },
  { id:"coverage-l8a3-step1-empty", stepId:"l8a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a3-step1." },
  { id:"coverage-l8a3-step2-empty", stepId:"l8a3-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l8a3-step2." },
  { id:"coverage-l9a1-step2-empty", stepId:"l9a1-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a1-step2." },
  { id:"coverage-l9a1-step3-empty", stepId:"l9a1-step3", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a1-step3." },
  { id:"coverage-l9a2-step1-empty", stepId:"l9a2-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a2-step1." },
  { id:"coverage-l9a2-step2-empty", stepId:"l9a2-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a2-step2." },
  { id:"coverage-l9a3-step1-empty", stepId:"l9a3-step1", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a3-step1." },
  { id:"coverage-l9a3-step2-empty", stepId:"l9a3-step2", expected:"FAIL", input:"", purpose:"Direct adversarial coverage: câu trả lời rỗng phải FAIL ở l9a3-step2." },
  { id:"l8-proof-chain-correct-pass", stepId:"l8a2-step2", expected:"PASS", input:"∠mOy=α/2, ∠yOx'=180°-α, ∠x'On=α/2.", purpose:"Chuỗi góc đúng theo Om→Oy→Ox'→On phải PASS." },
  { id:"l8-proof-chain-old-wrong-fail", stepId:"l8a2-step2", expected:"FAIL", input:"∠mOy=α/2, ∠y'On=α/2, ∠yOy'=180°.", purpose:"Scaffold cũ không nhất quán phải FAIL." },
  { id:"l11-converse-negation-trap", stepId:"l11a3-step3", expected:"FAIL", input:"Không cần chứng minh; có định lí hay không cũng được vì chiều thuận đúng nên dùng chiều đảo.", purpose:"Keyword 'định lí' trong một phát biểu logic sai không được false PASS." },
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

  {
    lesson: 5,
    lessonTitle: "Làm quen với số thập phân vô hạn tuần hoàn",
    primaryModes: ["Phân tích cấu trúc", "Phản ví dụ", "Phân loại theo điều kiện", "Mô hình hóa sai số"],
  },

  {
    lesson: 6,
    lessonTitle: "Số vô tỉ. Căn bậc hai số học",
    primaryModes: ["Ước lượng bằng chặn", "Phân biệt khái niệm", "Lập luận theo định nghĩa", "Mô hình hóa hình học"],
  },

  {
    lesson: 7,
    lessonTitle: "Tập hợp các số thực",
    primaryModes: ["Suy luận theo định nghĩa số đối", "Định vị trên trục số", "So sánh bằng bình phương", "Mô hình hóa khoảng cách"],
  },

  {
    lesson: 8,
    lessonTitle: "Góc ở vị trí đặc biệt. Tia phân giác của một góc",
    primaryModes: ["Phản biện điều kiện hình học", "Chứng minh tổng quát bằng tham số", "Chuỗi suy luận góc", "Không suy diễn từ hình vẽ"],
  },

  {
    lesson: 9,
    lessonTitle: "Hai đường thẳng song song và dấu hiệu nhận biết",
    primaryModes: ["Kiểm tra điều kiện định lí", "Phân biệt chiều thuận/đảo", "Chống suy luận quá mức", "Chứng minh nhiều bước qua góc trung gian"],
  },

  {
    lesson: 10,
    lessonTitle: "Tiên đề Euclid. Tính chất của hai đường thẳng song song",
    primaryModes: ["Suy luận từ tiên đề", "Tính duy nhất", "Kiểm soát chiều suy luận", "Chuyển tính chất qua quan hệ góc"],
  },
  { lesson:11, lessonTitle:"Định lí và chứng minh định lí", primaryModes:["Tách GIVEN/GOAL","Lập bản đồ chứng minh","Phát hiện circular reasoning","Phản ví dụ và converse error"] },
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
