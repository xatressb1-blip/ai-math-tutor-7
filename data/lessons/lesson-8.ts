import type { LessonDefinition } from "@/types/lesson";

export const lesson8: LessonDefinition = {
  id: "lesson-player-08",
  knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
  grade: 7,
  chapter: 3,
  lessonNumber: 8,
  title: "Góc ở vị trí đặc biệt. Tia phân giác của một góc",
  subtitle: "Góc kề bù, góc đối đỉnh, hai đường thẳng vuông góc và tia phân giác",
  objectives: [
  "Nhận biết góc kề bù và góc đối đỉnh.",
  "Sử dụng tính chất hai góc đối đỉnh.",
  "Nhận biết và vận dụng tia phân giác của một góc."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 8",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết góc kề bù và góc đối đỉnh. • Sử dụng tính chất hai góc đối đỉnh. • Nhận biết và vận dụng tia phân giác của một góc.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Hai góc kề bù có tổng số đo 180°. Hai góc đối đỉnh thì bằng nhau. Tia phân giác của một góc nằm trong góc và tạo với hai cạnh của góc hai góc bằng nhau.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: nếu ∠xOz và ∠zOy kề bù, ∠xOz = 65° thì ∠zOy = 115°. Nếu Om là tia phân giác của góc 80° thì mỗi góc nhỏ bằng 40°.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-08-q1",
        prompt: "Hai góc kề bù có tổng số đo bằng bao nhiêu?",
        choices: [
            { id: "a", text: "90°" },
            { id: "b", text: "120°" },
            { id: "c", text: "180°" },
            { id: "d", text: "360°" }
        ],
        correctChoiceId: "c",
        skillName: "Góc kề bù",
        hint: "Hai cạnh còn lại là hai tia đối nhau.",
        retryHint: "Góc bẹt có số đo 180°.",
        explanation: "Hai góc kề bù có tổng 180°.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-08-q2",
        prompt: "Góc xOy = 70°, Om là tia phân giác. Góc xOm bằng?",
        choices: [
            { id: "a", text: "20°" },
            { id: "b", text: "35°" },
            { id: "c", text: "70°" },
            { id: "d", text: "140°" }
        ],
        correctChoiceId: "b",
        skillName: "Tia phân giác",
        hint: "Tia phân giác chia góc thành hai phần bằng nhau.",
        retryHint: "70 : 2 = 35.",
        explanation: "∠xOm = 35°.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Phân biệt ba ý: kề bù → tổng 180°; đối đỉnh → bằng nhau; phân giác → chia góc thành hai góc bằng nhau.",
      estimatedMinutes: 4,
    },
  ],
};
