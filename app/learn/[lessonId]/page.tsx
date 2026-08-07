import { notFound } from "next/navigation";
import { PublishedLessonLauncher } from "@/components/content/PublishedLessonLauncher";
import {
  getLessonById,
  getNextLesson,
} from "@/services/lesson/lesson-repository";

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) notFound();

  return (
    <PublishedLessonLauncher
      fallbackLesson={lesson}
      nextLesson={getNextLesson(lesson.id)}
    />
  );
}
