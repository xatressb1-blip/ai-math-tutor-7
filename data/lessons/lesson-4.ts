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
      id: "question-combined",
      action: "QUESTION",
      title: "Kiểm tra nhanh 3",
      content: "Kết hợp thứ tự phép tính và chuyển vế.",
      estimatedMinutes: 3,
      question: {
        id: "q4-3",
        prompt: "2x + 3 = 11. x bằng bao nhiêu?",
        choices: [
          { id: "a", text: "4" },
          { id: "b", text: "7" },
          { id: "c", text: "5" },
          { id: "d", text: "8" },
        ],
        correctChoiceId: "a",
        skillName: "Tìm x",
        hint: "Trước hết chuyển 3 sang vế phải.",
        retryHint: "2x = 11 - 3 = 8, sau đó chia hai vế cho 2.",
        explanation: "2x = 8 nên x = 4.",
        diagnostics: [
          {
            choiceId: "b",
            category: "PROCEDURE",
            label: "Chưa hoàn thành đủ hai bước tìm x",
            evidence: "Sau khi chuyển vế còn phải chia hệ số 2.",
            targetedHint: "Khi có 2x = 8, em cần làm thêm bước nào để còn x?",
          },
        ],
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
