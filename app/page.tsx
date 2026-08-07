import { MultiLessonLibrary } from "@/components/library/MultiLessonLibrary";
import { getAllLessons } from "@/services/lesson/lesson-repository";

export default function Home() {
  return <MultiLessonLibrary lessons={getAllLessons()} />;
}
