import type { LessonDefinition } from "@/types/lesson";

export const lesson9: LessonDefinition = {
  id: "lesson-player-09",
  knowledgeNodeId: "lesson-9-hai-duong-thang-song-song-dau-hieu",
  grade: 7,
  chapter: 3,
  lessonNumber: 9,
  title: "Hai đường thẳng song song và dấu hiệu nhận biết",
  subtitle: "Góc so le trong, góc đồng vị và dấu hiệu nhận biết hai đường thẳng song song",
  objectives: [
  "Nhận biết các cặp góc so le trong và đồng vị.",
  "Nêu được dấu hiệu nhận biết hai đường thẳng song song.",
  "Vận dụng dấu hiệu để kết luận hai đường thẳng song song."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 9",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết các cặp góc so le trong và đồng vị. • Nêu được dấu hiệu nhận biết hai đường thẳng song song. • Vận dụng dấu hiệu để kết luận hai đường thẳng song song.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Khi một đường thẳng cắt hai đường thẳng, ta xét các cặp góc so le trong và đồng vị. Nếu một cặp góc so le trong bằng nhau hoặc một cặp góc đồng vị bằng nhau thì có thể kết luận hai đường thẳng song song.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: đường thẳng c cắt a, b. Nếu một cặp góc so le trong cùng bằng 60° thì a ∥ b.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-09-q1",
        prompt: "Dấu hiệu nào đủ để kết luận a ∥ b khi c cắt a và b?",
        choices: [
            { id: "a", text: "Một cặp góc so le trong bằng nhau" },
            { id: "b", text: "Một cặp góc bất kì bằng nhau" },
            { id: "c", text: "Hai góc kề bù" },
            { id: "d", text: "Một góc nhọn" }
        ],
        correctChoiceId: "a",
        skillName: "Dấu hiệu song song",
        hint: "Hãy nhớ vị trí của cặp góc phải đặc biệt.",
        retryHint: "So le trong bằng nhau là một dấu hiệu nhận biết.",
        explanation: "Có một cặp góc so le trong bằng nhau thì a ∥ b.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-09-q2",
        prompt: "Nếu một cặp góc đồng vị bằng nhau thì hai đường thẳng bị cắt có quan hệ gì?",
        choices: [
            { id: "a", text: "Vuông góc" },
            { id: "b", text: "Song song" },
            { id: "c", text: "Trùng nhau chắc chắn" },
            { id: "d", text: "Không kết luận được" }
        ],
        correctChoiceId: "b",
        skillName: "Góc đồng vị",
        hint: "Đây là một dấu hiệu nhận biết song song.",
        retryHint: "Đồng vị bằng nhau → song song.",
        explanation: "Hai đường thẳng song song.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Khi kết luận song song, phải chỉ ra đúng cặp góc và đúng vị trí: so le trong hoặc đồng vị.",
      estimatedMinutes: 4,
    },
  ],
};
