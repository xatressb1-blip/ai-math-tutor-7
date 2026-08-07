import { ChapterLearningPathDashboard } from "@/components/dashboard/ChapterLearningPathDashboard";
import { getLessonsByChapter } from "@/services/lesson/lesson-repository";

export default function ProgressPage() {
  return <ChapterLearningPathDashboard lessons={getLessonsByChapter(1)} />;
}
