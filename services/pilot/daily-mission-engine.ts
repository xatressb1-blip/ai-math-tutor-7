import { getAllLessons } from "@/services/lesson/lesson-repository";
import type { DailyMission } from "@/types/pilot-experience";
import type { StudentBrainSnapshot } from "@/types/student";

function todayKey(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function buildDailyMission(brain: StudentBrainSnapshot): DailyMission {
  const lessons = getAllLessons();
  const weakest = [...brain.skills].sort((a, b) => a.masteryScore - b.masteryScore)[0];
  const focusLesson =
    lessons.find((lesson) => lesson.knowledgeNodeId === weakest?.knowledgeNodeId) ??
    lessons.find((lesson) => lesson.id === weakest?.knowledgeNodeId) ??
    lessons[0];

  if (!focusLesson) {
    return {
      dateKey: todayKey(),
      focusSkill: "Ôn tập Toán 7",
      focusLessonId: "",
      readinessMessage: "Hãy bắt đầu từ thư viện bài học.",
      totalMinutes: 15,
      items: [{
        id: "mission-library",
        title: "Chọn một bài để học",
        description: "Mở thư viện và bắt đầu bài phù hợp.",
        href: "/",
        kind: "LEARN",
        estimatedMinutes: 15,
        reason: "Chưa có đủ dữ liệu để cá nhân hóa.",
      }],
    };
  }

  const focusSkill = weakest?.skillName ?? focusLesson.title;
  const mastery = weakest?.masteryScore ?? 0;
  const items = [
    {
      id: "mission-learn",
      title: `Ôn Bài ${focusLesson.lessonNumber}: ${focusLesson.title}`,
      description: "Học lại phần trọng tâm và trả lời các câu kiểm tra nhanh.",
      href: `/learn/${focusLesson.id}`,
      kind: "LEARN" as const,
      estimatedMinutes: 12,
      reason: `Student Brain đang ưu tiên kỹ năng “${focusSkill}”.`,
    },
    {
      id: "mission-reasoning",
      title: "Giải thích bằng Reasoning Lab",
      description: "Trình bày từng bước để AI kiểm tra cách suy luận.",
      href: `/reasoning-lab/${focusLesson.id}`,
      kind: "REASONING" as const,
      estimatedMinutes: 8,
      reason: "Củng cố hiểu bản chất, không chỉ chọn đáp án.",
    },
    {
      id: "mission-review",
      title: "Kiểm tra mức sẵn sàng",
      description: "Xem lại kế hoạch ôn và kỹ năng cần ưu tiên tiếp theo.",
      href: "/mastery",
      kind: "REVIEW" as const,
      estimatedMinutes: 5,
      reason: "Cập nhật hướng ôn sau phiên học.",
    },
  ];
  return {
    dateKey: todayKey(),
    focusSkill,
    focusLessonId: focusLesson.id,
    readinessMessage:
      mastery < 55
        ? "Hôm nay nên ưu tiên củng cố nền tảng."
        : mastery < 75
          ? "Hôm nay nên luyện thêm để tăng độ chắc chắn."
          : "Em đã khá vững; hãy tập trung vào Reasoning và vận dụng.",
    totalMinutes: items.reduce((sum, item) => sum + item.estimatedMinutes, 0),
    items,
  };
}
