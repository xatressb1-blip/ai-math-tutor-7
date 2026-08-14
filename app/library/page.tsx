import { MultiLessonLibrary } from "@/components/library/MultiLessonLibrary";
import { getAllLessons } from "@/services/lesson/lesson-repository";

export default function LibraryPage() {
  return <MultiLessonLibrary lessons={getAllLessons()} />;
}
