import type { LessonDefinition } from "@/types/lesson";

export const lesson3: LessonDefinition = {
  id: "lesson-player-03",
  knowledgeNodeId: "lesson-3-luy-thua-so-huu-ti",
  grade: 7,
  chapter: 1,
  lessonNumber: 3,
  title: "Lũy thừa với số mũ tự nhiên của một số hữu tỉ",
  subtitle: "Tính lũy thừa và sử dụng các quy tắc cơ bản",
  objectives: [
    "Tính được lũy thừa của một số hữu tỉ.",
    "Vận dụng quy tắc nhân, chia hai lũy thừa cùng cơ số.",
    "Vận dụng quy tắc lũy thừa của một lũy thừa.",
  ],
  estimatedMinutes: 20,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 3",
      content:
        "Lũy thừa giúp viết gọn phép nhân lặp lại. Em sẽ học cách xử lí số mũ mà không bị nhầm giữa cộng và nhân số mũ.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Em cần hiểu ý nghĩa của lũy thừa và áp dụng đúng quy tắc số mũ trong ba tình huống cơ bản.",
      estimatedMinutes: 1,
    },
    {
      id: "explain-power",
      action: "EXPLAIN",
      title: "Ý nghĩa của lũy thừa",
      content:
        "a^n là tích của n thừa số bằng nhau, mỗi thừa số bằng a. Với cơ số âm, dấu của kết quả phụ thuộc vào số mũ chẵn hay lẻ.",
      estimatedMinutes: 3,
    },
    {
      id: "question-power",
      action: "QUESTION",
      title: "Kiểm tra nhanh 1",
      content: "Xác định dấu và giá trị.",
      estimatedMinutes: 2,
      question: {
        id: "q3-1",
        prompt: "(-2/3)^2 bằng bao nhiêu?",
        choices: [
          { id: "a", text: "4/9" },
          { id: "b", text: "-4/9" },
          { id: "c", text: "2/9" },
          { id: "d", text: "-2/9" },
        ],
        correctChoiceId: "a",
        skillName: "Tính lũy thừa",
        hint: "Số mũ 2 nghĩa là nhân (-2/3) với chính nó.",
        retryHint: "Âm nhân âm cho kết quả dương.",
        explanation: "(-2/3)^2 = (-2/3) × (-2/3) = 4/9.",
        diagnostics: [
          {
            choiceId: "b",
            category: "SIGN",
            label: "Đang giữ dấu âm với số mũ chẵn",
            evidence: "Tích của hai số âm là số dương.",
            targetedHint: "Viết lũy thừa thành phép nhân hai thừa số.",
          },
        ],
      },
    },
    {
      id: "explain-rules",
      action: "EXPLAIN",
      title: "Quy tắc số mũ",
      content:
        "Khi nhân hai lũy thừa cùng cơ số, cộng các số mũ. Khi chia hai lũy thừa cùng cơ số khác 0, trừ các số mũ. Khi nâng một lũy thừa lên lũy thừa, nhân các số mũ.",
      estimatedMinutes: 4,
    },
    {
      id: "question-multiply-powers",
      action: "QUESTION",
      title: "Kiểm tra nhanh 2",
      content: "Chọn quy tắc đúng.",
      estimatedMinutes: 2,
      question: {
        id: "q3-2",
        prompt: "2^3 × 2^4 bằng lũy thừa nào?",
        choices: [
          { id: "a", text: "2^7" },
          { id: "b", text: "2^12" },
          { id: "c", text: "4^7" },
          { id: "d", text: "2^1" },
        ],
        correctChoiceId: "a",
        skillName: "Nhân chia lũy thừa cùng cơ số",
        hint: "Cùng cơ số và đang nhân, em cần cộng số mũ.",
        retryHint: "3 + 4 = 7.",
        explanation: "2^3 × 2^4 = 2^(3+4) = 2^7.",
        diagnostics: [
          {
            choiceId: "b",
            category: "PROCEDURE",
            label: "Đang nhân số mũ thay vì cộng số mũ",
            evidence: "Quy tắc nhân lũy thừa cùng cơ số là cộng số mũ.",
            targetedHint: "Giữ nguyên cơ số 2 và tính 3 + 4.",
          },
        ],
      },
    },
    {
      id: "question-power-of-power",
      action: "QUESTION",
      title: "Kiểm tra nhanh 3",
      content: "Phân biệt với quy tắc vừa học.",
      estimatedMinutes: 2,
      question: {
        id: "q3-3",
        prompt: "(3^2)^4 bằng lũy thừa nào?",
        choices: [
          { id: "a", text: "3^8" },
          { id: "b", text: "3^6" },
          { id: "c", text: "3^2" },
          { id: "d", text: "12^2" },
        ],
        correctChoiceId: "a",
        skillName: "Lũy thừa của lũy thừa",
        hint: "Lũy thừa của một lũy thừa thì nhân hai số mũ.",
        retryHint: "2 × 4 = 8.",
        explanation: "(3^2)^4 = 3^(2×4) = 3^8.",
        diagnostics: [
          {
            choiceId: "b",
            category: "PROCEDURE",
            label: "Đang cộng số mũ trong tình huống phải nhân",
            evidence: "Lũy thừa của lũy thừa sử dụng tích các số mũ.",
            targetedHint: "Phân biệt: nhân cùng cơ số thì cộng; lũy thừa của lũy thừa thì nhân.",
          },
        ],
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Tổng kết",
      content:
        "Em đã phân biệt ba quy tắc quan trọng: nhân cùng cơ số thì cộng số mũ, chia thì trừ số mũ, còn lũy thừa của lũy thừa thì nhân số mũ.",
      estimatedMinutes: 1,
    },
  ],
};
