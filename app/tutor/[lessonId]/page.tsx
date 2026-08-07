import { notFound } from "next/navigation";
import { PersonalTutorChat } from "@/components/tutor/PersonalTutorChat";
import { getLessonById } from "@/services/lesson/lesson-repository";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();
  return <PersonalTutorChat lesson={lesson} />;
}
