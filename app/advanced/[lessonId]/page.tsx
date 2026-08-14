import { notFound } from "next/navigation";
import { AdvancedMathLab } from "@/components/advanced/AdvancedMathLab";
import { getAdvancedProblemsByLessonId } from "@/services/advanced/advanced-repository";
import { getLessonById } from "@/services/lesson/lesson-repository";

export default async function AdvancedLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();

  const problems = getAdvancedProblemsByLessonId(lesson.id);
  return <AdvancedMathLab lesson={lesson} problems={problems} />;
}
