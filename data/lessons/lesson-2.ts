import type { LessonDefinition } from "@/types/lesson";

export const lesson2: LessonDefinition = {
  id: "lesson-player-02",
  knowledgeNodeId: "lesson-2-phep-tinh-so-huu-ti",
  grade: 7,
  chapter: 1,
  lessonNumber: 2,
  title: "Cộng, trừ, nhân, chia số hữu tỉ",
  subtitle: "Thực hiện phép tính đúng dấu và vận dụng tính chất để tính hợp lí",
  objectives: [
    "Cộng và trừ được hai số hữu tỉ.",
    "Nhân và chia được hai số hữu tỉ.",
    "Nhận biết lỗi sai dấu thường gặp trong phép tính.",
  ],
  estimatedMinutes: 22,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 2",
      content:
        "Hôm nay chúng ta luyện bốn phép tính với số hữu tỉ. Em hãy ưu tiên sự chính xác, đặc biệt là dấu âm.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Sau buổi học, em cần cộng, trừ, nhân, chia số hữu tỉ đúng quy tắc và biết tự kiểm tra dấu của kết quả.",
      estimatedMinutes: 1,
    },
    {
      id: "explain-add-subtract",
      action: "EXPLAIN",
      title: "Cộng và trừ số hữu tỉ",
      content:
        "Với phân số khác mẫu, trước hết quy đồng mẫu số. Phép trừ a - b có thể hiểu là a + (-b), nên khi trừ cần đặc biệt chú ý dấu.",
      estimatedMinutes: 4,
    },
    {
      id: "question-add",
      action: "QUESTION",
      title: "Kiểm tra nhanh 1",
      content: "Chọn kết quả đúng.",
      estimatedMinutes: 2,
      question: {
        id: "q2-1",
        prompt: "Kết quả của -1/2 + 3/4 bằng bao nhiêu?",
        choices: [
          { id: "a", text: "1/4" },
          { id: "b", text: "-1/4" },
          { id: "c", text: "5/4" },
          { id: "d", text: "-5/4" },
        ],
        correctChoiceId: "a",
        skillName: "Cộng trừ số hữu tỉ",
        hint: "Quy đồng -1/2 thành -2/4 rồi cộng tử số.",
        retryHint: "-2/4 + 3/4 có cùng mẫu số.",
        explanation: "-2/4 + 3/4 = 1/4.",
        diagnostics: [
          {
            choiceId: "b",
            category: "SIGN",
            label: "Có thể đang giữ dấu âm sau khi cộng hai tử số",
            evidence: "-2 + 3 = 1, không phải -1.",
            targetedHint: "Em tính riêng -2 + 3 trước khi giữ mẫu 4.",
          },
          {
            choiceId: "c",
            category: "PROCEDURE",
            label: "Có thể đang cộng độ lớn mà bỏ qua dấu",
            evidence: "Tử số thứ nhất là -2 sau khi quy đồng.",
            targetedHint: "Đừng biến -2 thành 2 khi cộng.",
          },
        ],
      },
    },
    {
      id: "explain-multiply-divide",
      action: "EXPLAIN",
      title: "Nhân và chia số hữu tỉ",
      content:
        "Nhân phân số: nhân tử với tử, mẫu với mẫu và rút gọn. Chia cho một số hữu tỉ khác 0 bằng cách nhân với số nghịch đảo của số chia.",
      estimatedMinutes: 4,
    },
    {
      id: "question-multiply",
      action: "QUESTION",
      title: "Kiểm tra nhanh 2",
      content: "Chọn kết quả đúng.",
      estimatedMinutes: 2,
      question: {
        id: "q2-2",
        prompt: "(-2/3) × (9/4) bằng bao nhiêu?",
        choices: [
          { id: "a", text: "-3/2" },
          { id: "b", text: "3/2" },
          { id: "c", text: "-18/7" },
          { id: "d", text: "18/12" },
        ],
        correctChoiceId: "a",
        skillName: "Nhân chia số hữu tỉ",
        hint: "Kết quả phải âm vì một thừa số âm và một thừa số dương.",
        retryHint: "Rút gọn 9 với 3 trước khi nhân.",
        explanation: "(-2/3) × (9/4) = -18/12 = -3/2.",
        diagnostics: [
          {
            choiceId: "b",
            category: "SIGN",
            label: "Đang bỏ qua quy tắc dấu khi nhân",
            evidence: "Âm nhân dương phải cho kết quả âm.",
            targetedHint: "Xác định dấu trước, sau đó mới tính phần số.",
          },
        ],
      },
    },
    {
      id: "question-divide",
      action: "QUESTION",
      title: "Kiểm tra nhanh 3",
      content: "Em nhớ đổi phép chia thành phép nhân.",
      estimatedMinutes: 2,
      question: {
        id: "q2-3",
        prompt: "3/5 : (-6/7) bằng bao nhiêu?",
        choices: [
          { id: "a", text: "-7/10" },
          { id: "b", text: "7/10" },
          { id: "c", text: "-18/35" },
          { id: "d", text: "18/35" },
        ],
        correctChoiceId: "a",
        skillName: "Nhân chia số hữu tỉ",
        hint: "Nhân 3/5 với nghịch đảo của -6/7.",
        retryHint: "Nghịch đảo của -6/7 là -7/6.",
        explanation: "3/5 × (-7/6) = -21/30 = -7/10.",
        diagnostics: [
          {
            choiceId: "c",
            category: "PROCEDURE",
            label: "Đang nhân trực tiếp thay vì nhân với nghịch đảo",
            evidence: "Phép chia phân số phải đổi số chia thành nghịch đảo.",
            targetedHint: "Hãy đảo -6/7 thành -7/6 trước.",
          },
        ],
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Tổng kết",
      content:
        "Em đã ôn quy đồng khi cộng trừ, quy tắc dấu khi nhân và cách đổi phép chia thành nhân với nghịch đảo.",
      estimatedMinutes: 1,
    },
  ],
};
