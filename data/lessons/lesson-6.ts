import type { LessonDefinition } from "@/types/lesson";

export const lesson6: LessonDefinition = {
  id: "lesson-player-06",
  knowledgeNodeId: "lesson-6-so-vo-ti-can-bac-hai",
  grade: 7,
  chapter: 2,
  lessonNumber: 6,
  title: "Số vô tỉ. Căn bậc hai số học",
  subtitle: "Nhận biết số vô tỉ và hiểu căn bậc hai số học là số không âm",
  objectives: [
  "Nhận biết số vô tỉ.",
  "Hiểu căn bậc hai số học.",
  "Tính và ước lượng căn bậc hai trong trường hợp phù hợp."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 6",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết số vô tỉ. • Hiểu căn bậc hai số học. • Tính và ước lượng căn bậc hai trong trường hợp phù hợp.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Số vô tỉ có biểu diễn thập phân vô hạn không tuần hoàn. Căn bậc hai số học của a ≥ 0 là số không âm x sao cho x² = a; vì vậy √9 = 3, không phải ±3.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: √49 = 7 vì 7 ≥ 0 và 7² = 49. Số √2 là số vô tỉ.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-06-q1",
        prompt: "Khẳng định nào đúng?",
        choices: [
            { id: "a", text: "√9 = ±3" },
            { id: "b", text: "√9 = 3" },
            { id: "c", text: "√9 = -3" },
            { id: "d", text: "√(-9)=3" }
        ],
        correctChoiceId: "b",
        skillName: "Căn bậc hai số học",
        hint: "Căn bậc hai số học luôn không âm.",
        retryHint: "Phân biệt 'các căn bậc hai của 9' với kí hiệu √9.",
        explanation: "√9 = 3.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-06-q2",
        prompt: "Số nào sau đây là số vô tỉ?",
        choices: [
            { id: "a", text: "0,25" },
            { id: "b", text: "2/3" },
            { id: "c", text: "√2" },
            { id: "d", text: "0,(3)" }
        ],
        correctChoiceId: "c",
        skillName: "Nhận biết số vô tỉ",
        hint: "Số hữu tỉ có thập phân hữu hạn hoặc tuần hoàn.",
        retryHint: "√2 không thể viết thành phân số của hai số nguyên.",
        explanation: "√2 là số vô tỉ.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Kiểm tra hai điều trước khi dùng dấu căn: số dưới căn phải không âm và kết quả √a phải không âm.",
      estimatedMinutes: 4,
    },
  ],
};
