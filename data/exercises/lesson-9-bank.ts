import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson9AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a9-1",
    prompt: "Một cặp góc so le trong bằng nhau suy ra?",
    choices: [
      { id: "a", text: "Hai đường thẳng song song" },
      { id: "b", text: "Hai đường thẳng vuông góc" },
      { id: "c", text: "Hai góc kề bù" },
      { id: "d", text: "Không kết luận" }
    ],
    correctChoiceId: "a",
    skillName: "Dấu hiệu hai đường thẳng song song",
    hint: "Đây là dấu hiệu nhận biết.",
    retryHint: "So le trong bằng nhau → song song.",
    explanation: "Hai đường thẳng song song.",
    difficulty: 1,
    tags: ["song-song"],
  },
  {
    id: "a9-2",
    prompt: "Một cặp góc đồng vị bằng nhau suy ra?",
    choices: [
      { id: "a", text: "Song song" },
      { id: "b", text: "Vuông góc" },
      { id: "c", text: "Trùng nhau" },
      { id: "d", text: "Bất kỳ" }
    ],
    correctChoiceId: "a",
    skillName: "Dấu hiệu hai đường thẳng song song",
    hint: "Đồng vị bằng nhau là dấu hiệu.",
    retryHint: "Đúng vị trí đồng vị.",
    explanation: "Song song.",
    difficulty: 2,
    tags: ["dong-vi"],
  },
  {
    id: "a9-3",
    prompt: "Để dùng dấu hiệu song song cần chú ý điều gì?",
    choices: [
      { id: "a", text: "Chỉ cần hai góc bằng nhau bất kì" },
      { id: "b", text: "Đúng vị trí góc" },
      { id: "c", text: "Hai góc đều nhọn" },
      { id: "d", text: "Hai góc cùng đỉnh" }
    ],
    correctChoiceId: "b",
    skillName: "Dấu hiệu hai đường thẳng song song",
    hint: "Vị trí góc quyết định.",
    retryHint: "Phải là so le trong hoặc đồng vị tương ứng.",
    explanation: "Đúng vị trí góc.",
    difficulty: 2,
    tags: ["nhan-biet"],
  }
];
