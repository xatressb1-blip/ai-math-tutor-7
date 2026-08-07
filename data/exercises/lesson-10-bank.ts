import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson10AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a10-1",
    prompt: "Qua điểm ngoài một đường thẳng có mấy đường song song với nó?",
    choices: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "2" },
      { id: "d", text: "Vô số" }
    ],
    correctChoiceId: "b",
    skillName: "Tiên đề Euclid và tính chất song song",
    hint: "Tiên đề Euclid.",
    retryHint: "Duy nhất một.",
    explanation: "1.",
    difficulty: 1,
    tags: ["euclid"],
  },
  {
    id: "a10-2",
    prompt: "a∥b, đường c cắt chúng. Hai góc đồng vị?",
    choices: [
      { id: "a", text: "Bằng nhau" },
      { id: "b", text: "Bù nhau luôn" },
      { id: "c", text: "Phụ nhau" },
      { id: "d", text: "Không liên hệ" }
    ],
    correctChoiceId: "a",
    skillName: "Tiên đề Euclid và tính chất song song",
    hint: "Tính chất đường song song.",
    retryHint: "Đồng vị bằng nhau.",
    explanation: "Bằng nhau.",
    difficulty: 1,
    tags: ["dong-vi"],
  },
  {
    id: "a10-3",
    prompt: "a∥b và c⊥a. Khi đó c với b?",
    choices: [
      { id: "a", text: "Song song" },
      { id: "b", text: "Vuông góc" },
      { id: "c", text: "Trùng" },
      { id: "d", text: "Không biết" }
    ],
    correctChoiceId: "b",
    skillName: "Tiên đề Euclid và tính chất song song",
    hint: "Một đường vuông góc với một trong hai đường song song.",
    retryHint: "Nó cũng vuông góc với đường còn lại.",
    explanation: "c⊥b.",
    difficulty: 3,
    tags: ["vuong-goc"],
  }
];
