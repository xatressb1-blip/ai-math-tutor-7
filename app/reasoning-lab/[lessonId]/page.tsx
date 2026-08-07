import { notFound } from "next/navigation";
import { ReasoningLab } from "@/components/reasoning/ReasoningLab";
import { getReasoningProblemsByLesson } from "@/data/reasoning/reasoning-problems";
import { getLessonById } from "@/services/lesson/lesson-repository";

export default async function StepAnalyzerPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();

  return (
    <ReasoningLab
      lesson={lesson}
      problems={getReasoningProblemsByLesson(lesson.id)}
    />
  );
}
