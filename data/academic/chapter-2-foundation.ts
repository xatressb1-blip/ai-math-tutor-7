import type { AcademicChapter, AcademicLesson } from "@/types/academic";

const primary = (locator: string, note: string) => ({
  sourceId: "src-sgk-kntt-t1",
  role: "PRIMARY" as const,
  locator,
  note,
});

const practice = (locator: string, note: string) => ({
  sourceId: "src-sbt-kntt-t1",
  role: "PRACTICE" as const,
  locator,
  note,
});

const supplement = (locator: string, note: string) => ({
  sourceId: "src-hoc-tap-kntt",
  role: "ENRICHMENT" as const,
  locator,
  note,
});

export const academicChapter2: AcademicChapter = {
  schemaVersion: "1.0",
  id: "academic-ch2-so-thuc",
  number: 2,
  title: "Số thực",
  grade: 7,
  semester: 1,
  curriculum: "KNTT",
  summary:
    "Nền tảng học thuật cho Chương II: số thập phân vô hạn tuần hoàn, số vô tỉ, căn bậc hai số học, tập hợp số thực, thứ tự và giá trị tuyệt đối.",
  lessonIds: [
    "academic-lesson-5-thap-phan-vo-han-tuan-hoan",
    "academic-lesson-6-so-vo-ti-can-bac-hai",
    "academic-lesson-7-tap-hop-so-thuc",
  ],
  sourceRefs: [
    primary("SGK trang 26-38", "Chương II và ba bài 5-7."),
    supplement("Phần Chương 2, khoảng trang tài liệu 29-39", "Dạng toán và hệ thống hóa trọng tâm."),
  ],
  qualityStatus: "CONTENT_READY",
};

export const academicChapter2Lessons: AcademicLesson[] = [
  {
    schemaVersion: "1.0",
    id: "academic-lesson-5-thap-phan-vo-han-tuan-hoan",
    lessonPlayerId: "lesson-player-05",
    chapterId: academicChapter2.id,
    chapterNumber: 2,
    lessonNumber: 5,
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: "Làm quen với số thập phân vô hạn tuần hoàn",
    summary:
      "Nhận biết số thập phân hữu hạn và vô hạn tuần hoàn, hiểu chu kì và làm tròn số theo độ chính xác cho trước.",
    estimatedMinutes: 35,
    objectives: [
      { id: "o5-1", statement: "Nhận biết được số thập phân hữu hạn và số thập phân vô hạn tuần hoàn.", bloom: "UNDERSTAND", required: true, masteryThreshold: 70 },
      { id: "o5-2", statement: "Nhận biết và viết được chu kì của số thập phân vô hạn tuần hoàn.", bloom: "APPLY", required: true, masteryThreshold: 70 },
      { id: "o5-3", statement: "Làm tròn được số thập phân với độ chính xác cho trước.", bloom: "APPLY", required: true, masteryThreshold: 70 },
    ],
    concepts: [
      { id: "c5-1", title: "Số thập phân vô hạn tuần hoàn", summary: "Dạng thập phân có một chữ số hoặc một nhóm chữ số lặp lại mãi.", keyIdeas: ["chu kì", "cách viết gọn", "phân biệt hữu hạn và vô hạn tuần hoàn"], prerequisites: ["Số hữu tỉ", "Phép chia"], representations: ["TEXT", "FORMULA", "TABLE"] },
      { id: "c5-2", title: "Làm tròn theo độ chính xác", summary: "Liên hệ độ chính xác cho trước với hàng làm tròn phù hợp.", keyIdeas: ["hàng làm tròn", "sai số do làm tròn ở mức học sinh lớp 7"], prerequisites: ["Số thập phân"], representations: ["TEXT", "NUMBER_LINE", "TABLE", "REAL_LIFE"] },
    ],
    vocabulary: [
      { term: "số thập phân vô hạn tuần hoàn", studentFriendlyMeaning: "Số thập phân kéo dài mãi nhưng có một phần lặp lại theo quy luật." },
      { term: "chu kì", studentFriendlyMeaning: "Chữ số hoặc nhóm chữ số được lặp lại mãi trong phần thập phân." },
      { term: "độ chính xác", studentFriendlyMeaning: "Mức gần đúng cần đạt khi làm tròn một số." },
    ],
    teachingScript: [
      { id: "t5-1", phase: "HOOK", teacherIntent: "Tạo nhu cầu phân biệt kết quả phép chia dừng và không dừng.", aiPrompt: "So sánh hai phép chia đơn giản: một phép cho số thập phân hữu hạn, một phép tạo dãy chữ số lặp. Hỏi em thấy điểm khác nhau nào.", expectedStudentEvidence: "Học sinh nhận ra một kết quả dừng, kết quả kia kéo dài và lặp." },
      { id: "t5-2", phase: "DISCOVER", teacherIntent: "Hình thành khái niệm chu kì.", aiPrompt: "Cho học sinh chỉ ra phần lặp lại và thử viết gọn bằng dấu ngoặc.", expectedStudentEvidence: "Xác định đúng chu kì." },
      { id: "t5-3", phase: "EXPLAIN", teacherIntent: "Chuẩn hóa thuật ngữ theo SGK.", aiPrompt: "Chốt: số thập phân hữu hạn, vô hạn tuần hoàn, chu kì; sau đó nối sang làm tròn theo độ chính xác.", expectedStudentEvidence: "Diễn đạt lại được bằng lời của mình." },
      { id: "t5-4", phase: "CHECK", teacherIntent: "Kiểm tra phân loại và làm tròn.", aiPrompt: "Đưa ba số thập phân, yêu cầu phân loại; sau đó cho một số cần làm tròn với độ chính xác cụ thể.", expectedStudentEvidence: "Phân loại đúng và chọn đúng hàng làm tròn." },
    ],
    workedExamples: [
      { id: "e5-1", title: "Nhận biết phần lặp", purpose: "Nhìn ra chu kì thay vì chỉ nhìn số chữ số.", difficulty: "FOUNDATION", context: "PURE_MATH", keySteps: ["Quan sát phần thập phân", "Tìm nhóm lặp", "Viết gọn chu kì"], sourceRef: primary("SGK trang 26-27", "Ví dụ về số thập phân vô hạn tuần hoàn và chu kì.") },
      { id: "e5-2", title: "Làm tròn theo độ chính xác", purpose: "Chọn đúng hàng làm tròn trước khi thực hiện.", difficulty: "BASIC", context: "REAL_LIFE", keySteps: ["Đọc độ chính xác", "Xác định hàng làm tròn", "Áp dụng quy ước làm tròn"], sourceRef: primary("SGK trang 27-28", "Làm tròn số thập phân theo độ chính xác.") },
    ],
    misconceptions: [
      { id: "m5-1", label: "Nhầm mọi số thập phân vô hạn đều tuần hoàn", evidencePattern: "Không xác định được phần lặp hoặc coi dãy không lặp là tuần hoàn", likelyCause: "Chỉ chú ý việc số có vô hạn chữ số", correctionStrategy: "Yêu cầu khoanh chính xác nhóm chữ số lặp; nếu không có nhóm lặp thì không gọi là tuần hoàn.", retrySkill: "Nhận biết chu kì" },
      { id: "m5-2", label: "Chọn sai hàng làm tròn", evidencePattern: "Độ chính xác 0,05 nhưng làm tròn đến phần trăm", likelyCause: "Nhầm độ chính xác với giá trị của hàng làm tròn", correctionStrategy: "Dùng bảng liên hệ độ chính xác và hàng làm tròn, rồi thử trên trục số.", retrySkill: "Làm tròn theo độ chính xác" },
    ],
    hintLadders: [
      { skill: "Nhận biết chu kì", hint1: "Tìm đoạn chữ số xuất hiện lại liên tiếp.", hint2: "Đọc phần thập phân thành từng nhóm có cùng độ dài.", hint3: "Viết nhóm lặp vào ngoặc sau phần không lặp.", revealPolicy: "AFTER_THREE_ATTEMPTS" },
      { skill: "Làm tròn theo độ chính xác", hint1: "Trước hết xác định hàng nào cần giữ.", hint2: "Độ chính xác bằng một nửa đơn vị của hàng làm tròn trong các trường hợp SGK nêu.", hint3: "Sau khi chọn hàng, nhìn chữ số ngay bên phải để quyết định giữ nguyên hay tăng 1.", revealPolicy: "AFTER_THREE_ATTEMPTS" },
    ],
    reasoningTemplates: [
      { id: "r5-1", skill: "Phân loại số thập phân", prompt: "Giải thích vì sao số đã cho là hữu hạn hoặc vô hạn tuần hoàn.", requiredIdeas: ["quan sát phần thập phân", "chỉ ra có/không có chu kì"], firstErrorFocus: ["nhận dạng sai chu kì", "nhầm hữu hạn với tuần hoàn"] },
    ],
    practiceBlueprint: [
      { skill: "Nhận biết số thập phân", foundation: 4, basic: 5, applied: 3, advanced: 2, allowAdvancedOnlyAfterMastery: true },
      { skill: "Làm tròn theo độ chính xác", foundation: 3, basic: 5, applied: 4, advanced: 2, allowAdvancedOnlyAfterMastery: true },
    ],
    assessment: { diagnosticItems: 3, checkpointItems: 6, exitTicketItems: 3, masteryThreshold: 70, reasoningRequired: true },
    studentBrain: { skillNames: ["Nhận biết số thập phân vô hạn tuần hoàn", "Xác định chu kì", "Làm tròn theo độ chính xác"], mistakeCategories: ["CONCEPT", "PROCEDURE"], masterySignals: ["phân loại đúng", "chọn hàng làm tròn đúng", "giải thích được vì sao"], confidenceSignals: ["đúng lần đầu", "ít cần hint", "tự sửa sau gợi ý"] },
    teacherTags: [
      { code: "CH2-L5-DECIMAL", label: "Số thập phân vô hạn tuần hoàn", dimension: "CONTENT" },
      { code: "CH2-L5-ROUND", label: "Làm tròn theo độ chính xác", dimension: "PROCESS" },
    ],
    sourceRefs: [
      primary("SGK trang 26-28", "Trọng tâm bài 5 và bài tập cơ bản."),
      supplement("Tài liệu học tập Chương 2, phần Bài 5", "Phân dạng luyện tập và mở rộng."),
      practice("SBT Chương II - Bài 5", "Nguồn luyện tập sẽ được tuyển chọn ở Beta 2.3.2."),
    ],
    qualityStatus: "CONTENT_READY",
  },
  {
    schemaVersion: "1.0",
    id: "academic-lesson-6-so-vo-ti-can-bac-hai",
    lessonPlayerId: "lesson-player-06",
    chapterId: academicChapter2.id,
    chapterNumber: 2,
    lessonNumber: 6,
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: "Số vô tỉ. Căn bậc hai số học",
    summary:
      "Nhận biết số vô tỉ, hiểu căn bậc hai số học của số không âm và tính/ước lượng căn bậc hai trong các tình huống phù hợp.",
    estimatedMinutes: 40,
    objectives: [
      { id: "o6-1", statement: "Nhận biết được số vô tỉ qua dạng thập phân vô hạn không tuần hoàn.", bloom: "UNDERSTAND", required: true, masteryThreshold: 70 },
      { id: "o6-2", statement: "Hiểu và sử dụng đúng khái niệm căn bậc hai số học của một số không âm.", bloom: "APPLY", required: true, masteryThreshold: 75 },
      { id: "o6-3", statement: "Tính hoặc ước lượng căn bậc hai số học trong bài toán đơn giản.", bloom: "APPLY", required: true, masteryThreshold: 70 },
    ],
    concepts: [
      { id: "c6-1", title: "Số vô tỉ", summary: "Số có biểu diễn thập phân vô hạn không tuần hoàn.", keyIdeas: ["không tuần hoàn", "kí hiệu tập hợp I"], prerequisites: ["Số thập phân vô hạn tuần hoàn"], representations: ["TEXT", "NUMBER_LINE", "FORMULA"] },
      { id: "c6-2", title: "Căn bậc hai số học", summary: "Với a không âm, căn bậc hai số học là số không âm có bình phương bằng a.", keyIdeas: ["a không âm", "căn bậc hai số học không âm", "phân biệt √a với hai căn bậc hai của a"], prerequisites: ["Bình phương", "Số hữu tỉ"], representations: ["FORMULA", "DIAGRAM", "REAL_LIFE"] },
    ],
    vocabulary: [
      { term: "số vô tỉ", studentFriendlyMeaning: "Số thập phân kéo dài vô hạn nhưng không có chu kì lặp." },
      { term: "căn bậc hai số học", studentFriendlyMeaning: "Số không âm mà khi bình phương lên thì bằng số đã cho." },
    ],
    teachingScript: [
      { id: "t6-1", phase: "HOOK", teacherIntent: "Xuất phát từ bài toán cạnh hình vuông để nảy sinh căn bậc hai.", aiPrompt: "Cho diện tích một hình vuông và hỏi cạnh dài bao nhiêu; để học sinh nhận ra cần tìm số có bình phương bằng diện tích.", expectedStudentEvidence: "Nêu được mối liên hệ cạnh² = diện tích." },
      { id: "t6-2", phase: "DISCOVER", teacherIntent: "Nhận ra có số không viết được dạng hữu hạn/tuần hoàn.", aiPrompt: "So sánh biểu diễn thập phân của một số hữu tỉ và một số như √2 ở mức quan sát phù hợp.", expectedStudentEvidence: "Nêu được đặc điểm vô hạn không tuần hoàn." },
      { id: "t6-3", phase: "EXPLAIN", teacherIntent: "Chuẩn hóa căn bậc hai số học.", aiPrompt: "Nhấn mạnh điều kiện số dưới căn không âm và kết quả √a không âm.", expectedStudentEvidence: "Không trả lời √9 = ±3." },
      { id: "t6-4", phase: "PRACTICE", teacherIntent: "Kết nối với đo đạc và hình học.", aiPrompt: "Cho bài toán hình vuông, yêu cầu tính cạnh từ diện tích và làm tròn nếu cần.", expectedStudentEvidence: "Dùng căn bậc hai và đơn vị đúng." },
    ],
    workedExamples: [
      { id: "e6-1", title: "Cạnh hình vuông từ diện tích", purpose: "Gắn căn bậc hai với ý nghĩa hình học.", difficulty: "FOUNDATION", context: "REAL_LIFE", keySteps: ["Lập quan hệ x² = S", "Chọn x không âm", "Viết x = √S"], sourceRef: primary("SGK trang 29-31", "Bài toán hình vuông và căn bậc hai số học.") },
      { id: "e6-2", title: "Ước lượng căn bậc hai", purpose: "Định vị giá trị căn giữa hai số quen thuộc.", difficulty: "BASIC", context: "PURE_MATH", keySteps: ["Tìm hai số chính phương kề", "So sánh", "Ước lượng hoặc dùng máy tính khi được phép"], sourceRef: primary("SGK trang 30-32", "Tính và làm tròn căn bậc hai số học.") },
    ],
    misconceptions: [
      { id: "m6-1", label: "Viết √a = ±x", evidencePattern: "Trả lời căn bậc hai số học có hai giá trị", likelyCause: "Nhầm căn bậc hai của a với căn bậc hai số học của a", correctionStrategy: "Tách hai câu hỏi: 'các căn bậc hai của 9' và '√9'.", retrySkill: "Phân biệt căn bậc hai và căn bậc hai số học" },
      { id: "m6-2", label: "Lấy căn của số âm trong phạm vi số thực lớp 7", evidencePattern: "Cố tính √(-a)", likelyCause: "Bỏ qua điều kiện a ≥ 0", correctionStrategy: "Yêu cầu kiểm tra điều kiện số dưới dấu căn trước khi tính.", retrySkill: "Điều kiện căn bậc hai số học" },
    ],
    hintLadders: [
      { skill: "Căn bậc hai số học", hint1: "Tìm một số không âm mà bình phương bằng số đã cho.", hint2: "Kiểm tra các số chính phương gần nhất.", hint3: "Nếu x² = a và x ≥ 0 thì x = √a.", revealPolicy: "AFTER_THREE_ATTEMPTS" },
    ],
    reasoningTemplates: [
      { id: "r6-1", skill: "Giải thích căn bậc hai số học", prompt: "Giải thích vì sao kết quả phải không âm.", requiredIdeas: ["định nghĩa căn bậc hai số học", "điều kiện không âm"], firstErrorFocus: ["dùng ± sai chỗ", "bỏ qua điều kiện"] },
    ],
    practiceBlueprint: [
      { skill: "Nhận biết số vô tỉ", foundation: 4, basic: 4, applied: 3, advanced: 2, allowAdvancedOnlyAfterMastery: true },
      { skill: "Căn bậc hai số học", foundation: 5, basic: 6, applied: 4, advanced: 2, allowAdvancedOnlyAfterMastery: true },
    ],
    assessment: { diagnosticItems: 3, checkpointItems: 7, exitTicketItems: 3, masteryThreshold: 72, reasoningRequired: true },
    studentBrain: { skillNames: ["Nhận biết số vô tỉ", "Căn bậc hai số học", "Ước lượng căn bậc hai"], mistakeCategories: ["CONCEPT", "PROCEDURE", "SIGN"], masterySignals: ["phân biệt được hữu tỉ/vô tỉ", "không dùng ± cho √a", "kiểm tra điều kiện a ≥ 0"], confidenceSignals: ["đúng lần đầu", "giải thích được định nghĩa", "tự sửa lỗi kí hiệu"] },
    teacherTags: [
      { code: "CH2-L6-IRRATIONAL", label: "Số vô tỉ", dimension: "CONTENT" },
      { code: "CH2-L6-SQRT", label: "Căn bậc hai số học", dimension: "REASONING" },
    ],
    sourceRefs: [
      primary("SGK trang 29-32", "Trọng tâm bài 6."),
      supplement("Tài liệu học tập Chương 2, phần Bài 6", "Dạng toán và bài vận dụng."),
      practice("SBT Chương II - Bài 6", "Nguồn luyện tập sẽ được tuyển chọn ở Beta 2.3.2."),
    ],
    qualityStatus: "CONTENT_READY",
  },
  {
    schemaVersion: "1.0",
    id: "academic-lesson-7-tap-hop-so-thuc",
    lessonPlayerId: "lesson-player-07",
    chapterId: academicChapter2.id,
    chapterNumber: 2,
    lessonNumber: 7,
    grade: 7,
    semester: 1,
    curriculum: "KNTT",
    title: "Tập hợp các số thực",
    summary:
      "Hợp nhất số hữu tỉ và số vô tỉ thành tập số thực, biểu diễn trên trục số, so sánh số thực và hiểu giá trị tuyệt đối như khoảng cách đến 0.",
    estimatedMinutes: 40,
    objectives: [
      { id: "o7-1", statement: "Nhận biết được số thực và mối quan hệ giữa số hữu tỉ, số vô tỉ và số thực.", bloom: "UNDERSTAND", required: true, masteryThreshold: 70 },
      { id: "o7-2", statement: "Biểu diễn và so sánh được số thực trong các trường hợp phù hợp.", bloom: "APPLY", required: true, masteryThreshold: 70 },
      { id: "o7-3", statement: "Hiểu và tính được giá trị tuyệt đối của một số thực.", bloom: "APPLY", required: true, masteryThreshold: 75 },
    ],
    concepts: [
      { id: "c7-1", title: "Tập hợp số thực", summary: "Số hữu tỉ và số vô tỉ gọi chung là số thực; tập số thực kí hiệu R.", keyIdeas: ["Q và I nằm trong R", "trục số thực", "số đối"], prerequisites: ["Số hữu tỉ", "Số vô tỉ"], representations: ["TEXT", "NUMBER_LINE", "DIAGRAM"] },
      { id: "c7-2", title: "Thứ tự số thực", summary: "So sánh số thực qua biểu diễn thập phân, trục số và các tính chất thứ tự phù hợp.", keyIdeas: ["trục số", "tính bắc cầu", "so sánh căn bậc hai dương"], prerequisites: ["So sánh số hữu tỉ", "Căn bậc hai số học"], representations: ["NUMBER_LINE", "FORMULA"] },
      { id: "c7-3", title: "Giá trị tuyệt đối", summary: "|a| là khoảng cách từ điểm biểu diễn a đến gốc O trên trục số.", keyIdeas: ["khoảng cách không âm", "hai số đối có cùng giá trị tuyệt đối", "biểu thức từng trường hợp"], prerequisites: ["Trục số", "Số đối"], representations: ["NUMBER_LINE", "FORMULA", "REAL_LIFE"] },
    ],
    vocabulary: [
      { term: "số thực", studentFriendlyMeaning: "Tên gọi chung của số hữu tỉ và số vô tỉ." },
      { term: "trục số thực", studentFriendlyMeaning: "Trục số mà mỗi điểm biểu diễn một số thực và mỗi số thực có một điểm biểu diễn." },
      { term: "giá trị tuyệt đối", studentFriendlyMeaning: "Khoảng cách từ số đó đến 0 trên trục số." },
    ],
    teachingScript: [
      { id: "t7-1", phase: "HOOK", teacherIntent: "Kết nối các tập hợp số đã biết.", aiPrompt: "Cho một nhóm số gồm số nguyên, phân số, số thập phân tuần hoàn và căn không phải chính phương. Hỏi cách gom chúng vào một tập hợp chung.", expectedStudentEvidence: "Nhận ra cần một tập hợp chứa cả hữu tỉ và vô tỉ." },
      { id: "t7-2", phase: "DISCOVER", teacherIntent: "Làm rõ trục số thực.", aiPrompt: "Dùng trục số để đặt một số hữu tỉ và một số vô tỉ; hỏi có 'khoảng trống' nào không.", expectedStudentEvidence: "Hiểu các số thực lấp đầy trục số theo cách diễn đạt SGK." },
      { id: "t7-3", phase: "EXPLAIN", teacherIntent: "Chuẩn hóa thứ tự và giá trị tuyệt đối.", aiPrompt: "Giải thích |a| bằng khoảng cách đến 0 trước khi đưa công thức từng trường hợp.", expectedStudentEvidence: "Tính |a| không nhầm với dấu của a." },
      { id: "t7-4", phase: "CHECK", teacherIntent: "Kiểm tra quan hệ tập hợp, so sánh và giá trị tuyệt đối.", aiPrompt: "Cho ba câu ngắn, mỗi câu kiểm tra một khái niệm.", expectedStudentEvidence: "Chọn đúng tập hợp, thứ tự và giá trị tuyệt đối." },
    ],
    workedExamples: [
      { id: "e7-1", title: "Đặt số thực trên trục số", purpose: "Liên kết số hữu tỉ, căn bậc hai và vị trí trên trục.", difficulty: "BASIC", context: "PURE_MATH", keySteps: ["Nhận dạng loại số", "Ước lượng nếu cần", "Đặt theo thứ tự"], sourceRef: primary("SGK trang 33-35", "Khái niệm số thực và trục số thực.") },
      { id: "e7-2", title: "Giá trị tuyệt đối là khoảng cách", purpose: "Ngăn học sinh học công thức máy móc.", difficulty: "FOUNDATION", context: "REAL_LIFE", keySteps: ["Xác định vị trí trên trục", "Đếm khoảng cách tới 0", "Kết luận giá trị tuyệt đối không âm"], sourceRef: primary("SGK trang 35-36", "Giá trị tuyệt đối của số thực.") },
    ],
    misconceptions: [
      { id: "m7-1", label: "Cho rằng số vô tỉ không phải số thực", evidencePattern: "x ∈ I nhưng chọn x ∉ R", likelyCause: "Xem Q, I, R là ba nhóm tách rời", correctionStrategy: "Dùng sơ đồ tập hợp: Q và I cùng nằm trong R.", retrySkill: "Quan hệ tập hợp số" },
      { id: "m7-2", label: "Giá trị tuyệt đối giữ nguyên dấu âm", evidencePattern: "|-a| = -a với a dương", likelyCause: "Đọc kí hiệu như dấu ngoặc", correctionStrategy: "Quay về định nghĩa khoảng cách đến 0.", retrySkill: "Giá trị tuyệt đối" },
    ],
    hintLadders: [
      { skill: "Giá trị tuyệt đối", hint1: "Hãy nghĩ tới khoảng cách từ số đó đến 0.", hint2: "Khoảng cách có thể âm không?", hint3: "Nếu số đang âm, giá trị tuyệt đối là số đối của nó.", revealPolicy: "AFTER_THREE_ATTEMPTS" },
    ],
    reasoningTemplates: [
      { id: "r7-1", skill: "Giá trị tuyệt đối", prompt: "Giải thích kết quả bằng khoảng cách trên trục số, không chỉ nêu công thức.", requiredIdeas: ["vị trí số", "khoảng cách đến 0", "không âm"], firstErrorFocus: ["giữ dấu âm", "nhầm số đối"] },
    ],
    practiceBlueprint: [
      { skill: "Quan hệ tập hợp số", foundation: 4, basic: 5, applied: 3, advanced: 2, allowAdvancedOnlyAfterMastery: true },
      { skill: "So sánh số thực", foundation: 3, basic: 5, applied: 4, advanced: 2, allowAdvancedOnlyAfterMastery: true },
      { skill: "Giá trị tuyệt đối", foundation: 4, basic: 5, applied: 4, advanced: 2, allowAdvancedOnlyAfterMastery: true },
    ],
    assessment: { diagnosticItems: 4, checkpointItems: 8, exitTicketItems: 3, masteryThreshold: 72, reasoningRequired: true },
    studentBrain: { skillNames: ["Nhận biết số thực", "So sánh số thực", "Giá trị tuyệt đối"], mistakeCategories: ["CONCEPT", "PROCEDURE", "SIGN"], masterySignals: ["phân loại đúng Q/I/R", "so sánh đúng", "giải thích |a| bằng khoảng cách"], confidenceSignals: ["đúng lần đầu", "ít cần hint", "tự diễn giải được"] },
    teacherTags: [
      { code: "CH2-L7-REAL", label: "Tập hợp số thực", dimension: "CONTENT" },
      { code: "CH2-L7-ABS", label: "Giá trị tuyệt đối", dimension: "REASONING" },
    ],
    sourceRefs: [
      primary("SGK trang 33-38", "Trọng tâm bài 7 và luyện tập chung."),
      supplement("Tài liệu học tập Chương 2, phần Bài 7", "Phân dạng số thực, so sánh, giá trị tuyệt đối."),
      practice("SBT Chương II - Bài 7", "Nguồn luyện tập sẽ được tuyển chọn ở Beta 2.3.2."),
    ],
    qualityStatus: "CONTENT_READY",
  },
];
