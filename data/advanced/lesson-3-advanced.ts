import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson3AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l3-advanced-efficient-exponents",
    lessonId: "lesson-player-03",
    knowledgeNodeId: "lesson-3-luy-thua-so-huu-ti",
    title: "Rút gọn bằng quy tắc số mũ, không tính dài",
    prompt:
      "Rút gọn A = (3/5)^4 × (3/5)^3 : (3/5)^5. Em không được khai triển thành phép nhân nhiều thừa số; hãy dùng quy tắc lũy thừa, giải thích từng bước rồi tính giá trị cuối cùng.",
    skillName: "Lựa chọn chiến lược biến đổi lũy thừa",
    canonicalSkillId: "L03_ADV_EXPONENT_STRATEGY",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Vận dụng",
    learningGoal:
      "Nhận ra cấu trúc cùng cơ số, phối hợp quy tắc nhân và chia lũy thừa để rút gọn hiệu quả.",
    companionMessage:
      "Đừng khai triển (3/5)^4 thành bốn thừa số. Hãy nhìn các số mũ và cho AI biết vì sao em được cộng hoặc trừ chúng.",
    steps: [
      {
        id: "l3a1-step1",
        instruction:
          "Viết A thành một lũy thừa duy nhất của 3/5 và giải thích vì sao số mũ được tính như vậy.",
        acceptedPatterns: ["(3/5)^2", "4+3-5", "3/5^2"],
        requiredPatternGroups: [["4+3-5", "4 + 3 - 5"], ["2"]],
        keyIdea:
          "Cùng cơ số 3/5: nhân thì cộng số mũ, chia thì trừ số mũ, nên 4+3-5=2.",
        hint1: "Giữ nguyên cơ số 3/5. Khi nhân thì làm gì với số mũ? Khi chia thì làm gì?",
        hint2: "Số mũ mới là 4 + 3 - 5.",
        explanation:
          "A=(3/5)^(4+3-5)=(3/5)^2. Ta cộng số mũ khi nhân và trừ số mũ khi chia cùng cơ số khác 0.",
      },
      {
        id: "l3a1-step2",
        instruction:
          "Tính giá trị A từ lũy thừa đã rút gọn và nêu vì sao cách này ít sai hơn khai triển trực tiếp.",
        acceptedPatterns: ["9/25", "(3/5)^2"],
        keyIdea:
          "A=(3/5)^2=9/25; rút gọn số mũ trước giúp giảm số phép nhân và giảm nguy cơ sai.",
        hint1: "Em chỉ còn cần tính bình phương của 3/5.",
        hint2: "(3/5)^2 = 3^2/5^2.",
        explanation:
          "A=9/25. Cách rút gọn số mũ trước ngắn hơn, ít thao tác và làm rõ cấu trúc của biểu thức.",
      },
      {
        id: "l3a1-step3",
        instruction:
          "Nếu thay 3/5 bằng một số hữu tỉ a khác 0, hãy viết quy tắc tổng quát cho a^m × a^n : a^p.",
        acceptedPatterns: ["a^(m+n-p)", "a^m*a^n:a^p", "m+n-p"],
        keyIdea:
          "Với a≠0, a^m × a^n : a^p = a^(m+n-p) khi phép chia có nghĩa.",
        hint1: "Giữ nguyên cơ số a và theo dõi lần lượt phép nhân rồi phép chia.",
        hint2: "Nhân cùng cơ số → cộng số mũ; chia cùng cơ số → trừ số mũ.",
        explanation:
          "Với a≠0, a^m×a^n:a^p = a^(m+n-p). Điều kiện a≠0 cần thiết vì có phép chia.",
      },
    ],
    finalAnswer:
      "A=(3/5)^(4+3-5)=(3/5)^2=9/25; tổng quát a^m×a^n:a^p=a^(m+n-p) với a≠0.",
  },
  {
    id: "l3-advanced-error-analysis",
    lessonId: "lesson-player-03",
    knowledgeNodeId: "lesson-3-luy-thua-so-huu-ti",
    title: "Bắt lỗi khi lũy thừa lại được nâng lên lũy thừa",
    prompt:
      "Một bạn viết: ((-2/3)^2)^3 = (-2/3)^(2+3) = (-2/3)^5 = -32/243. Em hãy chỉ ra lỗi, sửa lời giải và giải thích vì sao không được cộng 2 với 3 trong trường hợp này.",
    skillName: "Phân tích lỗi quy tắc lũy thừa",
    canonicalSkillId: "L03_ADV_POWER_ERROR_ANALYSIS",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Suy luận",
    learningGoal:
      "Phân biệt quy tắc nhân hai lũy thừa cùng cơ số với quy tắc lũy thừa của một lũy thừa.",
    companionMessage:
      "Đáp án âm hay dương chỉ là dấu hiệu. Điều quan trọng là em phải xác định đúng quy tắc bị dùng sai.",
    steps: [
      {
        id: "l3a2-step1",
        instruction:
          "Chỉ ra chính xác bước sai và nói quy tắc nào đã bị nhầm với quy tắc nào.",
        acceptedPatterns: ["2+3", "phải nhân", "lũy thừa của lũy thừa"],
        keyIdea:
          "Sai ở bước dùng 2+3; lũy thừa của một lũy thừa phải nhân hai số mũ, không cộng.",
        hint1: "Cộng số mũ dùng cho tình huống nào? Ở đây có phải đang nhân hai lũy thừa cùng cơ số không?",
        hint2: "Biểu thức có dạng (a^m)^n.",
        explanation:
          "(a^m)^n=a^(m×n). Quy tắc a^m×a^n=a^(m+n) là một tình huống khác.",
      },
      {
        id: "l3a2-step2",
        instruction:
          "Sửa lại số mũ, xác định dấu của kết quả và tính giá trị đúng.",
        acceptedPatterns: ["(-2/3)^6", "64/729", "2*3"],
        requiredPatternGroups: [["6", "2*3", "2×3"], ["64/729"]],
        keyIdea:
          "2×3=6 nên ((-2/3)^2)^3=(-2/3)^6=64/729; số mũ chẵn cho kết quả dương.",
        hint1: "Nhân 2 với 3 để tìm số mũ mới.",
        hint2: "(-2/3)^6 có số mũ chẵn; tính 2^6 và 3^6.",
        explanation:
          "((-2/3)^2)^3=(-2/3)^(2×3)=(-2/3)^6=64/729.",
      },
      {
        id: "l3a2-step3",
        instruction:
          "Viết một câu giúp phân biệt hai quy tắc: a^m × a^n và (a^m)^n.",
        acceptedPatterns: ["m+n", "m*n", "m×n", "nhân cùng cơ số", "lũy thừa của lũy thừa"],
        requiredPatternGroups: [["m+n"], ["m*n", "m×n", "mn"]],
        keyIdea:
          "Nhân hai lũy thừa cùng cơ số thì cộng số mũ; lũy thừa của một lũy thừa thì nhân số mũ.",
        hint1: "Một quy tắc tạo m+n, quy tắc còn lại tạo m×n.",
        hint2: "a^m×a^n=a^(m+n), còn (a^m)^n=a^(mn).",
        explanation:
          "Hai cấu trúc khác nhau nên quy tắc số mũ cũng khác nhau: tích cùng cơ số dùng m+n; lũy thừa của lũy thừa dùng mn.",
      },
    ],
    finalAnswer:
      "Sai vì cộng 2+3. Đúng là ((-2/3)^2)^3=(-2/3)^6=64/729; tích cùng cơ số cộng số mũ, còn lũy thừa của lũy thừa nhân số mũ.",
  },
  {
    id: "l3-advanced-reverse-exponent",
    lessonId: "lesson-player-03",
    knowledgeNodeId: "lesson-3-luy-thua-so-huu-ti",
    title: "Đi ngược quy tắc để tìm số mũ",
    prompt:
      "Tìm số tự nhiên x thỏa [(2/3)^x × (2/3)^3] : (2/3)^2 = (2/3)^6. Em phải biến đổi về cùng cơ số, lập phương trình số mũ rồi kiểm tra lại.",
    skillName: "Giải bài toán ngược về số mũ",
    canonicalSkillId: "L03_ADV_REVERSE_EXPONENT",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Khám phá",
    learningGoal:
      "Đi ngược các quy tắc lũy thừa để tạo và giải phương trình đơn giản đối với số mũ.",
    companionMessage:
      "Đừng thử lần lượt x=0,1,2,... Hãy biến toàn bộ vế trái thành một lũy thừa duy nhất trước.",
    steps: [
      {
        id: "l3a3-step1",
        instruction:
          "Rút gọn vế trái thành một lũy thừa duy nhất của 2/3 và giải thích số mũ.",
        acceptedPatterns: ["(2/3)^(x+1)", "x+3-2", "x+1"],
        keyIdea:
          "Nhân thì cộng x+3, sau đó chia thì trừ 2, nên vế trái là (2/3)^(x+1).",
        hint1: "Giữ nguyên cơ số 2/3 và xử lí các số mũ theo thứ tự phép nhân, phép chia.",
        hint2: "Số mũ là x + 3 - 2.",
        explanation:
          "[(2/3)^x×(2/3)^3]:(2/3)^2=(2/3)^(x+3-2)=(2/3)^(x+1).",
      },
      {
        id: "l3a3-step2",
        instruction:
          "Từ (2/3)^(x+1)=(2/3)^6, lập phương trình số mũ và tìm x. Giải thích vì sao có thể so sánh số mũ.",
        acceptedPatterns: ["x+1=6", "x=5", "cùng cơ số"],
        requiredPatternGroups: [["x+1=6", "x+1 = 6"], ["x=5", "x = 5"]],
        keyIdea:
          "Hai lũy thừa có cùng cơ số 2/3 (dương và khác 1), nên số mũ bằng nhau: x+1=6, suy ra x=5.",
        hint1: "Hai vế có cùng cơ số 2/3. Hãy so sánh số mũ.",
        hint2: "Lập x+1=6.",
        explanation:
          "Vì 0<2/3<1 nên các lũy thừa với số mũ tự nhiên khác nhau có giá trị khác nhau; do đó x+1=6 và x=5.",
      },
      {
        id: "l3a3-step3",
        instruction:
          "Thay x=5 vào biểu thức ban đầu để kiểm tra và kết luận.",
        acceptedPatterns: ["5+3-2=6", "(2/3)^6", "x=5"],
        keyIdea:
          "Thay x=5 cho số mũ 5+3-2=6, đúng bằng vế phải (2/3)^6.",
        hint1: "Thay 5 vào đúng vị trí x rồi chỉ xử lí số mũ.",
        hint2: "5+3-2 bằng bao nhiêu?",
        explanation:
          "Vế trái=(2/3)^(5+3-2)=(2/3)^6, bằng vế phải. Vậy x=5 là nghiệm.",
      },
    ],
    finalAnswer:
      "Vế trái=(2/3)^(x+1). Suy ra x+1=6 nên x=5; thay lại cho số mũ 5+3-2=6 nên nghiệm đúng.",
  },
];
