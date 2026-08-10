import { getAcademicLessons } from "@/services/academic/academic-repository";
import type { AcademicLesson } from "@/types/academic";
import type { LessonDefinition, LessonQuestion, LessonStep } from "@/types/lesson";

function makeQuestion(
  lesson: AcademicLesson,
  index: number,
): LessonQuestion {
  const objective =
    lesson.objectives[index] ??
    lesson.objectives[lesson.objectives.length - 1];
  const concept =
    lesson.concepts[index] ??
    lesson.concepts[lesson.concepts.length - 1];

  const distractors = [
    "Chỉ nhìn hình hoặc kết quả rồi đoán.",
    "Áp dụng một quy tắc bất kì mà chưa kiểm tra điều kiện.",
    "Bỏ qua dữ kiện và kết luận ngay.",
  ];

  return {
    id: `${lesson.lessonPlayerId}-core-${index + 1}`,
    prompt: `Trong bài “${lesson.title}”, cách làm nào phù hợp nhất với mục tiêu: ${objective.statement}`,
    choices: [
      {
        id: "a",
        text: `Xác định đúng dữ kiện/đối tượng, dùng kiến thức “${concept.title}”, rồi giải thích kết luận.`,
      },
      { id: "b", text: distractors[0] },
      { id: "c", text: distractors[1] },
      { id: "d", text: distractors[2] },
    ],
    correctChoiceId: "a",
    skillName: objective.statement,
    hint: `Hãy nhớ ý chính: ${concept.keyIdeas[0] ?? concept.summary}`,
    retryHint:
      "Đừng chọn theo cảm giác. Hãy kiểm tra điều kiện của định nghĩa hoặc tính chất trước.",
    explanation: `${concept.summary} Vì vậy cần xác định đúng điều kiện rồi mới suy luận.`,
  };
}

function toSteps(lesson: AcademicLesson): LessonStep[] {
  const firstConcept = lesson.concepts[0];
  const secondConcept = lesson.concepts[1] ?? firstConcept;

  return [
    {
      id: `${lesson.lessonPlayerId}-welcome`,
      action: "WELCOME",
      title: `Bài ${lesson.lessonNumber}. ${lesson.title}`,
      content: lesson.summary,
      estimatedMinutes: 2,
    },
    {
      id: `${lesson.lessonPlayerId}-objective`,
      action: "OBJECTIVE",
      title: "Mục tiêu của bài",
      content: lesson.objectives.map((item) => `• ${item.statement}`).join("\n"),
      estimatedMinutes: 2,
    },
    {
      id: `${lesson.lessonPlayerId}-explain-1`,
      action: "EXPLAIN",
      title: firstConcept.title,
      content: `${firstConcept.summary}\n\nCần nhớ: ${firstConcept.keyIdeas.join("; ")}.`,
      estimatedMinutes: 6,
    },
    {
      id: `${lesson.lessonPlayerId}-check-1`,
      action: "QUESTION",
      title: "Kiểm tra hiểu bài",
      content: "Chọn cách suy nghĩ đúng trước khi luyện tập.",
      estimatedMinutes: 4,
      question: makeQuestion(lesson, 0),
    },
    ...(secondConcept && secondConcept.id !== firstConcept.id
      ? [
          {
            id: `${lesson.lessonPlayerId}-explain-2`,
            action: "EXPLAIN" as const,
            title: secondConcept.title,
            content: `${secondConcept.summary}\n\nCần nhớ: ${secondConcept.keyIdeas.join("; ")}.`,
            estimatedMinutes: 6,
          },
          {
            id: `${lesson.lessonPlayerId}-check-2`,
            action: "QUESTION" as const,
            title: "Vận dụng trực tiếp",
            content: "Kiểm tra điều kiện áp dụng trước khi kết luận.",
            estimatedMinutes: 4,
            question: makeQuestion(lesson, 1),
          },
        ]
      : []),
    {
      id: `${lesson.lessonPlayerId}-summary`,
      action: "SUMMARY",
      title: "Tóm tắt",
      content:
        lesson.objectives.map((item) => `✓ ${item.statement}`).join("\n") +
        "\n\nSau phần này, hệ thống sẽ chuyển sang luyện tập thích ứng.",
      estimatedMinutes: 3,
    },
  ];
}

export function getAcademicBackedLessonDefinitions(): LessonDefinition[] {
  return getAcademicLessons()
    .filter((lesson) => Boolean(lesson.lessonPlayerId))
    .map((lesson) => ({
      id: lesson.lessonPlayerId!,
      knowledgeNodeId: `lesson-${lesson.lessonNumber}-${lesson.id.replace("academic-l", "academic")}`,
      grade: lesson.grade,
      chapter: lesson.chapterNumber,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      subtitle: lesson.summary,
      objectives: lesson.objectives.map((item) => item.statement),
      estimatedMinutes: lesson.estimatedMinutes,
      steps: toSteps(lesson),
    }));
}
