import type { AdaptiveExercise } from "@/types/adaptive-exercise";

export const lesson5AdaptiveExerciseBank: AdaptiveExercise[] = [
  {
    id: "a5-1",
    prompt: "Số nào có chu kì 45?",
    choices: [
      { id: "a", text: "0,(45)" },
      { id: "b", text: "0,45" },
      { id: "c", text: "4,5" },
      { id: "d", text: "0,4(5)" }
    ],
    correctChoiceId: "a",
    skillName: "Số thập phân tuần hoàn",
    hint: "Chu kì là nhóm trong ngoặc.",
    retryHint: "(45) lặp lại mãi.",
    explanation: "0,(45) có chu kì 45.",
    difficulty: 1,
    tags: ["chu-ki"],
  },
  {
    id: "a5-2",
    prompt: "Phân số tối giản có mẫu chỉ gồm thừa số 2 và 5 sẽ cho dạng thập phân nào?",
    choices: [
      { id: "a", text: "Hữu hạn" },
      { id: "b", text: "Vô hạn tuần hoàn" },
      { id: "c", text: "Vô tỉ" },
      { id: "d", text: "Không xác định" }
    ],
    correctChoiceId: "a",
    skillName: "Số thập phân tuần hoàn",
    hint: "Xét các ước nguyên tố của mẫu.",
    retryHint: "Không có ước nguyên tố ngoài 2 và 5.",
    explanation: "Dạng thập phân hữu hạn.",
    difficulty: 2,
    tags: ["phan-loai"],
  },
  {
    id: "a5-3",
    prompt: "Làm tròn 8,267 đến hàng phần trăm được?",
    choices: [
      { id: "a", text: "8,26" },
      { id: "b", text: "8,27" },
      { id: "c", text: "8,3" },
      { id: "d", text: "8,267" }
    ],
    correctChoiceId: "b",
    skillName: "Số thập phân tuần hoàn",
    hint: "Nhìn chữ số hàng phần nghìn.",
    retryHint: "7 ≥ 5 nên tăng hàng phần trăm.",
    explanation: "8,27.",
    difficulty: 2,
    tags: ["lam-tron"],
  }
];
