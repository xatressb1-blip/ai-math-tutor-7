import type { LessonDefinition } from "@/types/lesson";

export const lesson11: LessonDefinition = {
  id: "lesson-player-11",
  knowledgeNodeId: "lesson-11-dinh-li-chung-minh",
  grade: 7,
  chapter: 3,
  lessonNumber: 11,
  title: "Định lí và chứng minh định lí",
  subtitle: "GIVEN → GOAL → JUSTIFICATION → CONCLUSION",
  objectives: [
    "Nhận biết giả thiết và kết luận của một định lí.",
    "Phân biệt dữ kiện đã cho với điều cần chứng minh.",
    "Trình bày chuỗi suy luận có căn cứ, không dùng kết luận làm tiền đề.",
  ],
  estimatedMinutes: 34,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 11",
      content:
        "Chứng minh không phải đo hình hoặc đoán đúng đáp án. Mỗi bước phải xuất phát từ giả thiết hay kiến thức đã biết.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Tách GIVEN/GOAL, chọn căn cứ, lập luận từng bước và kết luận đúng.",
      estimatedMinutes: 2,
    },
    {
      id: "explain-gtkl",
      action: "EXPLAIN",
      title: "Giả thiết và kết luận",
      content:
        "Trong mệnh đề 'Nếu ... thì ...', phần sau 'nếu' là giả thiết (điều đã cho), phần sau 'thì' là kết luận (điều cần suy ra).",
      estimatedMinutes: 5,
    },
    {
      id: "question-gtkl",
      action: "QUESTION",
      title: "Checkpoint 1",
      content: "Tách GIVEN và GOAL.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-11-q1",
        prompt:
          "Trong định lí 'Nếu a ∥ b và c cắt a, b thì một cặp góc đồng vị bằng nhau', đâu là kết luận?",
        choices: [
          { id: "a", text: "Một cặp góc đồng vị bằng nhau" },
          { id: "b", text: "a ∥ b" },
          { id: "c", text: "c cắt a và b" },
          { id: "d", text: "a và b cùng vuông góc với c" },
        ],
        correctChoiceId: "a",
        skillName: "Giả thiết và kết luận",
        hint: "Tìm phần nằm sau từ 'thì'.",
        retryHint: "Kết luận là điều cần suy ra, không phải điều đã cho.",
        explanation: "Kết luận là: cặp góc đồng vị tương ứng bằng nhau.",
      },
    },
    {
      id: "explain-proof",
      action: "EXPLAIN",
      title: "Chuỗi chứng minh",
      content:
        "Một chứng minh tốt có bốn lớp: GIVEN (đã cho) → GOAL (cần chứng minh) → JUSTIFICATION (định nghĩa/tính chất/định lí dùng ở mỗi bước) → CONCLUSION.",
      estimatedMinutes: 6,
    },
    {
      id: "question-circular",
      action: "QUESTION",
      title: "Checkpoint 2",
      content: "Phát hiện lập luận vòng tròn.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-11-q2",
        prompt:
          "Cần chứng minh a ∥ b. Một bạn viết ngay 'Vì a ∥ b nên hai góc so le trong bằng nhau, suy ra a ∥ b'. Lỗi chính là gì?",
        choices: [
          { id: "a", text: "Đã dùng chính kết luận a ∥ b làm tiền đề" },
          { id: "b", text: "Chưa đo góc bằng thước đo góc" },
          { id: "c", text: "Không vẽ hình đủ lớn" },
          { id: "d", text: "Thiếu phép cộng số đo" },
        ],
        correctChoiceId: "a",
        skillName: "Phát hiện lập luận vòng tròn",
        hint: "So sánh điều cần chứng minh với điều bạn ấy dùng ở câu đầu.",
        retryHint: "Không được giả sử kết luận đã đúng để chứng minh chính kết luận đó.",
        explanation: "Đây là circular reasoning: dùng kết luận làm tiền đề.",
      },
    },
    {
      id: "question-justification",
      action: "QUESTION",
      title: "Checkpoint 3",
      content: "Kiểm tra căn cứ của bước suy luận.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-11-q3",
        prompt:
          "Trong một chứng minh, sau mỗi bước suy luận quan trọng ta cần chỉ ra điều gì?",
        choices: [
          { id: "a", text: "Định nghĩa, tính chất hoặc định lí làm căn cứ" },
          { id: "b", text: "Màu của hình vẽ" },
          { id: "c", text: "Ước lượng bằng mắt" },
          { id: "d", text: "Độ dài bài chứng minh" },
        ],
        correctChoiceId: "a",
        skillName: "Căn cứ của bước chứng minh",
        hint: "Một bước suy luận phải trả lời 'vì sao?'.",
        retryHint: "Hãy nêu kiến thức cho phép suy ra bước đó.",
        explanation:
          "Mỗi bước quan trọng phải có căn cứ từ giả thiết hoặc kiến thức đã biết.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content:
        "Chứng minh = GIVEN → GOAL → bước suy luận có JUSTIFICATION → CONCLUSION. Không tin hình vẽ, không dùng kết luận làm giả thiết.",
      estimatedMinutes: 2,
    },
  ],
};
