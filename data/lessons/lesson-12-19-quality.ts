import { getAcademicLessonById } from "@/services/academic/academic-repository";
import type { LessonDefinition, LessonQuestion, LessonStep } from "@/types/lesson";

type QualityLessonConfig = {
  number: number;
  questions: LessonQuestion[];
};

function academic(number: number) {
  const lesson = getAcademicLessonById(`academic-l${number}`);
  if (!lesson) throw new Error(`Missing academic lesson ${number}`);
  return lesson;
}

function makeSteps(number: number, questions: LessonQuestion[]): LessonStep[] {
  const lesson = academic(number);
  const explainSteps: LessonStep[] = lesson.concepts.map((concept, index) => ({
    id: `lesson-player-${String(number).padStart(2, "0")}-concept-${index + 1}`,
    action: "EXPLAIN",
    title: concept.title,
    content: `${concept.summary}\n\nCần nhớ: ${concept.keyIdeas.join("; ")}.`,
    estimatedMinutes: 5,
  }));

  return [
    {
      id: `lesson-player-${String(number).padStart(2, "0")}-welcome`,
      action: "WELCOME",
      title: `Bài ${number}. ${lesson.title}`,
      content:
        "Phần này kiểm tra kiến thức Toán thật của bài. Em hãy dựa vào dữ kiện, định nghĩa và tính chất đã học; không chọn theo hình vẽ hoặc cảm giác.",
      estimatedMinutes: 1,
    },
    {
      id: `lesson-player-${String(number).padStart(2, "0")}-objective`,
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: lesson.objectives.map((item) => `• ${item.statement}`).join("\n"),
      estimatedMinutes: 2,
    },
    ...explainSteps,
    ...questions.map((question, index) => ({
      id: `${question.id}-step`,
      action: "QUESTION" as const,
      title: `Checkpoint Toán ${index + 1}`,
      content: "Chọn đáp án dựa trên kiến thức của bài và kiểm tra điều kiện trước khi kết luận.",
      estimatedMinutes: 4,
      question,
    })),
    {
      id: `lesson-player-${String(number).padStart(2, "0")}-summary`,
      action: "SUMMARY",
      title: "Chốt bài",
      content:
        "Checkpoint của bài được tính từ câu hỏi Toán theo đúng nội dung SGK, không dùng câu hỏi meta về 'cách làm đúng' để quyết định mastery.",
      estimatedMinutes: 2,
    },
  ];
}

function build(config: QualityLessonConfig): LessonDefinition {
  const lesson = academic(config.number);
  return {
    id: lesson.lessonPlayerId!,
    knowledgeNodeId: `lesson-${config.number}-academic${config.number}`,
    grade: 7,
    chapter: lesson.chapterNumber,
    lessonNumber: config.number,
    title: lesson.title,
    subtitle: lesson.summary,
    objectives: lesson.objectives.map((item) => item.statement),
    estimatedMinutes: lesson.estimatedMinutes,
    steps: makeSteps(config.number, config.questions),
  };
}

const configs: QualityLessonConfig[] = [
  {
    number: 12,
    questions: [
      {
        id: "l12-core-angle-sum",
        prompt: "Tam giác ABC có A = 50° và B = 60°. Góc C bằng bao nhiêu?",
        choices: [
          { id: "a", text: "70°" },
          { id: "b", text: "80°" },
          { id: "c", text: "110°" },
          { id: "d", text: "120°" },
        ],
        correctChoiceId: "a",
        skillName: "Tính góc còn lại của tam giác",
        hint: "Tổng ba góc trong một tam giác bằng 180°.",
        retryHint: "C = 180° - 50° - 60°.",
        explanation: "C = 70°.",
      },
      {
        id: "l12-core-exterior",
        prompt:
          "Tại đỉnh C của tam giác ABC, kéo dài BC tạo góc ngoài xCA. Nếu A = 45° và B = 65°, góc ngoài xCA bằng bao nhiêu?",
        choices: [
          { id: "a", text: "110°" },
          { id: "b", text: "70°" },
          { id: "c", text: "65°" },
          { id: "d", text: "45°" },
        ],
        correctChoiceId: "a",
        skillName: "Góc ngoài của tam giác",
        hint: "Góc ngoài bằng tổng hai góc trong không kề với nó.",
        retryHint: "45° + 65° = ?",
        explanation: "Góc ngoài xCA = A + B = 110°.",
      },
    ],
  },
  {
    number: 13,
    questions: [
      {
        id: "l13-core-correspondence",
        prompt: "Nếu ΔABC = ΔDEF theo đúng thứ tự tương ứng, cạnh AC tương ứng với cạnh nào?",
        choices: [
          { id: "a", text: "DF" },
          { id: "b", text: "DE" },
          { id: "c", text: "EF" },
          { id: "d", text: "Không xác định" },
        ],
        correctChoiceId: "a",
        skillName: "Xác định yếu tố tương ứng của hai tam giác bằng nhau",
        hint: "Ghép A↔D, B↔E, C↔F.",
        retryHint: "AC nối đỉnh thứ nhất và thứ ba; bên kia là D và F.",
        explanation: "AC tương ứng với DF.",
      },
      {
        id: "l13-core-sss",
        prompt: "Biết AB = DE, BC = EF và AC = DF. Kết luận nào có đủ căn cứ?",
        choices: [
          { id: "a", text: "ΔABC = ΔDEF theo c.c.c" },
          { id: "b", text: "Chỉ biết hai tam giác có cùng chu vi" },
          { id: "c", text: "Chưa đủ vì phải biết thêm một góc" },
          { id: "d", text: "Hai tam giác bằng nhau vì hình vẽ giống nhau" },
        ],
        correctChoiceId: "a",
        skillName: "Trường hợp bằng nhau cạnh-cạnh-cạnh",
        hint: "Kiểm tra đủ ba cặp cạnh tương ứng.",
        retryHint: "Ba cặp cạnh tương ứng đều bằng nhau.",
        explanation: "Hai tam giác bằng nhau theo trường hợp c.c.c.",
      },
    ],
  },
  {
    number: 14,
    questions: [
      {
        id: "l14-core-sas",
        prompt:
          "Biết AB = DE, AC = DF và ∠A = ∠D. Vì ∠A, ∠D là góc xen giữa các cặp cạnh đã cho, dùng trường hợp nào?",
        choices: [
          { id: "a", text: "c.g.c" },
          { id: "b", text: "g.c.g" },
          { id: "c", text: "c.c.c" },
          { id: "d", text: "Không đủ dữ kiện" },
        ],
        correctChoiceId: "a",
        skillName: "Trường hợp bằng nhau cạnh-góc-cạnh",
        hint: "Hai cạnh và góc xen giữa.",
        retryHint: "Cấu trúc là cạnh – góc – cạnh.",
        explanation: "Đủ điều kiện c.g.c.",
      },
      {
        id: "l14-core-asa",
        prompt:
          "Biết ∠A = ∠D, AB = DE và ∠B = ∠E. Cạnh AB, DE nằm giữa hai góc đã biết. Dùng trường hợp nào?",
        choices: [
          { id: "a", text: "g.c.g" },
          { id: "b", text: "c.g.c" },
          { id: "c", text: "c.c.c" },
          { id: "d", text: "Hai góc bằng nhau là đủ, không cần cạnh" },
        ],
        correctChoiceId: "a",
        skillName: "Trường hợp bằng nhau góc-cạnh-góc",
        hint: "Hai góc và cạnh xen giữa.",
        retryHint: "Cấu trúc là góc – cạnh – góc.",
        explanation: "Đủ điều kiện g.c.g.",
      },
    ],
  },
  {
    number: 15,
    questions: [
      {
        id: "l15-core-cases",
        prompt:
          "Hai tam giác vuông có hai cạnh góc vuông tương ứng bằng nhau. Kết luận đúng là gì?",
        choices: [
          { id: "a", text: "Hai tam giác bằng nhau" },
          { id: "b", text: "Chỉ đồng dạng" },
          { id: "c", text: "Chưa đủ vì bắt buộc phải biết cạnh huyền" },
          { id: "d", text: "Chỉ bằng nhau nếu hình vẽ cùng hướng" },
        ],
        correctChoiceId: "a",
        skillName: "Hai cạnh góc vuông",
        hint: "Góc xen giữa hai cạnh góc vuông đều là 90°.",
        retryHint: "Đây là trường hợp suy từ c.g.c.",
        explanation: "Hai cạnh góc vuông tương ứng bằng nhau nên hai tam giác vuông bằng nhau.",
      },
      {
        id: "l15-core-leg-angle",
        prompt:
          "Hai tam giác vuông có một cạnh góc vuông và góc nhọn kề cạnh ấy tương ứng bằng nhau. Kết luận nào đúng?",
        choices: [
          { id: "a", text: "Hai tam giác bằng nhau" },
          { id: "b", text: "Chưa đủ dữ kiện" },
          { id: "c", text: "Chỉ đồng dạng" },
          { id: "d", text: "Bắt buộc phải biết cạnh huyền" },
        ],
        correctChoiceId: "a",
        skillName: "Cạnh góc vuông và góc nhọn kề",
        hint: "Hai tam giác đều có một góc vuông 90°.",
        retryHint: "Góc vuông, cạnh góc vuông và góc nhọn kề tạo đủ quan hệ tương ứng.",
        explanation: "Đây là một trường hợp bằng nhau của tam giác vuông.",
      },
      {
        id: "l15-core-hyp-angle",
        prompt:
          "Hai tam giác vuông có cạnh huyền và một góc nhọn tương ứng bằng nhau. Kết luận nào đúng?",
        choices: [
          { id: "a", text: "Hai tam giác bằng nhau" },
          { id: "b", text: "Chưa đủ vì thiếu một cạnh góc vuông" },
          { id: "c", text: "Chỉ bằng nhau khi góc nhọn là 45°" },
          { id: "d", text: "Chỉ đồng dạng" },
        ],
        correctChoiceId: "a",
        skillName: "Cạnh huyền và góc nhọn",
        hint: "Mỗi tam giác đã có góc vuông 90°.",
        retryHint: "Cạnh huyền và một góc nhọn tương ứng là trường hợp bằng nhau của tam giác vuông.",
        explanation: "Hai tam giác vuông bằng nhau theo cạnh huyền và góc nhọn.",
      },
      {
        id: "l15-core-hyp-leg",
        prompt:
          "Hai tam giác ABC và DEF vuông tại A và D; BC = EF và AB = DE. Dùng trường hợp nào?",
        choices: [
          { id: "a", text: "Cạnh huyền – cạnh góc vuông" },
          { id: "b", text: "Chỉ c.c.c" },
          { id: "c", text: "Không đủ dữ kiện" },
          { id: "d", text: "Cạnh huyền – góc vuông" },
        ],
        correctChoiceId: "a",
        skillName: "Cạnh huyền-cạnh góc vuông",
        hint: "BC và EF đối diện góc vuông.",
        retryHint: "BC, EF là cạnh huyền; AB, DE là cạnh góc vuông.",
        explanation: "Hai tam giác bằng nhau theo cạnh huyền – cạnh góc vuông.",
      },
    ],
  },
  {
    number: 16,
    questions: [
      {
        id: "l16-core-isosceles-converse",
        prompt: "Trong tam giác ABC, nếu ∠B = ∠C thì kết luận nào đúng?",
        choices: [
          { id: "a", text: "AB = AC nên tam giác ABC cân tại A" },
          { id: "b", text: "Không thể suy ra quan hệ giữa AB và AC" },
          { id: "c", text: "BC = AB nên tam giác cân tại C" },
          { id: "d", text: "Tam giác ABC chắc chắn vuông" },
        ],
        correctChoiceId: "a",
        skillName: "Định lí đảo của tam giác cân",
        hint: "Hai góc bằng nhau thì hai cạnh đối diện chúng bằng nhau.",
        retryHint: "Cạnh đối diện ∠B là AC; cạnh đối diện ∠C là AB.",
        explanation: "∠B = ∠C ⇒ AC = AB, nên tam giác ABC cân tại A.",
      },
      {
        id: "l16-core-perp-bisector",
        prompt:
          "Điểm M thỏa MA = MB. Theo tính chất đảo của đường trung trực, kết luận nào đúng?",
        choices: [
          { id: "a", text: "M thuộc đường trung trực của AB" },
          { id: "b", text: "M luôn là trung điểm của AB" },
          { id: "c", text: "M thuộc đoạn AB" },
          { id: "d", text: "MA vuông góc MB" },
        ],
        correctChoiceId: "a",
        skillName: "Tính chất đảo của đường trung trực",
        hint: "Tập hợp các điểm cách đều A và B là đường trung trực của AB.",
        retryHint: "MA = MB nghĩa là M cách đều hai đầu đoạn AB.",
        explanation: "M thuộc đường trung trực của AB.",
      },
    ],
  },
  {
    number: 17,
    questions: [
      {
        id: "l17-core-data-type",
        prompt:
          "Dữ liệu 'mức đánh giá: Rất tốt, Tốt, Trung bình, Kém' thuộc loại nào?",
        choices: [
          { id: "a", text: "Dữ liệu không là số và có thể sắp thứ tự" },
          { id: "b", text: "Dữ liệu số" },
          { id: "c", text: "Dữ liệu không là số và không thể sắp thứ tự" },
          { id: "d", text: "Không phải dữ liệu" },
        ],
        correctChoiceId: "a",
        skillName: "Phân loại dữ liệu",
        hint: "Đây là các nhãn, nhưng có thứ tự từ cao đến thấp.",
        retryHint: "Không phải số; tuy vậy Rất tốt > Tốt > Trung bình > Kém.",
        explanation: "Đây là dữ liệu không là số có thể sắp thứ tự.",
      },
      {
        id: "l17-core-representative",
        prompt:
          "Muốn kết luận về thời gian tự học của toàn khối 7. Cách lấy mẫu nào hợp lí hơn?",
        choices: [
          { id: "a", text: "Chọn học sinh từ nhiều lớp và nhiều nhóm khác nhau trong khối 7" },
          { id: "b", text: "Chỉ hỏi 5 bạn trong đội tuyển Toán" },
          { id: "c", text: "Chỉ hỏi một lớp có thành tích cao nhất" },
          { id: "d", text: "Hỏi học sinh khối 9" },
        ],
        correctChoiceId: "a",
        skillName: "Tính đại diện của dữ liệu",
        hint: "So sánh nhóm được hỏi với toàn bộ đối tượng cần kết luận.",
        retryHint: "Mẫu nên phản ánh nhiều nhóm trong chính khối 7.",
        explanation: "Chọn đa dạng học sinh trong khối 7 giúp mẫu đại diện hơn.",
      },
    ],
  },
  {
    number: 18,
    questions: [
      {
        id: "l18-core-percent",
        prompt:
          "Một biểu đồ hình quạt tròn có ba nhóm lần lượt 40%, 35% và 25%. Nhận xét nào đúng?",
        choices: [
          { id: "a", text: "Biểu đồ có tổng tỉ lệ hợp lệ là 100%" },
          { id: "b", text: "Tổng là 90%" },
          { id: "c", text: "Nhóm 25% là lớn nhất" },
          { id: "d", text: "Không thể so sánh các nhóm" },
        ],
        correctChoiceId: "a",
        skillName: "Đọc biểu đồ hình quạt tròn",
        hint: "Cộng ba tỉ lệ.",
        retryHint: "40 + 35 + 25 = 100.",
        explanation: "Toàn bộ hình tròn ứng với 100%.",
      },
      {
        id: "l18-core-count",
        prompt: "Trong 200 học sinh, 30% chọn một hoạt động. Khoảng bao nhiêu học sinh đã chọn hoạt động đó?",
        choices: [
          { id: "a", text: "60" },
          { id: "b", text: "30" },
          { id: "c", text: "170" },
          { id: "d", text: "600" },
        ],
        correctChoiceId: "a",
        skillName: "Chuyển tỉ lệ thành số lượng",
        hint: "Tính 30% của 200.",
        retryHint: "200 × 0,30.",
        explanation: "200 × 30% = 60 học sinh.",
      },
    ],
  },
  {
    number: 19,
    questions: [
      {
        id: "l19-core-trend",
        prompt:
          "Một đại lượng có giá trị theo bốn năm là 20, 24, 27, 25. Mô tả nào đúng nhất?",
        choices: [
          { id: "a", text: "Tăng qua ba năm đầu rồi giảm ở năm cuối" },
          { id: "b", text: "Giảm liên tục" },
          { id: "c", text: "Không đổi" },
          { id: "d", text: "Tăng liên tục" },
        ],
        correctChoiceId: "a",
        skillName: "Nhận xét xu hướng biểu đồ đoạn thẳng",
        hint: "So sánh từng cặp giá trị liên tiếp.",
        retryHint: "20→24→27 tăng; 27→25 giảm.",
        explanation: "Xu hướng tăng rồi giảm ở giai đoạn cuối.",
      },
      {
        id: "l19-core-scale",
        prompt:
          "Hai biểu đồ dùng cùng dữ liệu nhưng một biểu đồ cắt trục đứng bắt đầu từ 95 thay vì 0 nên đường trông dốc hơn. Kết luận nào đúng?",
        choices: [
          { id: "a", text: "Cần đọc giá trị và thang đo trước khi kết luận mức thay đổi" },
          { id: "b", text: "Đường dốc hơn luôn có nghĩa dữ liệu tăng nhiều hơn" },
          { id: "c", text: "Có thể bỏ qua trục đứng" },
          { id: "d", text: "Hai biểu đồ chắc chắn dùng dữ liệu khác nhau" },
        ],
        correctChoiceId: "a",
        skillName: "Đọc thang đo và phát hiện biểu đồ gây hiểu nhầm",
        hint: "Hình dạng đường phụ thuộc cách chọn thang trục.",
        retryHint: "So sánh số liệu thật, không chỉ độ dốc nhìn thấy.",
        explanation: "Phải đọc thang đo và giá trị trước khi nhận xét mức tăng/giảm.",
      },
    ],
  },
];

export const qualityLessons12To19: LessonDefinition[] = configs.map(build);
