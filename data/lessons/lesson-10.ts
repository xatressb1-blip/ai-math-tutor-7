import type { LessonDefinition } from "@/types/lesson";

export const lesson10: LessonDefinition = {
  id: "lesson-player-10",
  knowledgeNodeId: "lesson-10-tien-de-euclid-tinh-chat-song-song",
  grade: 7,
  chapter: 3,
  lessonNumber: 10,
  title: "Tiên đề Euclid. Tính chất của hai đường thẳng song song",
  subtitle: "Từ giả thiết song song suy ra quan hệ góc",
  objectives: [
    "Nhận biết nội dung tiên đề Euclid về đường thẳng song song.",
    "Dùng giả thiết hai đường thẳng song song để suy ra góc so le trong/đồng vị bằng nhau.",
    "Phân biệt tính chất ở Bài 10 với dấu hiệu nhận biết ở Bài 9.",
  ],
  estimatedMinutes: 32,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 10",
      content:
        "Bài 9 dùng góc để suy ra song song. Bài 10 đi theo chiều ngược lại: đã biết song song rồi suy ra quan hệ góc.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Nhận biết tiên đề Euclid; dùng đúng chiều song song → quan hệ góc.",
      estimatedMinutes: 2,
    },
    {
      id: "explain-euclid",
      action: "EXPLAIN",
      title: "Tiên đề Euclid",
      content:
        "Qua một điểm nằm ngoài một đường thẳng, chỉ có một đường thẳng đi qua điểm đó và song song với đường thẳng đã cho.",
      estimatedMinutes: 5,
    },
    {
      id: "question-euclid",
      action: "QUESTION",
      title: "Checkpoint 1",
      content: "Nhận biết nội dung tiên đề.",
      estimatedMinutes: 3,
      question: {
        id: "lesson-player-10-q1",
        prompt:
          "Qua điểm M nằm ngoài đường thẳng a có bao nhiêu đường thẳng đi qua M và song song với a?",
        choices: [
          { id: "a", text: "0" },
          { id: "b", text: "1" },
          { id: "c", text: "2" },
          { id: "d", text: "Vô số" },
        ],
        correctChoiceId: "b",
        skillName: "Tiên đề Euclid",
        hint: "Từ khóa quan trọng là 'duy nhất'.",
        retryHint: "Chỉ có một đường thẳng như vậy.",
        explanation: "Có duy nhất một đường thẳng.",
      },
    },
    {
      id: "explain-property",
      action: "EXPLAIN",
      title: "Tính chất hai đường thẳng song song",
      content:
        "Nếu một đường thẳng cắt hai đường thẳng song song thì các góc so le trong bằng nhau và các góc đồng vị bằng nhau.",
      estimatedMinutes: 6,
    },
    {
      id: "question-direction",
      action: "QUESTION",
      title: "Checkpoint 2",
      content: "Phân biệt chiều suy luận.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-10-q2",
        prompt:
          "Biết a ∥ b và c cắt a, b. Muốn suy ra hai góc đồng vị bằng nhau, ta đang dùng gì?",
        choices: [
          { id: "a", text: "Tính chất của hai đường thẳng song song" },
          { id: "b", text: "Dấu hiệu nhận biết hai đường thẳng song song" },
          { id: "c", text: "Định nghĩa góc đối đỉnh" },
          { id: "d", text: "Quy tắc chuyển vế" },
        ],
        correctChoiceId: "a",
        skillName: "Chiều suy luận song song → góc",
        hint: "Giả thiết đã cho a ∥ b.",
        retryHint: "Khi song song là GIVEN, ta dùng tính chất.",
        explanation:
          "Đây là tính chất: song song → các cặp góc thích hợp bằng nhau.",
      },
    },
    {
      id: "question-perpendicular",
      action: "QUESTION",
      title: "Checkpoint 3",
      content: "Vận dụng hệ quả.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-10-q3",
        prompt: "Biết a ∥ b và c ⟂ a. Kết luận nào đúng?",
        choices: [
          { id: "a", text: "c ⟂ b" },
          { id: "b", text: "c ∥ b" },
          { id: "c", text: "a ⟂ b" },
          { id: "d", text: "Không thể kết luận" },
        ],
        correctChoiceId: "a",
        skillName: "Vuông góc với hai đường song song",
        hint: "Góc c tạo với a là 90°.",
        retryHint: "Dùng tính chất góc tương ứng khi a ∥ b.",
        explanation: "c cũng vuông góc với b.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content:
        "Bài 9: góc thích hợp bằng nhau → song song. Bài 10: song song → góc thích hợp bằng nhau. Không đảo chiều nếu chưa có căn cứ.",
      estimatedMinutes: 2,
    },
  ],
};
