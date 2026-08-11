import type { LessonDefinition } from "@/types/lesson";

export const lesson4: LessonDefinition = {
  id: "lesson-player-04",
  knowledgeNodeId: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
  grade: 7,
  chapter: 1,
  lessonNumber: 4,
  title: "Thứ tự thực hiện các phép tính. Quy tắc chuyển vế",
  subtitle: "Thực hiện biểu thức đúng thứ tự và tìm x bằng quy tắc chuyển vế",
  objectives: [
    "Thực hiện đúng thứ tự các phép tính.",
    "Xử lí đúng biểu thức có dấu ngoặc.",
    "Sử dụng được quy tắc chuyển vế trong bài toán tìm x.",
  ],
  estimatedMinutes: 22,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 4",
      content:
        "Bài này tập trung vào hai thói quen rất quan trọng: làm phép tính đúng thứ tự và đổi dấu đúng khi chuyển vế.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Em cần biết khi nào làm lũy thừa, nhân chia, cộng trừ; đồng thời biết chuyển một số hạng sang vế kia và đổi dấu.",
      estimatedMinutes: 1,
    },
    {
      id: "explain-order",
      action: "EXPLAIN",
      title: "Thứ tự thực hiện phép tính",
      content:
        "Nếu không có dấu ngoặc: lũy thừa trước, rồi nhân và chia, cuối cùng cộng và trừ. Nếu có dấu ngoặc thì thực hiện trong ngoặc trước.",
      estimatedMinutes: 4,
    },
    {
      id: "question-order",
      action: "QUESTION",
      title: "Kiểm tra nhanh 1",
      content: "Chọn kết quả đúng.",
      estimatedMinutes: 2,
      question: {
        id: "q4-1",
        prompt: "2 + 3 × 4 bằng bao nhiêu?",
        choices: [
          { id: "a", text: "14" },
          { id: "b", text: "20" },
          { id: "c", text: "24" },
          { id: "d", text: "9" },
        ],
        correctChoiceId: "a",
        skillName: "Thứ tự phép tính",
        hint: "Nhân trước rồi mới cộng.",
        retryHint: "3 × 4 = 12, sau đó mới cộng 2.",
        explanation: "2 + 3 × 4 = 2 + 12 = 14.",
        diagnostics: [
          {
            choiceId: "b",
            category: "ORDER_OF_OPERATIONS",
            label: "Đang cộng trước nhân",
            evidence: "Phép nhân phải được thực hiện trước phép cộng.",
            targetedHint: "Đừng tính 2 + 3 trước.",
          },
        ],
      },
    },
    {
      id: "explain-transposition",
      action: "EXPLAIN",
      title: "Quy tắc chuyển vế",
      content:
        "Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, phải đổi dấu số hạng đó: dấu cộng thành dấu trừ và dấu trừ thành dấu cộng.",
      estimatedMinutes: 4,
    },
    {
      id: "question-transposition",
      action: "QUESTION",
      title: "Kiểm tra nhanh 2",
      content: "Tìm x.",
      estimatedMinutes: 2,
      question: {
        id: "q4-2",
        prompt: "x + 5 = 12. Giá trị của x là bao nhiêu?",
        choices: [
          { id: "a", text: "7" },
          { id: "b", text: "17" },
          { id: "c", text: "-7" },
          { id: "d", text: "-17" },
        ],
        correctChoiceId: "a",
        skillName: "Quy tắc chuyển vế",
        hint: "Chuyển +5 sang vế phải thì đổi thành -5.",
        retryHint: "x = 12 - 5.",
        explanation: "x = 12 - 5 = 7.",
        diagnostics: [
          {
            choiceId: "b",
            category: "SIGN",
            label: "Chuyển vế nhưng chưa đổi dấu",
            evidence: "+5 phải trở thành -5 khi chuyển sang vế phải.",
            targetedHint: "Mỗi lần chuyển vế, em dừng lại kiểm tra dấu.",
          },
        ],
      },
    },
    {
      id: "question-transposition-fraction",
      action: "QUESTION",
      title: "Kiểm tra nhanh 3",
      content: "Chuyển vế với số hữu tỉ.",
      estimatedMinutes: 3,
      question: {
        id: "q4-3",
        prompt: "x - 3/4 = 1/2. x bằng bao nhiêu?",
        choices: [
          { id: "a", text: "5/4" },
          { id: "b", text: "-1/4" },
          { id: "c", text: "1/4" },
          { id: "d", text: "-5/4" },
        ],
        correctChoiceId: "a",
        skillName: "Quy tắc chuyển vế",
        hint: "Chuyển -3/4 sang vế phải thì đổi thành +3/4.",
        retryHint: "x = 1/2 + 3/4.",
        explanation: "x = 2/4 + 3/4 = 5/4.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Tổng kết",
      content:
        "Em đã luyện quy tắc ưu tiên phép tính và nguyên tắc đổi dấu khi chuyển vế. Hai lỗi cần tránh nhất là cộng trước nhân và chuyển vế không đổi dấu.",
      estimatedMinutes: 1,
    },
  ],
};
