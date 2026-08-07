import type { AcademicChapter, AcademicLesson } from "@/types/academic";

const primary = (locator: string, note: string) => ({
  sourceId: "src-sgk-kntt-t1",
  role: "PRIMARY" as const,
  locator,
  note,
});

const supplement = (locator: string, note: string) => ({
  sourceId: "src-hoc-tap-kntt",
  role: "ENRICHMENT" as const,
  locator,
  note,
});

function makeLesson(config: {
  id: string;
  player: string;
  number: number;
  title: string;
  summary: string;
  concepts: string[];
  skills: string[];
  mistakes: string[];
  source: string;
}): AcademicLesson {
  const { id, player, number, title, summary, concepts, skills, mistakes, source } = config;
  return {
    schemaVersion: "1.0",
    id,
    lessonPlayerId: player,
    chapterId: "academic-ch3-goc-song-song",
    chapterNumber: 3,
    lessonNumber: number,
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title,
    summary,
    estimatedMinutes: 35,
    objectives: skills.map((skill, index) => ({
      id: `${id}-o${index + 1}`,
      statement: skill,
      bloom: index === 0 ? "UNDERSTAND" : "APPLY",
      required: true,
      masteryThreshold: 70,
    })),
    concepts: concepts.map((concept, index) => ({
      id: `${id}-c${index + 1}`,
      title: concept,
      summary: `Nhận biết, mô tả và vận dụng ${concept.toLowerCase()} trong các bài toán phù hợp.`,
      keyIdeas: [concept, "nhận biết qua hình", "giải thích bằng tính chất"],
      prerequisites: ["Góc", "Đường thẳng"],
      representations: ["TEXT", "DIAGRAM", "REAL_LIFE"],
    })),
    vocabulary: concepts.map((concept) => ({
      term: concept,
      studentFriendlyMeaning: `Thuật ngữ hình học trọng tâm của Bài ${number}.`,
    })),
    teachingScript: [
      {
        id: `${id}-t1`,
        phase: "HOOK",
        teacherIntent: "Quan sát hình trước khi gọi tên.",
        aiPrompt: "Cho một hình đơn giản và hỏi học sinh thấy quan hệ hình học nào nổi bật.",
        expectedStudentEvidence: "Học sinh mô tả đúng vị trí hoặc quan hệ.",
      },
      {
        id: `${id}-t2`,
        phase: "DISCOVER",
        teacherIntent: "Từ hình thành tính chất.",
        aiPrompt: "Yêu cầu học sinh dự đoán quan hệ rồi kiểm tra bằng định nghĩa hoặc tính chất.",
        expectedStudentEvidence: "Nêu được tính chất bằng lời.",
      },
      {
        id: `${id}-t3`,
        phase: "EXPLAIN",
        teacherIntent: "Chuẩn hóa thuật ngữ theo SGK.",
        aiPrompt: "Chốt định nghĩa và điều kiện áp dụng; nhắc học sinh không suy luận chỉ vì hình trông có vẻ đúng.",
        expectedStudentEvidence: "Nêu đủ điều kiện áp dụng.",
      },
      {
        id: `${id}-t4`,
        phase: "CHECK",
        teacherIntent: "Kiểm tra vận dụng.",
        aiPrompt: "Cho một tình huống mới và yêu cầu học sinh chỉ rõ tính chất đã dùng.",
        expectedStudentEvidence: "Lập luận có căn cứ.",
      },
    ],
    workedExamples: [
      {
        id: `${id}-e1`,
        title: "Đọc hình và nêu quan hệ",
        purpose: "Rèn nhận dạng trước khi tính toán.",
        difficulty: "FOUNDATION",
        context: "PURE_MATH",
        keySteps: ["Xác định đối tượng", "Gọi tên quan hệ", "Nêu tính chất"],
        sourceRef: primary(source, "Ví dụ và hoạt động trọng tâm của bài."),
      },
      {
        id: `${id}-e2`,
        title: "Lập luận hình học ngắn",
        purpose: "Chuyển từ quan sát sang suy luận.",
        difficulty: "BASIC",
        context: "PURE_MATH",
        keySteps: ["Nêu giả thiết", "Chọn tính chất", "Kết luận"],
        sourceRef: supplement(`Tài liệu học tập Chương 3 - Bài ${number}`, "Dạng toán bổ trợ."),
      },
    ],
    misconceptions: mistakes.map((label, index) => ({
      id: `${id}-m${index + 1}`,
      label,
      evidencePattern: label,
      likelyCause: "Nhận dạng hình hoặc điều kiện áp dụng chưa chính xác.",
      correctionStrategy: "Quay lại định nghĩa, đánh dấu trên hình và yêu cầu nói rõ điều kiện.",
      retrySkill: skills[Math.min(index, skills.length - 1)],
    })),
    hintLadders: [
      {
        skill: skills[0],
        hint1: "Hãy đánh dấu các tia, góc hoặc đường thẳng liên quan.",
        hint2: "Gọi đúng tên quan hệ trước khi dùng tính chất.",
        hint3: "Viết tính chất dưới dạng 'nếu ... thì ...' rồi thay dữ kiện bài toán.",
        revealPolicy: "AFTER_THREE_ATTEMPTS",
      },
    ],
    reasoningTemplates: [
      {
        id: `${id}-r1`,
        skill: skills[0],
        prompt: "Trình bày từng bước: điều đã biết → tính chất dùng → kết luận.",
        requiredIdeas: ["giả thiết", "tính chất phù hợp", "kết luận"],
        firstErrorFocus: ["nhận dạng sai vị trí", "dùng tính chất thiếu điều kiện"],
      },
    ],
    practiceBlueprint: skills.map((skill) => ({
      skill,
      foundation: 4,
      basic: 5,
      applied: 4,
      advanced: 2,
      allowAdvancedOnlyAfterMastery: true,
    })),
    assessment: {
      diagnosticItems: 3,
      checkpointItems: 7,
      exitTicketItems: 3,
      masteryThreshold: 72,
      reasoningRequired: true,
    },
    studentBrain: {
      skillNames: skills,
      mistakeCategories: ["CONCEPT", "PROCEDURE"],
      masterySignals: ["nhận dạng đúng", "nêu đúng điều kiện", "lập luận có căn cứ"],
      confidenceSignals: ["đúng lần đầu", "ít cần hint", "tự giải thích được"],
    },
    teacherTags: skills.map((skill, index) => ({
      code: `CH3-L${number}-${index + 1}`,
      label: skill,
      dimension: index === 0 ? "CONTENT" : "REASONING",
    })),
    sourceRefs: [
      primary(source, "Nguồn chuẩn SGK KNTT."),
      supplement(`Tài liệu học tập Chương 3 - Bài ${number}`, "Phân dạng và bài vận dụng."),
    ],
    qualityStatus: "CONTENT_READY",
  };
}

export const academicChapter3: AcademicChapter = {
  schemaVersion: "1.0",
  id: "academic-ch3-goc-song-song",
  number: 3,
  title: "Góc và đường thẳng song song",
  grade: 7,
  semester: 1,
  curriculum: "KNTT",
  summary:
    "Góc ở vị trí đặc biệt, tia phân giác, dấu hiệu nhận biết hai đường thẳng song song, tiên đề Euclid, tính chất song song, định lí và chứng minh.",
  lessonIds: ["academic-l8", "academic-l9", "academic-l10", "academic-l11"],
  sourceRefs: [
    primary("SGK Chương III - Bài 8 đến Bài 11", "Trình tự và kiến thức chuẩn."),
    supplement("Tài liệu học tập Chương 3, phần Bài 8-11", "Hệ thống hóa trọng tâm và dạng bài."),
  ],
  qualityStatus: "CONTENT_READY",
};

export const academicChapter3Lessons: AcademicLesson[] = [
  makeLesson({
    id: "academic-l8",
    player: "lesson-player-08",
    number: 8,
    title: "Góc ở vị trí đặc biệt. Tia phân giác của một góc",
    summary: "Góc kề bù, góc đối đỉnh, vuông góc và tia phân giác.",
    concepts: ["Góc kề bù", "Góc đối đỉnh", "Hai đường thẳng vuông góc", "Tia phân giác"],
    skills: ["Nhận biết góc đặc biệt", "Tính số đo góc", "Vận dụng tia phân giác"],
    mistakes: ["Nhầm góc kề bù với góc đối đỉnh", "Cho rằng mọi góc bằng nhau đều đối đỉnh"],
    source: "SGK Chương III - Bài 8",
  }),
  makeLesson({
    id: "academic-l9",
    player: "lesson-player-09",
    number: 9,
    title: "Hai đường thẳng song song và dấu hiệu nhận biết",
    summary: "Góc so le trong, góc đồng vị và dấu hiệu nhận biết song song.",
    concepts: ["Góc so le trong", "Góc đồng vị", "Hai đường thẳng song song", "Dấu hiệu nhận biết"],
    skills: ["Nhận biết cặp góc", "Kết luận hai đường thẳng song song", "Giải thích dấu hiệu"],
    mistakes: ["Nhận nhầm vị trí góc", "Dùng hai góc bằng nhau bất kì để kết luận song song"],
    source: "SGK Chương III - Bài 9",
  }),
  makeLesson({
    id: "academic-l10",
    player: "lesson-player-10",
    number: 10,
    title: "Tiên đề Euclid. Tính chất của hai đường thẳng song song",
    summary: "Đường thẳng song song duy nhất qua điểm ngoài và tính chất góc khi có hai đường song song.",
    concepts: ["Tiên đề Euclid", "Tính chất hai đường thẳng song song", "Góc đồng vị", "Góc so le trong"],
    skills: ["Phát biểu tiên đề Euclid", "Tính góc khi có song song", "Suy luận từ tính chất song song"],
    mistakes: ["Cho rằng qua một điểm có nhiều đường song song", "Đảo chiều dấu hiệu và tính chất thiếu điều kiện"],
    source: "SGK Chương III - Bài 10",
  }),
  makeLesson({
    id: "academic-l11",
    player: "lesson-player-11",
    number: 11,
    title: "Định lí và chứng minh định lí",
    summary: "Giả thiết, kết luận và chuỗi lập luận chứng minh.",
    concepts: ["Định lí", "Giả thiết", "Kết luận", "Chứng minh"],
    skills: ["Xác định giả thiết kết luận", "Viết GT-KL bằng kí hiệu", "Chứng minh định lí đơn giản"],
    mistakes: ["Đảo giả thiết và kết luận", "Dùng kết quả cần chứng minh làm lí do"],
    source: "SGK Chương III - Bài 11",
  }),
];
