import type { Chapter, KnowledgeNode } from "@/types/knowledge";

export const chapter1: Chapter = {
  id: "ch1-so-huu-ti",
  number: 1,
  title: "Số hữu tỉ",
  semester: 1,
  description:
    "Xây dựng nền tảng về số hữu tỉ, phép tính, lũy thừa và thứ tự thực hiện phép tính.",
  lessonIds: [
    "lesson-1-tap-hop-so-huu-ti",
    "lesson-2-phep-tinh-so-huu-ti",
    "lesson-3-luy-thua-so-huu-ti",
    "lesson-4-thu-tu-phep-tinh-chuyen-ve",
  ],
};

export const chapter1KnowledgeNodes: KnowledgeNode[] = [
  {
    id: "lesson-1-tap-hop-so-huu-ti",
    type: "LESSON",
    title: "Bài 1. Tập hợp các số hữu tỉ",
    description:
      "Nhận biết số hữu tỉ, biểu diễn trên trục số và so sánh các số hữu tỉ.",
    grade: 7,
    semester: 1,
    chapterId: chapter1.id,
    lessonNumber: 1,
    order: 1,
    difficulty: "FOUNDATION",
    prerequisites: ["Phân số", "Số nguyên", "Trục số"],
    learningObjectives: [
      "Nhận biết và biểu diễn được số hữu tỉ.",
      "Xác định được số đối của một số hữu tỉ.",
      "Biểu diễn số hữu tỉ trên trục số.",
      "So sánh được hai số hữu tỉ.",
    ],
    skills: [
      "Nhận biết số hữu tỉ",
      "Biểu diễn trên trục số",
      "So sánh số hữu tỉ",
    ],
    commonMistakes: [
      "Nhầm số hữu tỉ với số nguyên.",
      "Đặt sai vị trí số âm trên trục số.",
      "So sánh phân số khác mẫu không đúng.",
    ],
    sourceIds: ["src-sgk-kntt-t1", "src-hoc-tap-kntt"],
    status: "VERIFIED",
  },
  {
    id: "lesson-2-phep-tinh-so-huu-ti",
    type: "LESSON",
    title: "Bài 2. Cộng, trừ, nhân, chia số hữu tỉ",
    description:
      "Thực hiện các phép tính cơ bản với số hữu tỉ và vận dụng tính chất phép tính.",
    grade: 7,
    semester: 1,
    chapterId: chapter1.id,
    lessonNumber: 2,
    order: 2,
    difficulty: "BASIC",
    prerequisites: ["lesson-1-tap-hop-so-huu-ti", "Quy đồng phân số"],
    learningObjectives: [
      "Cộng và trừ được hai số hữu tỉ.",
      "Nhân và chia được hai số hữu tỉ.",
      "Vận dụng tính chất phép tính để tính hợp lí.",
      "Giải được bài toán thực tế đơn giản có phép tính số hữu tỉ.",
    ],
    skills: [
      "Cộng trừ số hữu tỉ",
      "Nhân chia số hữu tỉ",
      "Tính hợp lí",
    ],
    commonMistakes: [
      "Sai dấu khi cộng hoặc trừ số âm.",
      "Quên điều kiện số chia khác 0.",
      "Không rút gọn trước hoặc sau phép tính.",
    ],
    sourceIds: ["src-sgk-kntt-t1", "src-hoc-tap-kntt"],
    status: "VERIFIED",
  },
  {
    id: "lesson-3-luy-thua-so-huu-ti",
    type: "LESSON",
    title: "Bài 3. Lũy thừa với số mũ tự nhiên của một số hữu tỉ",
    description:
      "Hiểu lũy thừa, nhân chia lũy thừa cùng cơ số và lũy thừa của lũy thừa.",
    grade: 7,
    semester: 1,
    chapterId: chapter1.id,
    lessonNumber: 3,
    order: 3,
    difficulty: "BASIC",
    prerequisites: ["lesson-2-phep-tinh-so-huu-ti", "Lũy thừa số tự nhiên"],
    learningObjectives: [
      "Tính được lũy thừa của một số hữu tỉ.",
      "Vận dụng quy tắc nhân và chia hai lũy thừa cùng cơ số.",
      "Vận dụng quy tắc lũy thừa của một lũy thừa.",
    ],
    skills: [
      "Tính lũy thừa",
      "Nhân chia lũy thừa cùng cơ số",
      "Lũy thừa của lũy thừa",
    ],
    commonMistakes: [
      "Nhân số mũ thay vì cộng số mũ khi nhân cùng cơ số.",
      "Không xử lí đúng dấu của cơ số âm.",
      "Nhầm quy tắc lũy thừa của lũy thừa.",
    ],
    sourceIds: ["src-sgk-kntt-t1", "src-hoc-tap-kntt"],
    status: "VERIFIED",
  },
  {
    id: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
    type: "LESSON",
    title: "Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế",
    description:
      "Thực hiện biểu thức đúng thứ tự và sử dụng quy tắc chuyển vế trong đẳng thức.",
    grade: 7,
    semester: 1,
    chapterId: chapter1.id,
    lessonNumber: 4,
    order: 4,
    difficulty: "APPLIED",
    prerequisites: [
      "lesson-2-phep-tinh-so-huu-ti",
      "lesson-3-luy-thua-so-huu-ti",
    ],
    learningObjectives: [
      "Thực hiện đúng thứ tự các phép tính.",
      "Xử lí đúng biểu thức có nhiều loại dấu ngoặc.",
      "Sử dụng được quy tắc chuyển vế.",
      "Giải được một số bài toán tìm x cơ bản.",
    ],
    skills: [
      "Thứ tự phép tính",
      "Xử lí dấu ngoặc",
      "Quy tắc chuyển vế",
      "Tìm x",
    ],
    commonMistakes: [
      "Thực hiện cộng trừ trước nhân chia.",
      "Bỏ ngoặc sai dấu.",
      "Chuyển vế nhưng không đổi dấu.",
    ],
    sourceIds: ["src-sgk-kntt-t1", "src-hoc-tap-kntt"],
    status: "VERIFIED",
  },
];
