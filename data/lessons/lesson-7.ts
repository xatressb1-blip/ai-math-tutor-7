import type { LessonDefinition } from "@/types/lesson";

export const lesson7: LessonDefinition = {
  id: "lesson-player-07",
  knowledgeNodeId: "lesson-7-tap-hop-so-thuc",
  grade: 7,
  chapter: 2,
  lessonNumber: 7,
  title: "Tập hợp các số thực",
  subtitle: "Số thực, trục số thực, thứ tự và giá trị tuyệt đối",
  objectives: [
  "Nhận biết tập hợp số thực.",
  "So sánh số thực trong trường hợp phù hợp.",
  "Hiểu giá trị tuyệt đối là khoảng cách đến 0."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 7",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết tập hợp số thực. • So sánh số thực trong trường hợp phù hợp. • Hiểu giá trị tuyệt đối là khoảng cách đến 0.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Số hữu tỉ và số vô tỉ gọi chung là số thực, kí hiệu R. Mỗi số thực biểu diễn bởi một điểm trên trục số. Giá trị tuyệt đối |a| là khoảng cách từ điểm a đến 0 nên luôn không âm.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: -2,5 ∈ R, √2 ∈ R và |-3| = 3 vì khoảng cách từ -3 đến 0 bằng 3.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-07-q1",
        prompt: "Số nào sau đây thuộc R?",
        choices: [
            { id: "a", text: "Chỉ số hữu tỉ" },
            { id: "b", text: "Chỉ số vô tỉ" },
            { id: "c", text: "Cả số hữu tỉ và số vô tỉ" },
            { id: "d", text: "Không số nào" }
        ],
        correctChoiceId: "c",
        skillName: "Nhận biết số thực",
        hint: "R gồm cả Q và I.",
        retryHint: "Số hữu tỉ và vô tỉ đều là số thực.",
        explanation: "Cả hai nhóm đều thuộc R.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-07-q2",
        prompt: "|-5,2| bằng bao nhiêu?",
        choices: [
            { id: "a", text: "-5,2" },
            { id: "b", text: "5,2" },
            { id: "c", text: "0" },
            { id: "d", text: "10,4" }
        ],
        correctChoiceId: "b",
        skillName: "Giá trị tuyệt đối",
        hint: "Hãy nghĩ tới khoảng cách đến 0.",
        retryHint: "Khoảng cách không thể âm.",
        explanation: "|-5,2| = 5,2.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Số thực lấp đầy trục số. Khi gặp |a|, hãy nghĩ 'khoảng cách tới 0' trước khi nhớ công thức.",
      estimatedMinutes: 4,
    },
  ],
};
