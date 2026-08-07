import type { LessonDefinition } from "@/types/lesson";

export const lesson11: LessonDefinition = {
  id: "lesson-player-11",
  knowledgeNodeId: "lesson-11-dinh-li-chung-minh",
  grade: 7,
  chapter: 3,
  lessonNumber: 11,
  title: "Định lí và chứng minh định lí",
  subtitle: "Giả thiết, kết luận và các bước lập luận chứng minh một định lí đơn giản",
  objectives: [
  "Nhận biết giả thiết và kết luận của một định lí.",
  "Viết giả thiết, kết luận bằng kí hiệu.",
  "Trình bày chứng minh một định lí đơn giản."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 11",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết giả thiết và kết luận của một định lí. • Viết giả thiết, kết luận bằng kí hiệu. • Trình bày chứng minh một định lí đơn giản.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Định lí là một khẳng định được suy ra từ những khẳng định đúng đã biết. Trong phát biểu 'Nếu ... thì ...', phần sau 'nếu' là giả thiết và phần sau 'thì' là kết luận. Chứng minh là chuỗi lập luận từ giả thiết đến kết luận.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc đồng vị bằng nhau'. Giả thiết: hai đường thẳng song song và có đường cắt; kết luận: cặp góc đồng vị bằng nhau.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-11-q1",
        prompt: "Trong câu 'Nếu a ∥ b thì hai góc so le trong bằng nhau', phần 'a ∥ b' là gì?",
        choices: [
            { id: "a", text: "Kết luận" },
            { id: "b", text: "Giả thiết" },
            { id: "c", text: "Chứng minh" },
            { id: "d", text: "Phản ví dụ" }
        ],
        correctChoiceId: "b",
        skillName: "Giả thiết và kết luận",
        hint: "Phần nằm sau từ 'Nếu' và trước 'thì'.",
        retryHint: "Đó là điều đã cho.",
        explanation: "a ∥ b là giả thiết.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-11-q2",
        prompt: "Mục tiêu của chứng minh định lí là gì?",
        choices: [
            { id: "a", text: "Đo lại hình thật chính xác" },
            { id: "b", text: "Suy luận từ giả thiết đến kết luận" },
            { id: "c", text: "Đoán kết quả" },
            { id: "d", text: "Chỉ vẽ hình" }
        ],
        correctChoiceId: "b",
        skillName: "Chứng minh định lí",
        hint: "Chứng minh không dựa vào đo hình.",
        retryHint: "Cần chuỗi lí lẽ hợp lệ.",
        explanation: "Suy luận từ giả thiết đến kết luận.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Một bài chứng minh tốt luôn trả lời ba câu: Đã cho gì? Cần chứng minh gì? Mỗi bước suy ra dựa vào tính chất nào?",
      estimatedMinutes: 4,
    },
  ],
};
