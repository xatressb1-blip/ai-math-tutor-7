import type { KnowledgeSource } from "@/types/knowledge";

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "src-sgk-kntt-t1",
    title: "SGK Toán 7 Tập 1 - Kết nối tri thức với cuộc sống",
    sourceType: "SGK",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note: "Nguồn chuẩn chương trình và thứ tự bài học.",
  },
  {
    id: "src-hoc-tap-kntt",
    title: "Tài liệu học tập môn Toán 7 - Kết nối tri thức với cuộc sống",
    sourceType: "SUPPLEMENT",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note: "Nguồn bổ sung trọng tâm kiến thức, dạng bài, vận dụng và nâng cao.",
  },
  {
    id: "src-chuyen-de-nang-cao",
    title: "Các chuyên đề nâng cao Toán lớp 7",
    sourceType: "ADVANCED",
    curriculum: "Bổ trợ nâng cao",
    grade: 7,
    semester: 1,
    note: "Nguồn dùng cho nhánh nâng cao sau khi học sinh đạt nền tảng.",
  },
];
