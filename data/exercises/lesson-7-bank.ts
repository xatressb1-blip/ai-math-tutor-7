import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson7AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a7-1",
    prompt: "Khẳng định đúng?",
    choices: [
      { id: "a", text: "√2 ∉ R" },
      { id: "b", text: "π ∈ R" },
      { id: "c", text: "1/2 ∉ R" },
      { id: "d", text: "0 ∈ I" }
    ],
    correctChoiceId: "b",
    skillName: "Số thực và giá trị tuyệt đối",
    hint: "R gồm hữu tỉ và vô tỉ.",
    retryHint: "π là số vô tỉ nên cũng là số thực.",
    explanation: "π ∈ R.",
    difficulty: 1,
    tags: ["tap-hop"],
  },
  {
    id: "a7-2",
    prompt: "|-7| bằng?",
    choices: [
      { id: "a", text: "-7" },
      { id: "b", text: "7" },
      { id: "c", text: "0" },
      { id: "d", text: "14" }
    ],
    correctChoiceId: "b",
    skillName: "Số thực và giá trị tuyệt đối",
    hint: "Giá trị tuyệt đối là khoảng cách đến 0.",
    retryHint: "Khoảng cách không âm.",
    explanation: "|-7|=7.",
    difficulty: 1,
    tags: ["gia-tri-tuyet-do"],
  },
  {
    id: "a7-3",
    prompt: "So sánh √5 và √7.",
    choices: [
      { id: "a", text: "√5>√7" },
      { id: "b", text: "√5=√7" },
      { id: "c", text: "√5<√7" },
      { id: "d", text: "Không so sánh được" }
    ],
    correctChoiceId: "c",
    skillName: "Số thực và giá trị tuyệt đối",
    hint: "Với số dương, số dưới căn lớn hơn thì căn lớn hơn.",
    retryHint: "5<7.",
    explanation: "√5<√7.",
    difficulty: 2,
    tags: ["so-sanh"],
  }
];
