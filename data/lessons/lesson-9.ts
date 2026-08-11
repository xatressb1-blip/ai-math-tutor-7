import type { LessonDefinition } from "@/types/lesson";

export const lesson9: LessonDefinition = {
  id: "lesson-player-09",
  knowledgeNodeId: "lesson-9-hai-duong-thang-song-song-dau-hieu",
  grade: 7,
  chapter: 3,
  lessonNumber: 9,
  title: "Hai đường thẳng song song và dấu hiệu nhận biết",
  subtitle: "Nhận diện đúng cặp góc trước khi kết luận song song",
  objectives: [
    "Nhận biết cặp góc so le trong và đồng vị khi một đường thẳng cắt hai đường thẳng.",
    "Nêu đúng dấu hiệu nhận biết hai đường thẳng song song.",
    "Phân biệt 'hai góc bằng nhau' với 'một cặp góc thích hợp bằng nhau'.",
  ],
  estimatedMinutes: 32,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 9",
      content:
        "Muốn kết luận hai đường thẳng song song, em phải nói rõ cặp góc nào, ở vị trí nào và chúng có quan hệ gì.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Nhận diện cặp góc → kiểm tra bằng nhau → gọi đúng dấu hiệu → kết luận song song.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Dấu hiệu nhận biết",
      content:
        "Khi một đường thẳng cắt hai đường thẳng, nếu một cặp góc so le trong bằng nhau hoặc một cặp góc đồng vị bằng nhau thì hai đường thẳng đó song song. Hai góc bằng nhau bất kì không đủ.",
      estimatedMinutes: 7,
    },
    {
      id: "question-identify",
      action: "QUESTION",
      title: "Checkpoint 1",
      content: "Kiểm tra loại cặp góc.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-09-q1",
        prompt:
          "Đường c cắt a và b. Hai góc được cho là bằng nhau nhưng đề không cho biết chúng là so le trong hay đồng vị. Có đủ căn cứ kết luận a ∥ b không?",
        choices: [
          { id: "a", text: "Chưa đủ; cần xác định đúng vị trí của cặp góc" },
          { id: "b", text: "Đủ; hai góc bằng nhau bất kì đều suy ra song song" },
          { id: "c", text: "Đủ nếu hai góc đều nhọn" },
          { id: "d", text: "Đủ nếu tổng hai góc nhỏ hơn 180°" },
        ],
        correctChoiceId: "a",
        skillName: "Điều kiện dấu hiệu song song",
        hint: "Dấu hiệu không dùng hai góc bất kì.",
        retryHint: "Cần là cặp so le trong hoặc đồng vị tương ứng.",
        explanation:
          "Chưa đủ. Phải xác định đúng vị trí cặp góc rồi mới dùng dấu hiệu.",
      },
    },
    {
      id: "question-slt",
      action: "QUESTION",
      title: "Checkpoint 2",
      content: "Dùng dấu hiệu so le trong.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-09-q2",
        prompt:
          "Đường c cắt a và b tạo một cặp góc so le trong cùng bằng 65°. Kết luận đúng là gì?",
        choices: [
          { id: "a", text: "a ∥ b" },
          { id: "b", text: "a ⟂ b" },
          { id: "c", text: "a trùng b" },
          { id: "d", text: "Không thể kết luận" },
        ],
        correctChoiceId: "a",
        skillName: "Dấu hiệu so le trong",
        hint: "Cặp góc đã đúng vị trí và bằng nhau.",
        retryHint: "So le trong bằng nhau là dấu hiệu nhận biết song song.",
        explanation: "Suy ra a ∥ b.",
      },
    },
    {
      id: "question-dongvi",
      action: "QUESTION",
      title: "Checkpoint 3",
      content: "Dùng dấu hiệu đồng vị.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-09-q3",
        prompt:
          "Đường c cắt a và b. Một cặp góc đồng vị cùng bằng 110°. Kết luận nào đúng?",
        choices: [
          { id: "a", text: "a ∥ b" },
          { id: "b", text: "a ⟂ b" },
          { id: "c", text: "Hai góc đó là đối đỉnh" },
          { id: "d", text: "Không có quan hệ nào" },
        ],
        correctChoiceId: "a",
        skillName: "Dấu hiệu đồng vị",
        hint: "Đồng vị bằng nhau là một dấu hiệu song song.",
        retryHint: "GIVEN: đồng vị bằng nhau. GOAL: quan hệ a và b.",
        explanation: "Suy ra a ∥ b.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content:
        "Chiều suy luận của Bài 9: cặp góc thích hợp bằng nhau → hai đường thẳng song song.",
      estimatedMinutes: 2,
    },
  ],
};
