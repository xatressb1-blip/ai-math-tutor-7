import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson6AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a6-1",
    prompt: "√64 bằng?",
    choices: [
      { id: "a", text: "-8" },
      { id: "b", text: "8" },
      { id: "c", text: "±8" },
      { id: "d", text: "32" }
    ],
    correctChoiceId: "b",
    skillName: "Căn bậc hai số học",
    hint: "Kết quả √a không âm.",
    retryHint: "8²=64.",
    explanation: "√64=8.",
    difficulty: 1,
    tags: ["can-bac-hai"],
  },
  {
    id: "a6-2",
    prompt: "Số nào vô tỉ?",
    choices: [
      { id: "a", text: "√3" },
      { id: "b", text: "0,75" },
      { id: "c", text: "2/5" },
      { id: "d", text: "0,(6)" }
    ],
    correctChoiceId: "a",
    skillName: "Căn bậc hai số học",
    hint: "Hữu tỉ có thập phân hữu hạn hoặc tuần hoàn.",
    retryHint: "√3 không phải căn của số chính phương.",
    explanation: "√3 vô tỉ.",
    difficulty: 2,
    tags: ["vo-ti"],
  },
  {
    id: "a6-3",
    prompt: "Nếu √x = 7 thì x bằng?",
    choices: [
      { id: "a", text: "7" },
      { id: "b", text: "14" },
      { id: "c", text: "49" },
      { id: "d", text: "±49" }
    ],
    correctChoiceId: "c",
    skillName: "Căn bậc hai số học",
    hint: "Bình phương hai vế.",
    retryHint: "7²=49.",
    explanation: "x=49.",
    difficulty: 2,
    tags: ["tim-x"],
  }
];
