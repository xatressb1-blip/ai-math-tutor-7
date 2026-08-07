import { getLessonById } from "@/services/lesson/lesson-repository";
import type { LessonDefinition, LessonQuestion } from "@/types/lesson";
import type {
  TutorIntent,
  TutorRequest,
  TutorResponse,
} from "@/types/tutor";

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function inferIntent(message: string): TutorIntent {
  const value = normalize(message);
  if (/goi y|hint|khong biet lam|bat dau tu dau/.test(value)) return "HINT";
  if (/vi du|minh hoa|tuong tu/.test(value)) return "EXAMPLE";
  if (/quy tac|cong thuc|can nho/.test(value)) return "RULE";
  if (/hoi em|kiem tra|quiz|cau hoi/.test(value)) return "CHECK_UNDERSTANDING";
  if (/chan|met|kho qua|khong hoc duoc/.test(value)) return "MOTIVATION";
  if (/giai thich|tai sao|khong hieu|la gi|nhu the nao/.test(value)) return "EXPLAIN";
  return "EXPLAIN";
}

function chooseRelevantQuestion(
  lesson: LessonDefinition,
  message: string,
): LessonQuestion | null {
  const value = normalize(message);
  const questions = lesson.steps.flatMap((step) =>
    step.question ? [step.question] : [],
  );

  const exact = questions.find((question) => {
    const skill = normalize(question.skillName);
    return value.includes(skill) || skill.split(" ").some((word) => word.length > 4 && value.includes(word));
  });

  return exact ?? questions[0] ?? null;
}

function studentPersonalization(request: TutorRequest): string {
  const weakest = request.studentContext.weakSkills[0];
  const mistake = request.studentContext.recentMistakes[0];

  if (mistake) {
    return `AI đang lưu ý em từng mắc lỗi: “${mistake.description}”. Vì vậy ở bước này mình sẽ kiểm tra thật kỹ điểm đó.`;
  }
  if (weakest && weakest.masteryScore < 70) {
    return `Kỹ năng “${weakest.skillName}” của em hiện khoảng ${weakest.masteryScore}/100, nên mình sẽ giải thích theo từng bước ngắn.`;
  }
  return "Kết quả hiện tại khá ổn, nên mình sẽ giữ phần giải thích ngắn và tập trung vào cách tự kiểm tra đáp án.";
}

function explanationFromLesson(lesson: LessonDefinition): string {
  const explain = lesson.steps.filter((step) => step.action === "EXPLAIN");
  if (explain.length === 0) return lesson.subtitle;
  return explain.slice(0, 2).map((step) => `${step.title}: ${step.content}`).join("\n\n");
}

function exampleFromLesson(lesson: LessonDefinition): string {
  const question = lesson.steps.find((step) => step.question)?.question;
  if (!question) return "Bài này chưa có ví dụ tương tác trong Lesson Definition.";
  return `Ví dụ: ${question.prompt}\n\nEm chưa cần xem đáp án. Hãy nói cho thầy/cô bước đầu tiên em sẽ làm gì.`;
}

function ruleFromLesson(lesson: LessonDefinition): string {
  const explain = lesson.steps.filter((step) => step.action === "EXPLAIN");
  return explain.length
    ? explain.map((step) => `• ${step.content}`).join("\n")
    : `Điểm cần nhớ của bài: ${lesson.objectives.join("; ")}.`;
}

function buildTutorText(request: TutorRequest): {
  intent: TutorIntent;
  text: string;
  suggestions: string[];
} {
  const lesson = getLessonById(request.lessonId);
  if (!lesson) {
    return {
      intent: "OUT_OF_SCOPE",
      text: "Thầy/cô chưa tìm thấy bài học này trong Content Library. Em hãy quay lại thư viện và mở AI Tutor từ một bài đang có.",
      suggestions: ["Về thư viện bài học"],
    };
  }

  const intent = inferIntent(request.message);
  const relevantQuestion = chooseRelevantQuestion(lesson, request.message);
  const personalization = studentPersonalization(request);

  if (intent === "HINT") {
    const hint = relevantQuestion?.hint ?? "Hãy tách bài toán thành một bước nhỏ và nói cho thầy/cô dữ kiện em đã biết.";
    return {
      intent,
      text: `Mình chưa xem đáp án vội nhé. ${hint}\n\n${personalization}\n\nEm thử làm bước đầu tiên rồi gửi lại cho thầy/cô.`,
      suggestions: ["Cho em thêm một gợi ý", "Cho em ví dụ tương tự", "Kiểm tra cách làm của em"],
    };
  }

  if (intent === "EXAMPLE") {
    return {
      intent,
      text: `${exampleFromLesson(lesson)}\n\n${personalization}`,
      suggestions: ["Em sẽ thử bước đầu", "Cho em gợi ý", "Nhắc lại quy tắc"],
    };
  }

  if (intent === "RULE") {
    return {
      intent,
      text: `Những điều cần nhớ trong ${lesson.title}:\n${ruleFromLesson(lesson)}\n\n${personalization}`,
      suggestions: ["Cho em ví dụ", "Hỏi em một câu", "Em vẫn chưa hiểu chỗ này"],
    };
  }

  if (intent === "CHECK_UNDERSTANDING") {
    if (!relevantQuestion) {
      return {
        intent,
        text: "Bài học chưa có checkpoint để thầy/cô dùng kiểm tra nhanh. Em hãy thử tóm tắt lại một quy tắc vừa học.",
        suggestions: ["Giải thích lại bài", "Cho em ví dụ"],
      };
    }
    return {
      intent,
      text: `Thử câu này nhé:\n\n${relevantQuestion.prompt}\n\nEm hãy trả lời bằng cách em suy nghĩ, chưa cần chỉ gửi mỗi đáp án.`,
      suggestions: ["Em cần gợi ý", "Nhắc em quy tắc liên quan"],
    };
  }

  if (intent === "MOTIVATION") {
    return {
      intent,
      text: `Mình giảm độ khó xuống nhé. Em không cần làm cả bài ngay. Chỉ cần trả lời một câu: trong ${lesson.title}, phần nào làm em thấy khó nhất?\n\n${personalization}`,
      suggestions: ["Phần khái niệm", "Phần tính toán", "Em không biết bắt đầu từ đâu"],
    };
  }

  return {
    intent,
    text: `${explanationFromLesson(lesson)}\n\n${personalization}\n\nEm hãy nói lại bằng lời của em một ý em vừa hiểu; thầy/cô sẽ kiểm tra giúp.`,
    suggestions: ["Cho em ví dụ", "Hỏi em một câu", "Em cần gợi ý"],
  };
}

export function answerWithLocalTutor(request: TutorRequest): TutorResponse {
  const result = buildTutorText(request);
  return {
    message: {
      id: `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: "tutor",
      text: result.text,
      createdAt: new Date().toISOString(),
      intent: result.intent,
    },
    suggestedReplies: result.suggestions,
    sourceLabel: "Reasoning Tutor · Lesson + Student Brain",
    usedStudentContext:
      request.studentContext.weakSkills.length > 0 ||
      request.studentContext.recentMistakes.length > 0,
  };
}
