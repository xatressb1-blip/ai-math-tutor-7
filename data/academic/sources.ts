import type { KnowledgeSource } from "@/types/knowledge";

export const academicSources: KnowledgeSource[] = [
  {
    id: "src-sgk-kntt-t1",
    title: "SGK Toán 7 Tập 1 - Kết nối tri thức với cuộc sống",
    sourceType: "SGK",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note:
      "Nguồn chuẩn chính và có quyền ưu tiên cao nhất: cấu trúc 5 chương, 19 bài, thuật ngữ, kiến thức, kĩ năng và hoạt động trải nghiệm.",
  },
  {
    id: "src-sbt-kntt-t1",
    title: "Sách bài tập Toán 7 Tập 1 - Kết nối tri thức với cuộc sống",
    sourceType: "SUPPLEMENT",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note:
      "Nguồn PRACTICE: củng cố, luyện tập và mở rộng số lượng bài; không thay thế hoặc đổi chuẩn SGK.",
  },
  {
    id: "src-hoc-tap-kntt",
    title: "Tài liệu học tập môn Toán 7 - Kết nối tri thức với cuộc sống",
    sourceType: "SUPPLEMENT",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note:
      "Nguồn ENRICHMENT: phân dạng bài, vận dụng, lỗi thường gặp và bài nâng dần; chỉ dùng sau tầng kiến thức SGK.",
  },
  {
    id: "src-chuyen-de-nang-cao",
    title: "Các chuyên đề nâng cao Toán lớp 7",
    sourceType: "ADVANCED",
    curriculum: "Bổ trợ nâng cao",
    grade: 7,
    semester: 1,
    note:
      "Nguồn ADVANCED_ONLY: chỉ mở sau khi học sinh đạt mastery nền tảng; không được làm thay đổi cấu trúc hoặc chuẩn kiến thức SGK.",
  },
];
