import type { LessonDefinition } from "@/types/lesson";
import type { TeachingSessionSummary } from "@/types/teaching-session";
import type { LearningPathDecision } from "@/types/learning-path";

export function decideLearningPath({
  currentLesson,
  nextLesson,
  summary,
}: {
  currentLesson: LessonDefinition;
  nextLesson?: LessonDefinition;
  summary: TeachingSessionSummary;
}): LearningPathDecision {
  const readyToAdvance =
    summary.score >= 70 &&
    summary.confidenceScore >= 55 &&
    summary.reviewSkills.length <= 1;

  if (!readyToAdvance) {
    const reviewText = summary.reviewSkills.length
      ? `AI muốn em củng cố: ${summary.reviewSkills.join(", ")}.`
      : "AI muốn em học lại một lượt để tăng độ chắc.";

    return {
      action: "REVIEW_CURRENT",
      title: "Nên củng cố trước khi sang bài mới",
      message: `${reviewText} Khi điểm hoàn thành và Confidence ổn định hơn, hệ thống sẽ mở lộ trình tiếp theo.`,
    };
  }

  if (!nextLesson) {
    return {
      action: "COMPLETE_CHAPTER",
      title: "Em đã hoàn thành lộ trình hiện có",
      message:
        "Kết quả hiện tại đủ tốt để chuyển tiếp. Đây là bài cuối đang có trong thư viện Beta.",
    };
  }

  return {
    action: "ADVANCE",
    title: `Sẵn sàng sang Bài ${nextLesson.lessonNumber}`,
    message:
      summary.score >= 85 && summary.confidenceScore >= 70
        ? "Em đang có nền tảng rất chắc. AI đề xuất chuyển sang bài tiếp theo ngay."
        : "Kết quả đã đạt ngưỡng chuyển bài. Em có thể học tiếp hoặc quay lại ôn khi cần.",
    nextLessonId: nextLesson.id,
    nextLessonTitle: nextLesson.title,
  };
}
