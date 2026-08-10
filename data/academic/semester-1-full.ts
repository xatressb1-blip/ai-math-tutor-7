import type {
  AcademicActivity,
  AcademicChapter,
  AcademicEnrichment,
  AcademicLesson,
  AcademicSourceRef,
} from "@/types/academic";
import type { DifficultyLevel } from "@/types/knowledge";

const primary = (locator: string, note: string): AcademicSourceRef => ({
  sourceId: "src-sgk-kntt-t1",
  role: "PRIMARY",
  locator,
  note,
});

const practice = (locator: string, note: string): AcademicSourceRef => ({
  sourceId: "src-sbt-kntt-t1",
  role: "PRACTICE",
  locator,
  note,
});

const supplement = (locator: string, note: string): AcademicSourceRef => ({
  sourceId: "src-hoc-tap-kntt",
  role: "ENRICHMENT",
  locator,
  note,
});

const advanced = (locator: string, note: string): AcademicSourceRef => ({
  sourceId: "src-chuyen-de-nang-cao",
  role: "ADVANCED_ONLY",
  locator,
  note,
});

type LessonConfig = {
  id: string;
  player?: string;
  chapterId: string;
  chapterNumber: number;
  number: number;
  title: string;
  summary: string;
  sgkLocator: string;
  concepts: Array<{
    title: string;
    summary: string;
    keyIdeas: string[];
    prerequisites?: string[];
    reps?: Array<"TEXT" | "NUMBER_LINE" | "TABLE" | "DIAGRAM" | "FORMULA" | "REAL_LIFE">;
  }>;
  objectives: string[];
  vocabulary: Array<[string, string]>;
  mistakes: Array<[string, string, string]>;
  extension?: {
    applied?: string;
    advanced?: string;
  };
};

function difficultyFor(index: number): DifficultyLevel {
  if (index === 0) return "FOUNDATION";
  if (index === 1) return "BASIC";
  return "APPLIED";
}

function makeEnrichment(config: LessonConfig): AcademicEnrichment[] {
  const items: AcademicEnrichment[] = [
    {
      id: `${config.id}-practice`,
      level: "PRACTICE",
      title: "Củng cố theo Sách bài tập",
      summary:
        "Luyện thêm các bài cùng chuẩn kiến thức SGK, ưu tiên độ chính xác và tính ổn định của kĩ năng.",
      gate: "ALWAYS",
      sourceRef: practice(
        `SBT Toán 7 Tập 1 - Chương ${config.chapterNumber}, Bài ${config.number}`,
        "Nguồn củng cố và luyện tập; không thay đổi chuẩn SGK.",
      ),
    },
    {
      id: `${config.id}-applied`,
      level: "APPLIED",
      title: "Phân dạng và vận dụng",
      summary:
        config.extension?.applied ??
        "Mở rộng bằng các dạng bài, bài toán vận dụng và lỗi thường gặp sau khi học sinh đã nắm kiến thức nền.",
      gate: "AFTER_FOUNDATION",
      sourceRef: supplement(
        `Tài liệu học tập Toán 7 KNTT - Chương ${config.chapterNumber}, Bài ${config.number}`,
        "Nguồn hệ thống hóa dạng toán và vận dụng.",
      ),
    },
  ];

  if (config.extension?.advanced) {
    items.push({
      id: `${config.id}-advanced`,
      level: "ADVANCED",
      title: "Nhánh nâng cao",
      summary: config.extension.advanced,
      gate: "AFTER_MASTERY",
      sourceRef: advanced(
        `Chuyên đề nâng cao liên quan Bài ${config.number}`,
        "Chỉ mở sau khi đạt mastery nền tảng; không dùng làm chuẩn kiến thức bắt buộc.",
      ),
    });
  }

  return items;
}

function makeLesson(config: LessonConfig): AcademicLesson {
  const primarySkills = config.objectives;
  return {
    schemaVersion: "1.0",
    id: config.id,
    lessonPlayerId: config.player,
    chapterId: config.chapterId,
    chapterNumber: config.chapterNumber,
    lessonNumber: config.number,
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: config.title,
    summary: config.summary,
    estimatedMinutes: config.chapterNumber >= 4 ? 40 : 35,
    objectives: config.objectives.map((statement, index) => ({
      id: `${config.id}-o${index + 1}`,
      statement,
      bloom: index === 0 ? "UNDERSTAND" : index === 1 ? "APPLY" : "ANALYZE",
      required: true,
      masteryThreshold: config.chapterNumber >= 4 ? 72 : 70,
    })),
    concepts: config.concepts.map((concept, index) => ({
      id: `${config.id}-c${index + 1}`,
      title: concept.title,
      summary: concept.summary,
      keyIdeas: concept.keyIdeas,
      prerequisites: concept.prerequisites ?? [],
      representations:
        concept.reps ??
        (config.chapterNumber >= 3
          ? ["TEXT", "DIAGRAM", "FORMULA", "REAL_LIFE"]
          : ["TEXT", "FORMULA", "TABLE", "REAL_LIFE"]),
    })),
    vocabulary: config.vocabulary.map(([term, meaning]) => ({
      term,
      studentFriendlyMeaning: meaning,
    })),
    teachingScript: [
      {
        id: `${config.id}-t1`,
        phase: "HOOK",
        teacherIntent: "Khởi động từ tình huống hoặc biểu diễn gần gũi với nội dung SGK.",
        aiPrompt:
          "Đưa một tình huống ngắn đúng trọng tâm bài, hỏi học sinh dự đoán hoặc mô tả trước khi nêu quy tắc.",
        expectedStudentEvidence:
          "Học sinh gọi đúng đối tượng, dữ kiện hoặc quan hệ ban đầu.",
      },
      {
        id: `${config.id}-t2`,
        phase: "DISCOVER",
        teacherIntent: "Dẫn học sinh tự nhận ra kiến thức cốt lõi.",
        aiPrompt:
          "Cho ví dụ theo mức nền tảng, đặt câu hỏi từng bước để học sinh phát hiện quy luật hoặc tính chất.",
        expectedStudentEvidence:
          "Học sinh phát biểu được ý chính bằng lời của mình.",
      },
      {
        id: `${config.id}-t3`,
        phase: "EXPLAIN",
        teacherIntent: "Chuẩn hóa thuật ngữ và điều kiện áp dụng theo SGK.",
        aiPrompt:
          "Chốt định nghĩa, tính chất hoặc quy tắc; chỉ rõ điều kiện áp dụng và một phản ví dụ nếu phù hợp.",
        expectedStudentEvidence:
          "Học sinh nêu đúng thuật ngữ, điều kiện và không suy luận chỉ dựa vào hình thức.",
      },
      {
        id: `${config.id}-t4`,
        phase: "CHECK",
        teacherIntent: "Kiểm tra hiểu bản chất trước khi luyện nhiều.",
        aiPrompt:
          "Cho một câu kiểm tra ngắn yêu cầu vừa trả lời vừa giải thích lí do.",
        expectedStudentEvidence:
          "Trả lời đúng và nêu được căn cứ.",
      },
      {
        id: `${config.id}-t5`,
        phase: "PRACTICE",
        teacherIntent: "Thích ứng độ khó theo Student Brain.",
        aiPrompt:
          "Bắt đầu ở bài cơ bản; nếu đúng ổn định mới chuyển vận dụng, chỉ mở nâng cao sau khi đạt mastery.",
        expectedStudentEvidence:
          "Độ chính xác tăng, giảm phụ thuộc hint và tự sửa lỗi.",
      },
    ],
    workedExamples: config.objectives.slice(0, 3).map((skill, index) => ({
      id: `${config.id}-e${index + 1}`,
      title: index === 0 ? "Ví dụ nền tảng" : index === 1 ? "Ví dụ vận dụng trực tiếp" : "Ví dụ giải thích",
      purpose: skill,
      difficulty: difficultyFor(index),
      context: index === 1 ? "REAL_LIFE" : "PURE_MATH",
      keySteps:
        config.chapterNumber >= 3
          ? ["Đọc/đánh dấu hình hoặc dữ liệu", "Chọn định nghĩa/tính chất phù hợp", "Lập luận và kết luận"]
          : ["Xác định dữ kiện", "Chọn quy tắc phù hợp", "Thực hiện và kiểm tra kết quả"],
      sourceRef: primary(config.sgkLocator, "Ví dụ/hoạt động trọng tâm của bài trong SGK."),
    })),
    misconceptions: config.mistakes.map(([label, cause, correction], index) => ({
      id: `${config.id}-m${index + 1}`,
      label,
      evidencePattern: label,
      likelyCause: cause,
      correctionStrategy: correction,
      retrySkill: primarySkills[Math.min(index, primarySkills.length - 1)],
    })),
    hintLadders: primarySkills.slice(0, 2).map((skill, index) => ({
      skill,
      hint1:
        index === 0
          ? "Hãy gọi đúng tên đối tượng/đại lượng và nhắc lại định nghĩa liên quan."
          : "Hãy ghi rõ dữ kiện và điều em cần tìm/chứng minh.",
      hint2:
        config.chapterNumber >= 3
          ? "Đánh dấu trên hình các quan hệ đã biết rồi chọn một tính chất phù hợp."
          : "Viết quy tắc hoặc công thức cần dùng trước khi thay số.",
      hint3:
        "Thực hiện từng bước, kiểm tra điều kiện áp dụng và đối chiếu kết quả với dữ kiện ban đầu.",
      revealPolicy: "AFTER_THREE_ATTEMPTS",
    })),
    reasoningTemplates: [
      {
        id: `${config.id}-r1`,
        skill: primarySkills[0],
        prompt:
          config.chapterNumber >= 3
            ? "Trình bày: điều đã biết → định nghĩa/tính chất dùng → suy luận → kết luận."
            : "Trình bày: dữ kiện → quy tắc dùng → các bước biến đổi/tính toán → kiểm tra.",
        requiredIdeas: ["đúng dữ kiện", "đúng quy tắc/tính chất", "kết luận có căn cứ"],
        firstErrorFocus: ["nhầm khái niệm", "dùng quy tắc thiếu điều kiện", "sai bước biến đổi"],
      },
    ],
    practiceBlueprint: primarySkills.map((skill) => ({
      skill,
      foundation: 4,
      basic: 5,
      applied: 4,
      advanced: 2,
      allowAdvancedOnlyAfterMastery: true,
    })),
    enrichment: makeEnrichment(config),
    assessment: {
      diagnosticItems: 3,
      checkpointItems: 7,
      exitTicketItems: 3,
      masteryThreshold: config.chapterNumber >= 4 ? 72 : 70,
      reasoningRequired: true,
    },
    studentBrain: {
      skillNames: primarySkills,
      mistakeCategories: ["CONCEPT", "PROCEDURE", "REASONING"],
      masterySignals: ["đúng độc lập", "giải thích đúng", "vận dụng vào tình huống mới"],
      confidenceSignals: ["đúng lần đầu", "ít cần hint", "tự kiểm tra được"],
    },
    teacherTags: primarySkills.map((skill, index) => ({
      code: `CH${config.chapterNumber}-L${config.number}-${index + 1}`,
      label: skill,
      dimension: index === 0 ? "CONTENT" : index === 1 ? "PROCESS" : "REASONING",
    })),
    sourceRefs: [
      primary(config.sgkLocator, "Nguồn chuẩn chính về cấu trúc, thuật ngữ và yêu cầu kiến thức."),
      practice(`SBT - Chương ${config.chapterNumber}, Bài ${config.number}`, "Củng cố theo chuẩn SGK."),
      supplement(`Tài liệu học tập - Chương ${config.chapterNumber}, Bài ${config.number}`, "Phân dạng, vận dụng và mở rộng."),
      ...(config.extension?.advanced
        ? [advanced(`Chuyên đề liên quan Bài ${config.number}`, "Chỉ dùng cho nhánh nâng cao sau mastery.")]
        : []),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  };
}

const configs: LessonConfig[] = [
  {
    id: "academic-l1",
    player: "lesson-player-01",
    chapterId: "academic-ch1-so-huu-ti",
    chapterNumber: 1,
    number: 1,
    title: "Tập hợp các số hữu tỉ",
    summary: "Số hữu tỉ, số đối, biểu diễn trên trục số và thứ tự trong tập hợp số hữu tỉ.",
    sgkLocator: "SGK trang 5-9",
    concepts: [
      { title: "Số hữu tỉ", summary: "Số viết được dưới dạng phân số a/b với a, b là số nguyên và b khác 0.", keyIdeas: ["dạng a/b", "tập Q", "số đối"], prerequisites: ["Phân số", "Số nguyên"], reps: ["TEXT", "NUMBER_LINE", "FORMULA"] },
      { title: "Biểu diễn trên trục số", summary: "Mỗi số hữu tỉ được biểu diễn bởi một điểm trên trục số.", keyIdeas: ["chia đơn vị", "vị trí điểm", "khoảng cách đến 0"], prerequisites: ["Trục số"], reps: ["NUMBER_LINE", "DIAGRAM"] },
      { title: "Thứ tự số hữu tỉ", summary: "So sánh và sắp xếp các số hữu tỉ.", keyIdeas: ["quy đồng", "vị trí trên trục số", "tính bắc cầu"], prerequisites: ["So sánh phân số"], reps: ["NUMBER_LINE", "FORMULA"] },
    ],
    objectives: ["Nhận biết số hữu tỉ và số đối.", "Biểu diễn số hữu tỉ trên trục số.", "So sánh và sắp xếp các số hữu tỉ."],
    vocabulary: [["số hữu tỉ", "Số có thể viết thành phân số của hai số nguyên với mẫu khác 0."], ["số đối", "Hai số nằm hai phía của 0 và cách 0 một khoảng bằng nhau."], ["tập Q", "Tập hợp tất cả các số hữu tỉ."]],
    mistakes: [
      ["Nhầm số thập phân hữu hạn không phải số hữu tỉ", "Chưa liên hệ số thập phân với phân số", "Đổi số thập phân hữu hạn về phân số để kiểm tra."],
      ["Đặt sai vị trí số âm trên trục số", "Nhầm chiều tăng của trục số", "Đánh dấu 0, 1 và nhắc số nhỏ hơn nằm bên trái."],
      ["So sánh phân số khác mẫu bằng tử số", "Bỏ qua mẫu số", "Quy đồng hoặc dùng trục số trước khi kết luận."],
    ],
    extension: { applied: "Phân dạng nhận biết, biểu diễn và so sánh; thêm bài toán thực tế về tỉ số.", advanced: "Bài toán điều kiện để biểu thức hữu tỉ nhận giá trị nguyên và so sánh hữu tỉ có cấu trúc." },
  },
  {
    id: "academic-l2",
    player: "lesson-player-02",
    chapterId: "academic-ch1-so-huu-ti",
    chapterNumber: 1,
    number: 2,
    title: "Cộng, trừ, nhân, chia số hữu tỉ",
    summary: "Thực hiện bốn phép tính với số hữu tỉ và vận dụng tính chất phép tính để tính hợp lí.",
    sgkLocator: "SGK trang 10-13",
    concepts: [
      { title: "Cộng và trừ số hữu tỉ", summary: "Đưa về phân số rồi áp dụng quy tắc cộng, trừ.", keyIdeas: ["quy đồng", "số đối", "dấu ngoặc"], prerequisites: ["Phép tính phân số"] },
      { title: "Nhân và chia số hữu tỉ", summary: "Áp dụng quy tắc nhân phân số và nhân với nghịch đảo khi chia.", keyIdeas: ["rút gọn", "nghịch đảo", "dấu của tích/thương"], prerequisites: ["Phân số"] },
      { title: "Tính hợp lí", summary: "Dùng giao hoán, kết hợp, phân phối để tính nhanh và kiểm soát dấu.", keyIdeas: ["giao hoán", "kết hợp", "phân phối"], prerequisites: ["Tính chất phép toán"] },
    ],
    objectives: ["Thực hiện đúng bốn phép tính số hữu tỉ.", "Vận dụng tính chất phép toán để tính hợp lí.", "Giải bài toán thực tế dùng số hữu tỉ."],
    vocabulary: [["số nghịch đảo", "Hai số khác 0 có tích bằng 1."], ["tính chất phân phối", "Nhân một số với một tổng bằng tổng các tích tương ứng."]],
    mistakes: [
      ["Sai dấu khi cộng/trừ số âm", "Áp dụng dấu ngoặc máy móc", "Tách dấu của số và phép toán, kiểm tra bằng ước lượng."],
      ["Chia phân số nhưng không nhân nghịch đảo", "Nhớ không đầy đủ quy tắc chia", "Viết phép chia thành phép nhân với số nghịch đảo trước."],
      ["Không rút gọn trước khi nhân", "Thiếu chiến lược tính hợp lí", "Tìm thừa số chung và rút gọn chéo trước."],
    ],
    extension: { applied: "Bài toán vận dụng về khối lượng, nhiệt độ, tỉ lệ và biểu thức nhiều phép tính.", advanced: "Rút gọn biểu thức có quy luật, tìm số chưa biết và biến đổi phân số phức tạp." },
  },
  {
    id: "academic-l3",
    player: "lesson-player-03",
    chapterId: "academic-ch1-so-huu-ti",
    chapterNumber: 1,
    number: 3,
    title: "Lũy thừa với số mũ tự nhiên của một số hữu tỉ",
    summary: "Lũy thừa, tích và thương hai lũy thừa cùng cơ số, lũy thừa của lũy thừa.",
    sgkLocator: "SGK trang 16-19",
    concepts: [
      { title: "Lũy thừa", summary: "Lũy thừa bậc n của x là tích của n thừa số x.", keyIdeas: ["cơ số", "số mũ", "x^n"], prerequisites: ["Phép nhân"] },
      { title: "Nhân và chia lũy thừa cùng cơ số", summary: "Cộng số mũ khi nhân và trừ số mũ khi chia trong điều kiện phù hợp.", keyIdeas: ["x^m.x^n", "x^m:x^n", "điều kiện cơ số khác 0"], prerequisites: ["Lũy thừa"] },
      { title: "Lũy thừa của lũy thừa", summary: "Khi nâng lũy thừa lên lũy thừa, nhân các số mũ.", keyIdeas: ["(x^m)^n", "nhân số mũ"], prerequisites: ["Lũy thừa"] },
    ],
    objectives: ["Nhận biết cơ số, số mũ và tính lũy thừa.", "Vận dụng quy tắc nhân/chia lũy thừa cùng cơ số.", "Vận dụng quy tắc lũy thừa của lũy thừa."],
    vocabulary: [["lũy thừa", "Cách viết gọn một tích gồm nhiều thừa số bằng nhau."], ["cơ số", "Số được nhân lặp lại."], ["số mũ", "Cho biết có bao nhiêu thừa số bằng cơ số."]],
    mistakes: [
      ["Nhân cơ số khi nhân hai lũy thừa cùng cơ số", "Nhầm quy tắc tích", "Giữ nguyên cơ số và chỉ cộng số mũ."],
      ["Cộng số mũ trong lũy thừa của lũy thừa", "Lẫn hai quy tắc", "So sánh trực tiếp x^m.x^n với (x^m)^n bằng khai triển ngắn."],
      ["Bỏ qua dấu ngoặc của cơ số âm", "Không phân biệt -a^n và (-a)^n", "Yêu cầu khoanh cơ số trước khi tính."],
    ],
    extension: { applied: "Tìm cơ số hoặc số mũ trong các phương trình lũy thừa đơn giản.", advanced: "Biến đổi biểu thức lũy thừa, so sánh lũy thừa và bài toán chữ số tận cùng ở mức phù hợp." },
  },
  {
    id: "academic-l4",
    player: "lesson-player-04",
    chapterId: "academic-ch1-so-huu-ti",
    chapterNumber: 1,
    number: 4,
    title: "Thứ tự thực hiện các phép tính. Quy tắc chuyển vế",
    summary: "Thực hiện biểu thức đúng thứ tự và giải các bài toán tìm x bằng quy tắc chuyển vế.",
    sgkLocator: "SGK trang 20-22",
    concepts: [
      { title: "Thứ tự thực hiện phép tính", summary: "Ưu tiên ngoặc, lũy thừa, nhân/chia, cộng/trừ.", keyIdeas: ["ngoặc", "lũy thừa", "nhân chia", "cộng trừ"], prerequisites: ["Bốn phép tính", "Lũy thừa"] },
      { title: "Quy tắc chuyển vế", summary: "Chuyển một số hạng từ vế này sang vế kia và đổi dấu số hạng đó.", keyIdeas: ["đẳng thức", "hai vế", "đổi dấu"], prerequisites: ["Số đối", "Đẳng thức"] },
    ],
    objectives: ["Thực hiện đúng thứ tự phép tính trong biểu thức hữu tỉ.", "Vận dụng quy tắc chuyển vế để tìm số chưa biết.", "Kiểm tra nghiệm bằng thay ngược."],
    vocabulary: [["vế trái", "Biểu thức ở bên trái dấu bằng."], ["vế phải", "Biểu thức ở bên phải dấu bằng."], ["chuyển vế", "Chuyển số hạng sang vế kia đồng thời đổi dấu."]],
    mistakes: [
      ["Tính từ trái sang phải bỏ qua ưu tiên", "Không nhớ cấp độ phép tính", "Đánh số thứ tự các phép tính trước khi làm."],
      ["Chuyển vế không đổi dấu", "Nhớ quy tắc thiếu điều kiện", "Viết bước trung gian bằng cách cộng cùng một số vào hai vế."],
      ["Không kiểm tra nghiệm", "Xem tìm x chỉ là thao tác biến đổi", "Thay nghiệm vào đẳng thức ban đầu để kiểm chứng."],
    ],
    extension: { applied: "Biểu thức nhiều tầng và bài toán tìm x phối hợp ngoặc, lũy thừa, chuyển vế.", advanced: "Biến đổi biểu thức hữu tỉ và phương trình có cấu trúc, ưu tiên suy luận hơn thao tác máy móc." },
  },
  {
    id: "academic-l5",
    player: "lesson-player-05",
    chapterId: "academic-ch2-so-thuc",
    chapterNumber: 2,
    number: 5,
    title: "Làm quen với số thập phân vô hạn tuần hoàn",
    summary: "Số thập phân hữu hạn, vô hạn tuần hoàn, chu kì và làm tròn theo độ chính xác.",
    sgkLocator: "SGK trang 26-28",
    concepts: [
      { title: "Số thập phân vô hạn tuần hoàn", summary: "Phần thập phân kéo dài vô hạn và có một nhóm chữ số lặp lại.", keyIdeas: ["chu kì", "viết gọn", "phân biệt hữu hạn"], prerequisites: ["Phép chia"], reps: ["TEXT", "TABLE", "FORMULA"] },
      { title: "Làm tròn theo độ chính xác", summary: "Chọn hàng làm tròn phù hợp với độ chính xác cho trước.", keyIdeas: ["hàng làm tròn", "giá trị gần đúng"], prerequisites: ["Số thập phân"], reps: ["NUMBER_LINE", "TABLE", "REAL_LIFE"] },
    ],
    objectives: ["Nhận biết số thập phân vô hạn tuần hoàn và chu kì.", "Viết gọn số thập phân tuần hoàn.", "Làm tròn số theo độ chính xác cho trước."],
    vocabulary: [["chu kì", "Nhóm chữ số lặp lại mãi trong phần thập phân."], ["độ chính xác", "Mức gần đúng cần đạt khi làm tròn."]],
    mistakes: [
      ["Cho rằng mọi số thập phân vô hạn đều tuần hoàn", "Chỉ chú ý độ dài vô hạn", "Bắt buộc chỉ ra chính xác nhóm chữ số lặp."],
      ["Chọn sai hàng làm tròn", "Nhầm độ chính xác với số chữ số thập phân", "Liên hệ độ chính xác với hàng làm tròn trước khi thao tác."],
    ],
    extension: { applied: "Bài tập nhận dạng chu kì và bài toán gần đúng thực tế." },
  },
  {
    id: "academic-l6",
    player: "lesson-player-06",
    chapterId: "academic-ch2-so-thuc",
    chapterNumber: 2,
    number: 6,
    title: "Số vô tỉ. Căn bậc hai số học",
    summary: "Nhận biết số vô tỉ và căn bậc hai số học của một số không âm.",
    sgkLocator: "SGK trang 29-32",
    concepts: [
      { title: "Số vô tỉ", summary: "Số viết được dưới dạng thập phân vô hạn không tuần hoàn.", keyIdeas: ["không tuần hoàn", "không thuộc Q"], prerequisites: ["Số hữu tỉ", "Thập phân"] },
      { title: "Căn bậc hai số học", summary: "Với a không âm, căn bậc hai số học của a là số không âm có bình phương bằng a.", keyIdeas: ["√a", "không âm", "bình phương"], prerequisites: ["Bình phương", "Lũy thừa"] },
    ],
    objectives: ["Nhận biết số vô tỉ.", "Tính căn bậc hai số học của số là bình phương hoàn chỉnh.", "Ước lượng và sử dụng căn bậc hai trong bài toán đơn giản."],
    vocabulary: [["số vô tỉ", "Số thập phân vô hạn không có chu kì lặp."], ["căn bậc hai số học", "Số không âm mà bình phương bằng số đã cho."]],
    mistakes: [
      ["Cho √a có hai giá trị ±", "Lẫn căn bậc hai với nghiệm phương trình x²=a", "Nhấn mạnh căn bậc hai số học luôn không âm."],
      ["Cho mọi số có căn đều hữu tỉ", "Chưa phân biệt bình phương hoàn chỉnh", "Kiểm tra xem số dưới dấu căn có là bình phương của số hữu tỉ quen thuộc."],
    ],
    extension: { applied: "Ước lượng căn và bài toán hình học/độ dài.", advanced: "So sánh và biến đổi biểu thức căn ở mức chỉ dùng kiến thức lớp 7." },
  },
  {
    id: "academic-l7",
    player: "lesson-player-07",
    chapterId: "academic-ch2-so-thuc",
    chapterNumber: 2,
    number: 7,
    title: "Tập hợp các số thực",
    summary: "Tập số thực, biểu diễn trên trục số, thứ tự và giá trị tuyệt đối.",
    sgkLocator: "SGK trang 33-36",
    concepts: [
      { title: "Tập hợp số thực", summary: "Số thực gồm số hữu tỉ và số vô tỉ.", keyIdeas: ["R", "Q và I", "quan hệ tập hợp"], prerequisites: ["Số hữu tỉ", "Số vô tỉ"] },
      { title: "Trục số thực", summary: "Mỗi số thực tương ứng với một điểm trên trục số.", keyIdeas: ["điểm biểu diễn", "thứ tự"], prerequisites: ["Trục số"] },
      { title: "Giá trị tuyệt đối", summary: "Khoảng cách từ điểm biểu diễn số đến 0.", keyIdeas: ["|x|", "khoảng cách", "không âm"], prerequisites: ["Trục số"] },
    ],
    objectives: ["Nhận biết và phân loại số thực.", "So sánh số thực và biểu diễn trên trục số.", "Tính và giải thích giá trị tuyệt đối."],
    vocabulary: [["số thực", "Tên chung cho số hữu tỉ và số vô tỉ."], ["giá trị tuyệt đối", "Khoảng cách từ số đó đến 0 trên trục số."]],
    mistakes: [
      ["Nhầm số vô tỉ không phải số thực", "Chưa hình dung quan hệ tập hợp", "Dùng sơ đồ bao hàm Q và I trong R."],
      ["Cho |x| có thể âm", "Nhớ biểu thức nhưng quên nghĩa khoảng cách", "Quay lại định nghĩa khoảng cách trên trục số."],
    ],
    extension: { applied: "Phân loại tập hợp số và biểu thức có dấu căn/giá trị tuyệt đối.", advanced: "Bài toán thứ tự và giá trị tuyệt đối có điều kiện." },
  },
  {
    id: "academic-l8",
    player: "lesson-player-08",
    chapterId: "academic-ch3-goc-song-song",
    chapterNumber: 3,
    number: 8,
    title: "Góc ở vị trí đặc biệt. Tia phân giác của một góc",
    summary: "Góc kề bù, đối đỉnh, vuông góc và tia phân giác.",
    sgkLocator: "SGK trang 40-45",
    concepts: [
      { title: "Góc kề bù và góc đối đỉnh", summary: "Nhận dạng và sử dụng quan hệ số đo.", keyIdeas: ["kề nhau", "hai cạnh đối nhau", "tổng 180°", "đối đỉnh bằng nhau"], prerequisites: ["Góc"], reps: ["DIAGRAM", "TEXT"] },
      { title: "Hai đường thẳng vuông góc", summary: "Hai đường thẳng cắt nhau tạo góc vuông.", keyIdeas: ["90°", "kí hiệu ⟂"], prerequisites: ["Góc vuông"], reps: ["DIAGRAM"] },
      { title: "Tia phân giác", summary: "Tia nằm trong góc và chia góc thành hai góc bằng nhau.", keyIdeas: ["nằm trong góc", "hai góc bằng nhau"], prerequisites: ["Góc"], reps: ["DIAGRAM"] },
    ],
    objectives: ["Nhận biết các góc ở vị trí đặc biệt.", "Tính số đo góc bằng quan hệ kề bù/đối đỉnh.", "Nhận biết và vận dụng tia phân giác."],
    vocabulary: [["góc đối đỉnh", "Hai góc có mỗi cạnh của góc này là tia đối của một cạnh góc kia."], ["tia phân giác", "Tia chia một góc thành hai góc bằng nhau."]],
    mistakes: [
      ["Nhầm góc kề bù với đối đỉnh", "Chỉ nhìn hai góc chung đỉnh", "Kiểm tra quan hệ của từng cặp cạnh."],
      ["Cho mọi cặp góc bằng nhau đều đối đỉnh", "Suy từ số đo thay vì vị trí", "Xác định vị trí hình học trước rồi mới dùng tính chất."],
      ["Dùng tia phân giác khi tia không nằm trong góc", "Thiếu điều kiện định nghĩa", "Kiểm tra cả vị trí tia và hai góc bằng nhau."],
    ],
    extension: { applied: "Bài tính góc phối hợp đối đỉnh, kề bù, vuông góc và phân giác.", advanced: "Tính góc bằng chuỗi quan hệ và đường phụ ở mức phù hợp." },
  },
  {
    id: "academic-l9",
    player: "lesson-player-09",
    chapterId: "academic-ch3-goc-song-song",
    chapterNumber: 3,
    number: 9,
    title: "Hai đường thẳng song song và dấu hiệu nhận biết",
    summary: "Góc so le trong, đồng vị và dấu hiệu để kết luận hai đường thẳng song song.",
    sgkLocator: "SGK trang 46-49",
    concepts: [
      { title: "Góc so le trong và đồng vị", summary: "Các cặp góc tạo bởi một đường cắt hai đường thẳng.", keyIdeas: ["vị trí", "đường cắt"], prerequisites: ["Góc"], reps: ["DIAGRAM"] },
      { title: "Dấu hiệu nhận biết song song", summary: "Dùng cặp góc so le trong bằng nhau hoặc góc đồng vị bằng nhau để nhận biết.", keyIdeas: ["điều kiện", "kết luận song song"], prerequisites: ["Góc so le trong", "Góc đồng vị"], reps: ["DIAGRAM", "TEXT"] },
    ],
    objectives: ["Nhận biết cặp góc so le trong và đồng vị.", "Vận dụng dấu hiệu để kết luận hai đường thẳng song song.", "Giải thích được căn cứ của kết luận song song."],
    vocabulary: [["góc so le trong", "Hai góc nằm giữa hai đường thẳng và ở hai phía của đường cắt."], ["góc đồng vị", "Hai góc ở cùng vị trí tương ứng khi một đường cắt hai đường."]],
    mistakes: [
      ["Nhận sai cặp góc so le trong", "Không xác định vùng trong và phía đường cắt", "Tô vùng giữa hai đường và đánh dấu hai phía đường cắt."],
      ["Dùng hai góc bằng nhau bất kì để kết luận song song", "Quên yêu cầu vị trí đặc biệt", "Yêu cầu gọi đúng tên cặp góc trước khi kết luận."],
    ],
    extension: { applied: "Bài chứng minh song song bằng góc, vuông góc với cùng một đường.", advanced: "Chuỗi chứng minh song song kết hợp phân giác và góc đặc biệt." },
  },
  {
    id: "academic-l10",
    player: "lesson-player-10",
    chapterId: "academic-ch3-goc-song-song",
    chapterNumber: 3,
    number: 10,
    title: "Tiên đề Euclid. Tính chất của hai đường thẳng song song",
    summary: "Tiên đề Euclid và quan hệ góc khi một đường thẳng cắt hai đường thẳng song song.",
    sgkLocator: "SGK trang 51-54",
    concepts: [
      { title: "Tiên đề Euclid", summary: "Qua một điểm ngoài một đường thẳng chỉ có một đường thẳng song song với đường đó.", keyIdeas: ["điểm ngoài", "duy nhất", "song song"], prerequisites: ["Hai đường song song"], reps: ["DIAGRAM", "TEXT"] },
      { title: "Tính chất hai đường song song", summary: "Nếu một đường cắt hai đường song song thì các góc so le trong, đồng vị bằng nhau và các góc trong cùng phía bù nhau.", keyIdeas: ["so le trong", "đồng vị", "trong cùng phía"], prerequisites: ["Dấu hiệu song song"], reps: ["DIAGRAM", "FORMULA"] },
    ],
    objectives: ["Phát biểu và hiểu tiên đề Euclid.", "Tính số đo góc khi biết hai đường thẳng song song.", "Suy luận bằng tính chất song song."],
    vocabulary: [["tiên đề Euclid", "Khẳng định nền tảng về đường song song qua một điểm ngoài đường thẳng."], ["góc trong cùng phía", "Hai góc ở giữa hai đường và cùng phía của đường cắt."]],
    mistakes: [
      ["Cho qua một điểm ngoài có nhiều đường song song", "Không hiểu tính duy nhất", "Vẽ thử nhiều đường qua cùng điểm và kiểm tra giao nhau."],
      ["Dùng tính chất song song khi chưa có điều kiện song song", "Đảo chiều suy luận thiếu căn cứ", "Tách rõ 'biết song song → suy góc' và 'biết góc → chứng minh song song'."],
    ],
    extension: { applied: "Tính góc và chứng minh quan hệ bằng chuỗi tính chất song song.", advanced: "Bài góc phức hợp cần kẻ đường phụ song song hoặc phân giác." },
  },
  {
    id: "academic-l11",
    player: "lesson-player-11",
    chapterId: "academic-ch3-goc-song-song",
    chapterNumber: 3,
    number: 11,
    title: "Định lí và chứng minh định lí",
    summary: "Giả thiết, kết luận, cách viết GT-KL và chuỗi lập luận chứng minh.",
    sgkLocator: "SGK trang 55-57",
    concepts: [
      { title: "Định lí", summary: "Khẳng định toán học được suy ra bằng lập luận.", keyIdeas: ["giả thiết", "kết luận", "chứng minh"], prerequisites: ["Suy luận"] },
      { title: "Chứng minh", summary: "Chuỗi lập luận từ giả thiết và kiến thức đã biết đến kết luận.", keyIdeas: ["căn cứ", "bước suy luận", "không dùng điều phải chứng minh"], prerequisites: ["Tính chất góc và song song"], reps: ["TEXT", "DIAGRAM"] },
    ],
    objectives: ["Xác định giả thiết và kết luận của định lí.", "Viết GT-KL bằng lời và kí hiệu.", "Trình bày chứng minh định lí đơn giản."],
    vocabulary: [["giả thiết", "Điều bài toán cho hoặc điều được giả sử đúng."], ["kết luận", "Điều cần chứng minh hoặc suy ra."], ["chứng minh", "Dùng các lập luận có căn cứ để đi từ giả thiết đến kết luận."]],
    mistakes: [
      ["Đảo giả thiết và kết luận", "Chưa phân biệt điều cho và điều cần suy ra", "Dùng mẫu 'Nếu ... thì ...' để tách hai phần."],
      ["Dùng kết luận làm lí do", "Lập luận vòng tròn", "Đánh dấu mỗi dòng chứng minh phải dựa trên GT hoặc kiến thức đã có."],
    ],
    extension: { applied: "Chứng minh ngắn về góc, song song và vuông góc.", advanced: "Bài chứng minh nhiều bước; ưu tiên phát hiện đường phụ nhưng chỉ sau khi vững GT-KL." },
  },
  {
    id: "academic-l12",
    player: "lesson-player-12",
    chapterId: "academic-ch4-tam-giac-bang-nhau",
    chapterNumber: 4,
    number: 12,
    title: "Tổng các góc trong một tam giác",
    summary: "Định lí tổng ba góc của tam giác bằng 180° và vận dụng tính góc.",
    sgkLocator: "SGK trang 60-62",
    concepts: [
      { title: "Tổng ba góc trong tam giác", summary: "Tổng số đo ba góc trong mọi tam giác bằng 180°.", keyIdeas: ["180°", "tam giác", "lập luận bằng đường song song"], prerequisites: ["Góc", "Đường thẳng song song"], reps: ["DIAGRAM", "FORMULA"] },
      { title: "Góc ngoài của tam giác", summary: "Góc kề bù với một góc trong và liên hệ với hai góc trong không kề.", keyIdeas: ["kề bù", "hai góc trong không kề"], prerequisites: ["Góc kề bù"], reps: ["DIAGRAM", "FORMULA"] },
    ],
    objectives: ["Giải thích định lí tổng ba góc trong tam giác bằng 180°.", "Tính góc còn lại của tam giác.", "Vận dụng quan hệ góc ngoài trong bài toán đơn giản."],
    vocabulary: [["góc trong tam giác", "Góc tạo bởi hai cạnh của tam giác tại một đỉnh."], ["góc ngoài", "Góc kề bù với một góc trong của tam giác."]],
    mistakes: [
      ["Cho tổng góc tam giác phụ thuộc hình vẽ", "Tin vào hình hơn định lí", "Dùng định lí 180° cho mọi tam giác bất kể dạng."],
      ["Nhầm góc ngoài với góc đối đỉnh", "Nhận dạng vị trí sai", "Xác định cạnh kéo dài và góc kề bù với góc trong."],
    ],
    extension: { applied: "Bài tính góc phối hợp kề bù, đối đỉnh, song song.", advanced: "Tính góc bằng phát hiện tam giác đặc biệt hoặc vẽ đường phụ sau khi mastery." },
  },
  {
    id: "academic-l13",
    player: "lesson-player-13",
    chapterId: "academic-ch4-tam-giac-bang-nhau",
    chapterNumber: 4,
    number: 13,
    title: "Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác",
    summary: "Khái niệm hai tam giác bằng nhau và trường hợp cạnh-cạnh-cạnh (c.c.c).",
    sgkLocator: "SGK trang 63-67",
    concepts: [
      { title: "Hai tam giác bằng nhau", summary: "Các cạnh và góc tương ứng bằng nhau theo đúng thứ tự tương ứng.", keyIdeas: ["đỉnh tương ứng", "cạnh tương ứng", "góc tương ứng"], prerequisites: ["Tam giác"], reps: ["DIAGRAM", "TEXT"] },
      { title: "Trường hợp c.c.c", summary: "Ba cạnh tương ứng bằng nhau thì hai tam giác bằng nhau.", keyIdeas: ["ba cặp cạnh", "thứ tự tương ứng", "suy góc/cạnh còn lại"], prerequisites: ["Hai tam giác bằng nhau"], reps: ["DIAGRAM"] },
    ],
    objectives: ["Nhận biết và viết đúng hai tam giác bằng nhau theo thứ tự tương ứng.", "Giải thích hai tam giác bằng nhau theo trường hợp c.c.c.", "Suy ra các yếu tố tương ứng và lập luận hình học đơn giản."],
    vocabulary: [["hai tam giác bằng nhau", "Hai tam giác có các cạnh và góc tương ứng bằng nhau."], ["cạnh tương ứng", "Hai cạnh giữ cùng vị trí trong hai tam giác được so sánh."]],
    mistakes: [
      ["Viết sai thứ tự đỉnh tương ứng", "Chỉ nhìn vị trí hình vẽ", "Lập bảng cặp cạnh/góc tương ứng trước khi viết kí hiệu."],
      ["Dùng c.c.c khi chỉ biết hai cạnh", "Chưa kiểm đủ điều kiện", "Đếm đủ ba cặp cạnh tương ứng trước khi kết luận."],
    ],
    extension: { applied: "Chứng minh đoạn thẳng/góc bằng nhau qua hai tam giác bằng nhau.", advanced: "Bài c.c.c có điểm phụ hoặc chuỗi tam giác bằng nhau." },
  },
  {
    id: "academic-l14",
    player: "lesson-player-14",
    chapterId: "academic-ch4-tam-giac-bang-nhau",
    chapterNumber: 4,
    number: 14,
    title: "Trường hợp bằng nhau thứ hai và thứ ba của tam giác",
    summary: "Trường hợp cạnh-góc-cạnh (c.g.c) và góc-cạnh-góc (g.c.g).",
    sgkLocator: "SGK trang 70-74",
    concepts: [
      { title: "Cạnh-góc-cạnh (c.g.c)", summary: "Hai cạnh và góc xen giữa tương ứng bằng nhau.", keyIdeas: ["góc xen giữa", "hai cạnh"], prerequisites: ["Tam giác bằng nhau"], reps: ["DIAGRAM"] },
      { title: "Góc-cạnh-góc (g.c.g)", summary: "Hai góc và cạnh xen giữa tương ứng bằng nhau.", keyIdeas: ["cạnh xen giữa", "hai góc"], prerequisites: ["Tổng góc tam giác"], reps: ["DIAGRAM"] },
    ],
    objectives: ["Nhận biết góc xen giữa và cạnh xen giữa.", "Chứng minh hai tam giác bằng nhau theo c.g.c.", "Chứng minh hai tam giác bằng nhau theo g.c.g."],
    vocabulary: [["góc xen giữa", "Góc nằm giữa hai cạnh đang xét."], ["cạnh xen giữa", "Cạnh nằm giữa hai góc đang xét."]],
    mistakes: [
      ["Dùng góc không xen giữa cho c.g.c", "Không kiểm vị trí yếu tố", "Tô hai cạnh rồi xác định đúng góc chung đỉnh của chúng."],
      ["Dùng cạnh không xen giữa cho g.c.g", "Nhận dạng hình thức thay vì cấu trúc", "Đánh dấu hai góc rồi tìm cạnh nối hai đỉnh góc đó."],
    ],
    extension: { applied: "Chứng minh hình học bằng c.g.c/g.c.g và suy yếu tố tương ứng.", advanced: "Bài cần tạo tam giác bằng nhau bằng đường phụ, phân giác hoặc đoạn bằng nhau." },
  },
  {
    id: "academic-l15",
    player: "lesson-player-15",
    chapterId: "academic-ch4-tam-giac-bang-nhau",
    chapterNumber: 4,
    number: 15,
    title: "Các trường hợp bằng nhau của tam giác vuông",
    summary: "Các trường hợp suy từ c.g.c/g.c.g và trường hợp đặc biệt cạnh huyền-cạnh góc vuông.",
    sgkLocator: "SGK trang 77-79",
    concepts: [
      { title: "Tam giác vuông và trường hợp bằng nhau", summary: "Khai thác góc vuông cố định để rút gọn điều kiện bằng nhau.", keyIdeas: ["cạnh góc vuông", "góc nhọn", "cạnh huyền"], prerequisites: ["Tam giác vuông", "c.g.c", "g.c.g"], reps: ["DIAGRAM"] },
      { title: "Cạnh huyền-cạnh góc vuông", summary: "Nếu cạnh huyền và một cạnh góc vuông tương ứng bằng nhau thì hai tam giác vuông bằng nhau.", keyIdeas: ["đúng tam giác vuông", "cạnh huyền", "cạnh góc vuông"], prerequisites: ["Tam giác bằng nhau"], reps: ["DIAGRAM"] },
    ],
    objectives: ["Nhận biết các trường hợp bằng nhau của tam giác vuông.", "Vận dụng cạnh huyền-cạnh góc vuông.", "Lập luận chứng minh trong cấu hình tam giác vuông."],
    vocabulary: [["cạnh huyền", "Cạnh đối diện góc vuông."], ["cạnh góc vuông", "Một trong hai cạnh tạo nên góc vuông."]],
    mistakes: [
      ["Nhầm cạnh huyền với cạnh dài nhìn trên hình", "Dựa vào hình vẽ", "Xác định góc vuông trước, cạnh đối diện mới là cạnh huyền."],
      ["Dùng trường hợp đặc biệt cho tam giác không vuông", "Quên điều kiện tiên quyết", "Kiểm tra kí hiệu góc vuông trước khi áp dụng."],
    ],
    extension: { applied: "Chứng minh khoảng cách, vuông góc và đoạn bằng nhau bằng tam giác vuông.", advanced: "Khai thác nhiều tam giác vuông chung cạnh huyền/cạnh góc vuông trong một cấu hình." },
  },
  {
    id: "academic-l16",
    player: "lesson-player-16",
    chapterId: "academic-ch4-tam-giac-bang-nhau",
    chapterNumber: 4,
    number: 16,
    title: "Tam giác cân. Đường trung trực của đoạn thẳng",
    summary: "Tam giác cân, tính chất góc ở đáy và đường trung trực của đoạn thẳng.",
    sgkLocator: "SGK trang 80-84",
    concepts: [
      { title: "Tam giác cân", summary: "Tam giác có hai cạnh bằng nhau; hai góc ở đáy bằng nhau.", keyIdeas: ["cạnh bên", "cạnh đáy", "góc ở đáy", "góc ở đỉnh"], prerequisites: ["Tam giác"], reps: ["DIAGRAM", "TEXT"] },
      { title: "Đường trung trực", summary: "Đường thẳng vuông góc với đoạn thẳng tại trung điểm và chứa các điểm cách đều hai đầu đoạn.", keyIdeas: ["trung điểm", "vuông góc", "cách đều"], prerequisites: ["Trung điểm", "Vuông góc"], reps: ["DIAGRAM", "REAL_LIFE"] },
    ],
    objectives: ["Nhận biết tam giác cân và vận dụng tính chất.", "Nhận biết đường trung trực và tính chất điểm cách đều hai đầu đoạn.", "Vẽ đường trung trực bằng dụng cụ học tập."],
    vocabulary: [["tam giác cân", "Tam giác có hai cạnh bằng nhau."], ["góc ở đáy", "Hai góc kề cạnh đáy của tam giác cân."], ["đường trung trực", "Đường vuông góc với đoạn thẳng tại trung điểm của đoạn đó."]],
    mistakes: [
      ["Cho tam giác có hai góc bằng nhau chưa suy được hai cạnh bằng nhau", "Chưa dùng định lí đảo phù hợp", "Làm rõ chiều suy luận và điều được phép sử dụng trong bài."],
      ["Nhầm đường trung tuyến với đường trung trực", "Chỉ chú ý đi qua trung điểm", "Nhấn mạnh đường trung trực là một đường thẳng vuông góc tại trung điểm."],
    ],
    extension: { applied: "Bài toán điểm cách đều, dựng trung trực và chứng minh tam giác cân.", advanced: "Bài hình kết hợp tam giác cân, phân giác, trung trực và tam giác bằng nhau." },
  },
  {
    id: "academic-l17",
    player: "lesson-player-17",
    chapterId: "academic-ch5-du-lieu",
    chapterNumber: 5,
    number: 17,
    title: "Thu thập và phân loại dữ liệu",
    summary: "Thu thập dữ liệu bằng phỏng vấn/bảng hỏi, phân loại dữ liệu và nhận biết tính đại diện.",
    sgkLocator: "SGK trang 88-92",
    concepts: [
      { title: "Thu thập dữ liệu", summary: "Thu thập thông tin theo câu hỏi và đối tượng nghiên cứu phù hợp.", keyIdeas: ["phỏng vấn", "bảng hỏi", "mẫu"], prerequisites: ["Bảng dữ liệu"], reps: ["TABLE", "REAL_LIFE"] },
      { title: "Phân loại dữ liệu", summary: "Nhận biết dữ liệu số và dữ liệu không phải số; tổ chức theo nhóm.", keyIdeas: ["loại dữ liệu", "phân nhóm"], prerequisites: ["Thông tin"], reps: ["TABLE", "TEXT"] },
      { title: "Tính đại diện", summary: "Dữ liệu cần phản ánh phù hợp đối tượng cần tìm hiểu.", keyIdeas: ["đối tượng khảo sát", "mẫu đại diện", "thiên lệch"], prerequisites: ["Thu thập dữ liệu"], reps: ["TABLE", "REAL_LIFE"] },
    ],
    objectives: ["Thu thập dữ liệu bằng phỏng vấn hoặc bảng hỏi.", "Phân loại dữ liệu.", "Nhận biết tính đại diện của dữ liệu thu thập."],
    vocabulary: [["dữ liệu", "Thông tin được thu thập để tìm hiểu một vấn đề."], ["tính đại diện", "Mức độ dữ liệu phản ánh đúng nhóm đối tượng cần tìm hiểu."]],
    mistakes: [
      ["Khảo sát nhóm quá lệch so với đối tượng cần kết luận", "Chưa hiểu tính đại diện", "So sánh rõ 'ai được hỏi' và 'ta muốn biết về ai'."],
      ["Trộn dữ liệu định lượng và mô tả mà không phân loại", "Chưa xác định kiểu dữ liệu", "Hỏi dữ liệu là con số đo/đếm hay là nhãn/loại."],
    ],
    extension: { applied: "Thiết kế bảng hỏi nhỏ, phát hiện mẫu thiên lệch và chỉnh cách thu thập." },
  },
  {
    id: "academic-l18",
    player: "lesson-player-18",
    chapterId: "academic-ch5-du-lieu",
    chapterNumber: 5,
    number: 18,
    title: "Biểu đồ hình quạt tròn",
    summary: "Đọc, mô tả và biểu diễn dữ liệu bằng biểu đồ hình quạt tròn; nhận ra vấn đề/quy luật đơn giản.",
    sgkLocator: "SGK trang 93-99",
    concepts: [
      { title: "Biểu đồ hình quạt tròn", summary: "Biểu diễn các phần trong toàn bộ dữ liệu bằng các hình quạt của một hình tròn.", keyIdeas: ["toàn bộ = 100%", "tỉ lệ", "chú giải", "tiêu đề"], prerequisites: ["Tỉ số phần trăm"], reps: ["DIAGRAM", "TABLE", "REAL_LIFE"] },
      { title: "Đọc và mô tả dữ liệu", summary: "So sánh các phần và chuyển giữa tỉ lệ với số lượng khi biết tổng.", keyIdeas: ["lớn nhất/nhỏ nhất", "phần trăm", "số lượng"], prerequisites: ["Phần trăm"], reps: ["DIAGRAM", "FORMULA"] },
    ],
    objectives: ["Đọc và mô tả dữ liệu từ biểu đồ hình quạt tròn.", "Biểu diễn dữ liệu vào biểu đồ hình quạt tròn cho sẵn.", "Nhận ra vấn đề hoặc quy luật đơn giản từ biểu đồ."],
    vocabulary: [["biểu đồ hình quạt tròn", "Biểu đồ dùng các phần của hình tròn để biểu diễn tỉ lệ các nhóm trong toàn bộ."], ["chú giải", "Phần cho biết màu/kí hiệu ứng với nhóm dữ liệu nào."]],
    mistakes: [
      ["Cộng các tỉ lệ không được 100% nhưng vẫn chấp nhận", "Không kiểm tra toàn bộ", "Luôn kiểm tổng tỉ lệ của các phần."],
      ["So sánh chỉ bằng cảm giác diện tích", "Không đọc số liệu/chú giải", "Đọc tỉ lệ ghi trên biểu đồ trước khi kết luận."],
    ],
    extension: { applied: "Chuyển phần trăm thành số lượng, so sánh nhiều nhóm và phát hiện thông tin đáng chú ý." },
  },
  {
    id: "academic-l19",
    player: "lesson-player-19",
    chapterId: "academic-ch5-du-lieu",
    chapterNumber: 5,
    number: 19,
    title: "Biểu đồ đoạn thẳng",
    summary: "Đọc, vẽ và phân tích biểu đồ đoạn thẳng để mô tả sự thay đổi theo thời gian.",
    sgkLocator: "SGK trang 100-105",
    concepts: [
      { title: "Biểu đồ đoạn thẳng", summary: "Biểu diễn sự thay đổi của một đại lượng theo thời gian bằng các điểm nối liên tiếp.", keyIdeas: ["trục thời gian", "trục đại lượng", "điểm dữ liệu", "đoạn nối"], prerequisites: ["Trục tọa độ đơn giản", "Dữ liệu"], reps: ["DIAGRAM", "TABLE", "REAL_LIFE"] },
      { title: "Phân tích xu hướng", summary: "Nhận biết tăng, giảm, ổn định và thay đổi nổi bật từ các đoạn.", keyIdeas: ["xu hướng", "mức thay đổi", "thời điểm"], prerequisites: ["So sánh số"], reps: ["DIAGRAM", "TEXT"] },
    ],
    objectives: ["Đọc và mô tả dữ liệu từ biểu đồ đoạn thẳng.", "Vẽ biểu đồ đoạn thẳng từ bảng dữ liệu.", "Nhận ra xu hướng hoặc quy luật đơn giản từ biểu đồ."],
    vocabulary: [["biểu đồ đoạn thẳng", "Biểu đồ nối các điểm dữ liệu theo thứ tự thời gian để thấy sự thay đổi."], ["xu hướng", "Chiều biến đổi chung như tăng, giảm hoặc gần ổn định."]],
    mistakes: [
      ["Nối điểm sai thứ tự thời gian", "Không kiểm trục ngang", "Sắp xếp thời điểm trước khi đặt điểm và nối."],
      ["Kết luận tăng giảm chỉ từ độ dốc hình vẽ mà bỏ thang đo", "Không đọc trục", "Đọc giá trị hai đầu đoạn trước khi mô tả xu hướng."],
    ],
    extension: { applied: "So sánh giai đoạn, tính mức tăng/giảm và giải thích dữ liệu thực tế." },
  },
];

const chapterDefs: AcademicChapter[] = [
  {
    schemaVersion: "1.0",
    id: "academic-ch1-so-huu-ti",
    number: 1,
    title: "Số hữu tỉ",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    summary: "Tập hợp số hữu tỉ, bốn phép tính, lũy thừa, thứ tự thực hiện phép tính và quy tắc chuyển vế.",
    lessonIds: configs.filter((item) => item.chapterNumber === 1).map((item) => item.id),
    sourceRefs: [
      primary("SGK trang 5-24", "Chương I và các bài 1-4; SGK quyết định thứ tự và chuẩn kiến thức."),
      practice("SBT Chương I", "Củng cố theo từng bài."),
      supplement("Tài liệu học tập Chương 1", "Phân dạng, vận dụng và nâng cao có kiểm soát."),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  },
  {
    schemaVersion: "1.0",
    id: "academic-ch2-so-thuc",
    number: 2,
    title: "Số thực",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    summary: "Số thập phân vô hạn tuần hoàn, số vô tỉ, căn bậc hai số học và tập hợp các số thực.",
    lessonIds: configs.filter((item) => item.chapterNumber === 2).map((item) => item.id),
    sourceRefs: [
      primary("SGK trang 26-39", "Chương II và các bài 5-7."),
      practice("SBT Chương II", "Củng cố."),
      supplement("Tài liệu học tập Chương 2", "Phân dạng và vận dụng."),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  },
  {
    schemaVersion: "1.0",
    id: "academic-ch3-goc-song-song",
    number: 3,
    title: "Góc và đường thẳng song song",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    summary: "Góc ở vị trí đặc biệt, tia phân giác, hai đường thẳng song song, tiên đề Euclid, định lí và chứng minh.",
    lessonIds: configs.filter((item) => item.chapterNumber === 3).map((item) => item.id),
    sourceRefs: [
      primary("SGK trang 40-59", "Chương III và các bài 8-11."),
      practice("SBT Chương III", "Củng cố hình học."),
      supplement("Tài liệu học tập Chương 3", "Phân dạng và bài chứng minh."),
      advanced("Chuyên đề nâng cao về góc", "Chỉ mở sau mastery."),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  },
  {
    schemaVersion: "1.0",
    id: "academic-ch4-tam-giac-bang-nhau",
    number: 4,
    title: "Tam giác bằng nhau",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    summary: "Tổng góc tam giác, các trường hợp bằng nhau của tam giác và tam giác vuông, tam giác cân, đường trung trực.",
    lessonIds: configs.filter((item) => item.chapterNumber === 4).map((item) => item.id),
    sourceRefs: [
      primary("SGK trang 60-87", "Chương IV và các bài 12-16."),
      practice("SBT Chương IV", "Củng cố."),
      supplement("Tài liệu học tập Chương 4", "Phân dạng chứng minh."),
      advanced("Chuyên đề nâng cao hình học lớp 7", "Đường phụ, tam giác đặc biệt và chuỗi chứng minh chỉ sau mastery."),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  },
  {
    schemaVersion: "1.0",
    id: "academic-ch5-du-lieu",
    number: 5,
    title: "Thu thập và biểu diễn dữ liệu",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    summary: "Thu thập, phân loại, đánh giá tính đại diện và biểu diễn/phân tích dữ liệu bằng biểu đồ hình quạt tròn, biểu đồ đoạn thẳng.",
    lessonIds: configs.filter((item) => item.chapterNumber === 5).map((item) => item.id),
    sourceRefs: [
      primary("SGK trang 88-108", "Chương V và các bài 17-19."),
      practice("SBT Chương V", "Củng cố đọc và biểu diễn dữ liệu."),
      supplement("Tài liệu học tập Chương 5", "Vận dụng dữ liệu thực tế."),
    ],
    qualityStatus: "ACADEMIC_VERIFIED",
  },
];

export const academicSemester1Chapters = chapterDefs;
export const academicSemester1Lessons = configs.map(makeLesson);

export const academicSemester1Activities: AcademicActivity[] = [
  {
    schemaVersion: "1.0",
    id: "academic-activity-geogebra",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: "Vẽ hình đơn giản với phần mềm GeoGebra",
    summary:
      "Hoạt động thực hành trải nghiệm giúp học sinh dùng công cụ số để vẽ và quan sát các hình, quan hệ hình học đơn giản.",
    skills: ["Sử dụng công cụ hình học động", "Vẽ hình chính xác", "Quan sát và kiểm tra quan hệ hình học"],
    sourceRefs: [
      primary("SGK trang 110-114", "Hoạt động thực hành trải nghiệm theo SGK."),
    ],
  },
  {
    schemaVersion: "1.0",
    id: "academic-activity-dan-so",
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: "Dân số và cơ cấu dân số Việt Nam",
    summary:
      "Hoạt động thực hành trải nghiệm dùng dữ liệu dân số để đọc, mô tả và biểu diễn thông tin thống kê.",
    skills: ["Đọc dữ liệu thực tế", "Biểu diễn dữ liệu", "Rút ra nhận xét từ số liệu"],
    sourceRefs: [
      primary("SGK trang 115-117", "Hoạt động thực hành trải nghiệm theo SGK."),
    ],
  },
];
