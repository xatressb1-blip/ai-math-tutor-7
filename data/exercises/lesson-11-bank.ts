import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson11AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a11-1",
    prompt: "Phần sau từ 'nếu' trước 'thì' gọi là?",
    choices: [
      { id: "a", text: "Giả thiết" },
      { id: "b", text: "Kết luận" },
      { id: "c", text: "Chứng minh" },
      { id: "d", text: "Định nghĩa" }
    ],
    correctChoiceId: "a",
    skillName: "Định lí và chứng minh",
    hint: "Cấu trúc Nếu... thì...",
    retryHint: "Điều đã cho là giả thiết.",
    explanation: "Giả thiết.",
    difficulty: 1,
    tags: ["gt-kl"],
  },
  {
    id: "a11-2",
    prompt: "Phần sau từ 'thì' gọi là?",
    choices: [
      { id: "a", text: "Giả thiết" },
      { id: "b", text: "Kết luận" },
      { id: "c", text: "Tiên đề" },
      { id: "d", text: "Hình vẽ" }
    ],
    correctChoiceId: "b",
    skillName: "Định lí và chứng minh",
    hint: "Đó là điều cần suy ra.",
    retryHint: "Điều cần chứng minh là kết luận.",
    explanation: "Kết luận.",
    difficulty: 1,
    tags: ["gt-kl"],
  },
  {
    id: "a11-3",
    prompt: "Chứng minh định lí cần dựa chủ yếu vào?",
    choices: [
      { id: "a", text: "Đo hình" },
      { id: "b", text: "Lập luận từ kiến thức đã biết" },
      { id: "c", text: "Đoán" },
      { id: "d", text: "Thử nhiều số" }
    ],
    correctChoiceId: "b",
    skillName: "Định lí và chứng minh",
    hint: "Chứng minh là suy luận.",
    retryHint: "Dùng định nghĩa, tính chất, định lí đã biết.",
    explanation: "Lập luận hợp lệ.",
    difficulty: 2,
    tags: ["chung-minh"],
  }
];
