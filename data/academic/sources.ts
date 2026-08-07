import type { KnowledgeSource } from "@/types/knowledge";

export const academicSources: KnowledgeSource[] = [
  {
    id: "src-sgk-kntt-t1",
    title: "SGK Toán 7 Tập 1 - Kết nối tri thức với cuộc sống",
    sourceType: "SGK",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note: "Nguồn chuẩn chính: thứ tự chương/bài, thuật ngữ, kiến thức và yêu cầu cần đạt.",
  },
  {
    id: "src-sbt-kntt-t1",
    title: "Sách bài tập Toán 7 Tập 1 - Kết nối tri thức với cuộc sống",
    sourceType: "SUPPLEMENT",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note: "Nguồn luyện tập và củng cố; không thay thế SGK.",
  },
  {
    id: "src-hoc-tap-kntt",
    title: "Tài liệu học tập môn Toán 7 - Kết nối tri thức với cuộc sống",
    sourceType: "SUPPLEMENT",
    curriculum: "Kết nối tri thức với cuộc sống",
    grade: 7,
    semester: 1,
    note: "Nguồn tham khảo để hệ thống hóa dạng toán, vận dụng và lỗi thường gặp.",
  },
  {
    id: "src-chuyen-de-nang-cao",
    title: "Các chuyên đề nâng cao Toán lớp 7",
    sourceType: "ADVANCED",
    curriculum: "Bổ trợ nâng cao",
    grade: 7,
    semester: 1,
    note: "Chỉ dùng cho nhánh nâng cao sau khi học sinh đạt Mastery; không dùng làm chuẩn kiến thức cốt lõi.",
  },
];
