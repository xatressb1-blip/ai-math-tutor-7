import type { LessonDefinition } from "@/types/lesson";

export const lesson8: LessonDefinition = {
  id: "lesson-player-08",
  knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
  grade: 7,
  chapter: 3,
  lessonNumber: 8,
  title: "Góc ở vị trí đặc biệt. Tia phân giác của một góc",
  subtitle: "Nhận diện đúng cấu trúc: kề bù, đối đỉnh và tia phân giác",
  objectives: [
    "Nhận biết đúng hai góc kề bù từ vị trí các cạnh, không chỉ từ tổng 180°.",
    "Nhận biết và sử dụng tính chất hai góc đối đỉnh.",
    "Nhận biết tia phân giác bằng đủ hai điều kiện: nằm trong góc và tạo hai góc bằng nhau.",
  ],
  estimatedMinutes: 32,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 8",
      content:
        "Trong hình học, hình vẽ chỉ giúp quan sát. Em cần gọi đúng quan hệ từ giả thiết rồi mới dùng tính chất.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content:
        "Phân biệt kề bù – đối đỉnh – tia phân giác; dùng đúng điều kiện của từng khái niệm.",
      estimatedMinutes: 2,
    },
    {
      id: "explain-ke-bu",
      action: "EXPLAIN",
      title: "Hai góc kề bù",
      content:
        "Hai góc kề bù phải vừa kề nhau, vừa có hai cạnh còn lại là hai tia đối nhau. Khi đó tổng số đo hai góc bằng 180°. Chỉ biết tổng 180° chưa đủ để kết luận hai góc kề bù.",
      estimatedMinutes: 6,
    },
    {
      id: "question-ke-bu-structure",
      action: "QUESTION",
      title: "Checkpoint 1",
      content: "Kiểm tra điều kiện cấu trúc.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-08-q1",
        prompt:
          "Hai góc AOB và COD có tổng 180° nhưng không chung cạnh. Có thể kết luận chúng là hai góc kề bù không?",
        choices: [
          { id: "a", text: "Không, vì còn thiếu điều kiện kề nhau" },
          { id: "b", text: "Có, chỉ cần tổng bằng 180°" },
          { id: "c", text: "Có, nếu cả hai góc đều nhọn" },
          { id: "d", text: "Luôn là hai góc đối đỉnh" },
        ],
        correctChoiceId: "a",
        skillName: "Nhận diện góc kề bù",
        hint: "Tên gọi 'kề bù' có hai phần: kề và bù.",
        retryHint: "Tổng 180° chỉ cho biết bù; còn phải kiểm tra hai góc có kề nhau không.",
        explanation:
          "Không. Hai góc kề bù phải kề nhau và hai cạnh còn lại là hai tia đối nhau.",
      },
    },
    {
      id: "explain-opposite",
      action: "EXPLAIN",
      title: "Hai góc đối đỉnh",
      content:
        "Khi hai đường thẳng cắt nhau, hai góc có mỗi cạnh của góc này là tia đối của một cạnh góc kia là hai góc đối đỉnh. Hai góc đối đỉnh bằng nhau.",
      estimatedMinutes: 5,
    },
    {
      id: "question-opposite",
      action: "QUESTION",
      title: "Checkpoint 2",
      content: "Dùng đúng tính chất đối đỉnh.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-08-q2",
        prompt:
          "Hai đường thẳng xy và zt cắt nhau tại O. Nếu ∠xOz = 68° thì góc đối đỉnh với ∠xOz bằng bao nhiêu?",
        choices: [
          { id: "a", text: "68°" },
          { id: "b", text: "112°" },
          { id: "c", text: "34°" },
          { id: "d", text: "180°" },
        ],
        correctChoiceId: "a",
        skillName: "Tính chất góc đối đỉnh",
        hint: "Hai góc đối đỉnh có số đo bằng nhau.",
        retryHint: "Không cần lấy 180° trừ; góc đối đỉnh giữ nguyên số đo.",
        explanation: "Góc đối đỉnh với ∠xOz bằng 68°.",
      },
    },
    {
      id: "explain-bisector",
      action: "EXPLAIN",
      title: "Tia phân giác",
      content:
        "Tia phân giác phải nằm bên trong góc và chia góc thành hai góc có số đo bằng nhau.",
      estimatedMinutes: 5,
    },
    {
      id: "question-bisector-condition",
      action: "QUESTION",
      title: "Checkpoint 3",
      content: "Kiểm tra đủ điều kiện.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-08-q3",
        prompt:
          "Tia Om nằm ngoài góc xOy nhưng ∠xOm = ∠mOy. Có thể kết luận Om là tia phân giác của ∠xOy không?",
        choices: [
          { id: "a", text: "Không, vì Om phải nằm trong góc xOy" },
          { id: "b", text: "Có, chỉ cần hai góc bằng nhau" },
          { id: "c", text: "Có, nếu tổng hai góc bằng 180°" },
          { id: "d", text: "Không thể xác định vì thiếu số đo" },
        ],
        correctChoiceId: "a",
        skillName: "Điều kiện tia phân giác",
        hint: "Định nghĩa không chỉ nói về số đo.",
        retryHint: "Kiểm tra vị trí của tia Om trước.",
        explanation:
          "Không. Tia phân giác phải nằm trong góc và tạo hai góc bằng nhau.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content:
        "Kề bù: kề nhau + hai cạnh còn lại đối nhau. Đối đỉnh: sinh bởi hai đường cắt nhau. Phân giác: nằm trong góc + chia thành hai góc bằng nhau.",
      estimatedMinutes: 2,
    },
  ],
};
