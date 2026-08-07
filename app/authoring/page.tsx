import { LessonAuthoringStudio } from "@/components/authoring/LessonAuthoringStudio";
import { getAllLessons, getLessonById } from "@/services/lesson/lesson-repository";

export default async function AuthoringPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson: lessonId } = await searchParams;
  const templates = getAllLessons();
  const initialLesson =
    (lessonId ? getLessonById(lessonId) : undefined) ?? templates[0];

  return (
    <LessonAuthoringStudio
      initialLesson={initialLesson}
      templates={templates}
    />
  );
}
