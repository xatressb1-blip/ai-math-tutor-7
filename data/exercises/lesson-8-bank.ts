import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson8AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a8-1",
    prompt: "Hai góc đối đỉnh có quan hệ?",
    choices: [
      { id: "a", text: "Bằng nhau" },
      { id: "b", text: "Bù nhau luôn" },
      { id: "c", text: "Phụ nhau" },
      { id: "d", text: "Không liên hệ" }
    ],
    correctChoiceId: "a",
    skillName: "Góc đặc biệt và tia phân giác",
    hint: "Nhớ tính chất góc đối đỉnh.",
    retryHint: "Hai góc đối đỉnh bằng nhau.",
    explanation: "Bằng nhau.",
    difficulty: 1,
    tags: ["doi-dinh"],
  },
  {
    id: "a8-2",
    prompt: "Hai góc kề bù: góc thứ nhất 110°. Góc còn lại?",
    choices: [
      { id: "a", text: "70°" },
      { id: "b", text: "80°" },
      { id: "c", text: "110°" },
      { id: "d", text: "250°" }
    ],
    correctChoiceId: "a",
    skillName: "Góc đặc biệt và tia phân giác",
    hint: "Tổng 180°.",
    retryHint: "180-110=70.",
    explanation: "70°.",
    difficulty: 2,
    tags: ["ke-bu"],
  },
  {
    id: "a8-3",
    prompt: "Tia Om phân giác góc 124°. Mỗi góc nhỏ?",
    choices: [
      { id: "a", text: "31°" },
      { id: "b", text: "62°" },
      { id: "c", text: "124°" },
      { id: "d", text: "248°" }
    ],
    correctChoiceId: "b",
    skillName: "Góc đặc biệt và tia phân giác",
    hint: "Chia đôi số đo góc.",
    retryHint: "124:2=62.",
    explanation: "62°.",
    difficulty: 2,
    tags: ["phan-giac"],
  }
];
