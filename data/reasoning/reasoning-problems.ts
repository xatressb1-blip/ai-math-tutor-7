import type { ReasoningProblem } from "@/types/reasoning";

export const reasoningProblems: ReasoningProblem[] = [
  {
    id: "reasoning-l1-compare",
    lessonId: "lesson-player-01",
    knowledgeNodeId: "lesson-1-tap-hop-so-huu-ti",
    title: "So sánh hai số hữu tỉ",
    prompt: "So sánh -3/4 và -2/3. Hãy trình bày từng bước, không chỉ ghi dấu > hoặc <.",
    skillName: "So sánh số hữu tỉ",
    difficulty: 2,
    steps: [
      {
        id: "common-denominator",
        instruction: "Bước 1: Đưa hai phân số về cùng mẫu số dương.",
        acceptedPatterns: ["-9/12", "-8/12", "mau 12", "mẫu 12"],
        keyIdea: "Quy đồng về mẫu 12: -3/4 = -9/12 và -2/3 = -8/12.",
        hint1: "Bội chung nhỏ của 4 và 3 là bao nhiêu?",
        hint2: "Hãy thử đổi cả hai phân số về mẫu 12.",
        explanation: "Ta có -3/4 = -9/12 và -2/3 = -8/12.",
        misconceptionPatterns: [
          {
            pattern: "-6/12",
            category: "CALCULATION",
            label: "Quy đồng tử chưa đúng",
            feedback: "Khi nhân mẫu 4 lên 12, tử -3 cũng phải nhân 3.",
          },
        ],
      },
      {
        id: "compare-numerators",
        instruction: "Bước 2: So sánh hai tử số sau khi đã cùng mẫu.",
        acceptedPatterns: ["-9 < -8", "-9<-8", "-9 nho hon -8", "-9 nhỏ hơn -8"],
        keyIdea: "Với cùng mẫu dương, so sánh tử: -9 < -8.",
        hint1: "Trên trục số, -9 và -8 số nào nằm bên trái?",
        hint2: "-9 nhỏ hơn -8.",
        explanation: "Vì -9 < -8 nên -9/12 < -8/12.",
      },
      {
        id: "conclusion",
        instruction: "Bước 3: Kết luận bằng hai phân số ban đầu.",
        acceptedPatterns: ["-3/4 < -2/3", "-3/4<-2/3"],
        keyIdea: "Kết luận -3/4 < -2/3.",
        hint1: "Thay -9/12 và -8/12 trở lại phân số ban đầu.",
        hint2: "Dấu so sánh là dấu <.",
        explanation: "Kết luận: -3/4 < -2/3.",
      },
    ],
    finalAnswer: "-3/4 < -2/3",
  },
  {
    id: "reasoning-l2-operation",
    lessonId: "lesson-player-02",
    knowledgeNodeId: "lesson-2-phep-tinh-so-huu-ti",
    title: "Tính biểu thức có số hữu tỉ",
    prompt: "Tính -5/6 + 1/4. Hãy giải từng bước và kiểm tra dấu của kết quả.",
    skillName: "Cộng trừ số hữu tỉ",
    difficulty: 2,
    steps: [
      {
        id: "lcm",
        instruction: "Bước 1: Chọn mẫu chung và quy đồng hai phân số.",
        acceptedPatterns: ["-10/12", "3/12", "mau 12", "mẫu 12"],
        keyIdea: "-5/6 = -10/12 và 1/4 = 3/12.",
        hint1: "Mẫu chung nhỏ nhất của 6 và 4 là 12.",
        hint2: "Nhân cả tử và mẫu của -5/6 với 2; của 1/4 với 3.",
        explanation: "Ta được -10/12 + 3/12.",
      },
      {
        id: "add-numerators",
        instruction: "Bước 2: Cộng hai tử số và giữ nguyên mẫu.",
        acceptedPatterns: ["-7/12", "-10 + 3 = -7", "-10+3=-7"],
        keyIdea: "-10 + 3 = -7 nên kết quả là -7/12.",
        hint1: "Tính riêng -10 + 3.",
        hint2: "Độ lớn 10 lớn hơn 3 nên tổng mang dấu âm.",
        explanation: "-10/12 + 3/12 = -7/12.",
        misconceptionPatterns: [
          {
            pattern: "7/12",
            category: "SIGN",
            label: "Bỏ mất dấu âm",
            feedback: "Độ lớn của phần âm lớn hơn phần dương nên kết quả phải âm.",
          },
        ],
      },
      {
        id: "final",
        instruction: "Bước 3: Kiểm tra phân số đã tối giản chưa và kết luận.",
        acceptedPatterns: ["-7/12", "toi gian", "tối giản"],
        keyIdea: "7 và 12 không có ước chung lớn hơn 1.",
        hint1: "Kiểm tra 7 có chia hết cho 2 hoặc 3 không.",
        hint2: "-7/12 đã tối giản.",
        explanation: "Kết quả cuối cùng là -7/12.",
      },
    ],
    finalAnswer: "-7/12",
  },
  {
    id: "reasoning-l3-powers",
    lessonId: "lesson-player-03",
    knowledgeNodeId: "lesson-3-luy-thua-so-huu-ti",
    title: "Biến đổi lũy thừa",
    prompt: "Rút gọn 2^10 : 2^4 × 2^2 về một lũy thừa của 2.",
    skillName: "Nhân chia lũy thừa cùng cơ số",
    difficulty: 2,
    steps: [
      {
        id: "division",
        instruction: "Bước 1: Xử lí phép chia hai lũy thừa cùng cơ số.",
        acceptedPatterns: ["2^6", "10-4=6", "10 - 4 = 6"],
        keyIdea: "2^10 : 2^4 = 2^(10-4) = 2^6.",
        hint1: "Chia hai lũy thừa cùng cơ số thì làm gì với số mũ?",
        hint2: "Lấy 10 - 4.",
        explanation: "2^10 : 2^4 = 2^6.",
        misconceptionPatterns: [
          {
            pattern: "2^14",
            category: "PROCEDURE",
            label: "Cộng số mũ trong phép chia",
            feedback: "Phép chia cùng cơ số phải trừ số mũ, không cộng.",
          },
        ],
      },
      {
        id: "multiplication",
        instruction: "Bước 2: Nhân kết quả với 2^2.",
        acceptedPatterns: ["2^8", "6+2=8", "6 + 2 = 8"],
        keyIdea: "2^6 × 2^2 = 2^(6+2) = 2^8.",
        hint1: "Nhân hai lũy thừa cùng cơ số thì cộng số mũ.",
        hint2: "6 + 2 = 8.",
        explanation: "Kết quả là 2^8.",
      },
    ],
    finalAnswer: "2^8",
  },
  {
    id: "reasoning-l4-transposition",
    lessonId: "lesson-player-04",
    knowledgeNodeId: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
    title: "Tìm x bằng quy tắc chuyển vế",
    prompt: "Tìm x biết x - 3/4 = 1/2. Hãy trình bày từng bước và kiểm tra kết quả.",
    skillName: "Quy tắc chuyển vế",
    difficulty: 2,
    steps: [
      {
        id: "transpose",
        instruction: "Bước 1: Chuyển -3/4 sang vế phải và nêu dấu mới.",
        acceptedPatterns: ["x = 1/2 + 3/4", "x=1/2+3/4", "+3/4", "đổi dấu"],
        keyIdea: "Chuyển -3/4 sang vế phải thành +3/4.",
        hint1: "Khi chuyển một số hạng sang vế kia, dấu thay đổi thế nào?",
        hint2: "-3/4 chuyển vế thành +3/4.",
        explanation: "x = 1/2 + 3/4.",
      },
      {
        id: "calculate",
        instruction: "Bước 2: Quy đồng và tính x.",
        acceptedPatterns: ["5/4", "2/4 + 3/4", "2/4+3/4"],
        keyIdea: "1/2 = 2/4 nên x = 5/4.",
        hint1: "Đưa 1/2 về mẫu 4.",
        hint2: "1/2 = 2/4.",
        explanation: "x = 5/4.",
      },
      {
        id: "check",
        instruction: "Bước 3: Thay x = 5/4 vào đẳng thức ban đầu.",
        acceptedPatterns: ["5/4 - 3/4 = 1/2", "2/4 = 1/2"],
        keyIdea: "5/4 - 3/4 = 1/2.",
        hint1: "Thay 5/4 vào x.",
        hint2: "Tính 5/4 - 3/4.",
        explanation: "Hai vế bằng nhau.",
      },
    ],
    finalAnswer: "x = 5/4",
  },
{
  id: "reasoning-l5-cycle",
  lessonId: "lesson-player-05",
  knowledgeNodeId: "lesson-5-thap-phan-vo-han-tuan-hoan",
  title: "Nhận biết chu kì",
  prompt: "Giải thích vì sao 0,2(7) là số thập phân vô hạn tuần hoàn và xác định chu kì.",
  skillName: "Số thập phân tuần hoàn",
  difficulty: 2,
  steps: [
    {
      id: "expand",
      instruction: "Bước 1: Viết vài chữ số đầu tiên theo kí hiệu (7).",
      acceptedPatterns: ["0,2777", "0.2777", "7 lap", "7 lặp"],
      keyIdea: "0,2(7) = 0,2777... nên chữ số 7 lặp lại mãi.",
      hint1: "Kí hiệu trong ngoặc cho biết phần nào lặp lại.",
      hint2: "Viết 0,2(7) thành 0,2777...",
      explanation: "Sau chữ số 2, chữ số 7 lặp lại vô hạn.",
    },
    {
      id: "cycle",
      instruction: "Bước 2: Nêu chu kì.",
      acceptedPatterns: ["chu ki 7", "chu kì 7", "7"],
      keyIdea: "Chu kì là 7.",
      hint1: "Chu kì là phần lặp lại.",
      hint2: "Chỉ có một chữ số lặp lại.",
      explanation: "Chu kì của 0,2(7) là 7.",
    },
  ],
  finalAnswer: "Chu kì là 7",
},
{
  id: "reasoning-l6-sqrt",
  lessonId: "lesson-player-06",
  knowledgeNodeId: "lesson-6-so-vo-ti-can-bac-hai",
  title: "Vì sao √49 = 7?",
  prompt: "Giải thích từng bước vì sao √49 = 7 và không viết √49 = ±7.",
  skillName: "Căn bậc hai số học",
  difficulty: 2,
  steps: [
    {
      id: "square",
      instruction: "Bước 1: Tìm số không âm có bình phương bằng 49.",
      acceptedPatterns: ["7^2=49", "7² = 49", "7*7=49", "7 × 7 = 49"],
      keyIdea: "7² = 49.",
      hint1: "Số nào nhân với chính nó bằng 49?",
      hint2: "7 × 7 = 49.",
      explanation: "7 là số không âm và 7² = 49.",
    },
    {
      id: "nonnegative",
      instruction: "Bước 2: Dùng định nghĩa căn bậc hai số học để kết luận.",
      acceptedPatterns: ["sqrt49=7", "√49 = 7", "khong am", "không âm"],
      keyIdea: "Căn bậc hai số học là số không âm.",
      hint1: "Kết quả của √a mang dấu gì?",
      hint2: "√a luôn không âm.",
      explanation: "Vì vậy √49 = 7; ±7 là hai căn bậc hai của 49, không phải giá trị của √49.",
      misconceptionPatterns: [
        {
          pattern: "±7",
          category: "CONCEPT",
          label: "Nhầm căn bậc hai số học với hai căn bậc hai",
          feedback: "Kí hiệu √49 chỉ lấy căn bậc hai không âm.",
        },
      ],
    },
  ],
  finalAnswer: "√49 = 7",
},
{
  id: "reasoning-l7-absolute",
  lessonId: "lesson-player-07",
  knowledgeNodeId: "lesson-7-tap-hop-so-thuc",
  title: "Giải thích giá trị tuyệt đối",
  prompt: "Giải thích vì sao |-5| = 5 bằng ý nghĩa khoảng cách trên trục số.",
  skillName: "Giá trị tuyệt đối",
  difficulty: 2,
  steps: [
    {
      id: "meaning",
      instruction: "Bước 1: Nêu ý nghĩa của |-5|.",
      acceptedPatterns: ["khoang cach", "khoảng cách", "den 0", "đến 0"],
      keyIdea: "|a| là khoảng cách từ a đến 0 trên trục số.",
      hint1: "Đừng dùng công thức trước; hãy nghĩ đến trục số.",
      hint2: "Giá trị tuyệt đối là khoảng cách đến 0.",
      explanation: "|-5| là khoảng cách từ -5 đến 0.",
    },
    {
      id: "distance",
      instruction: "Bước 2: Tính khoảng cách đó.",
      acceptedPatterns: ["5 don vi", "5 đơn vị", "=5", "= 5"],
      keyIdea: "Khoảng cách từ -5 đến 0 là 5 đơn vị.",
      hint1: "Từ -5 đến 0 đi qua bao nhiêu đơn vị?",
      hint2: "Khoảng cách là 5.",
      explanation: "Vì khoảng cách không âm nên |-5| = 5.",
    },
  ],
  finalAnswer: "|-5| = 5",
},
{
  id: "reasoning-l8-ke-bu-counterexample",
  lessonId: "lesson-player-08",
  knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
  title: "Phản ví dụ cho góc kề bù",
  prompt: "Hai góc có tổng 180° nhưng không chung cạnh. Một bạn kết luận chúng kề bù. Hãy chỉ ra lỗi.",
  skillName: "Nhận diện góc kề bù",
  difficulty: 2,
  steps: [
    {
      id: "conditions",
      instruction: "Bước 1: Nêu các điều kiện cần để hai góc là kề bù.",
      acceptedPatterns: ["kề nhau", "tia đối"],
      requiredPatternGroups: [
        ["kề nhau", "chung cạnh"],
        ["tia đối", "hai cạnh còn lại đối nhau"]
      ],
      keyIdea: "Kề bù cần vừa kề nhau vừa có hai cạnh còn lại là hai tia đối nhau.",
      hint1: "Tên 'kề bù' chứa hai điều kiện.",
      hint2: "Kiểm tra chung cạnh và hai cạnh còn lại.",
      explanation: "Hai góc phải kề nhau và hai cạnh còn lại là hai tia đối nhau.",
    },
    {
      id: "diagnose",
      instruction: "Bước 2: Nêu vì sao tổng 180° chưa đủ.",
      acceptedPatterns: ["không kề", "chưa đủ", "tổng 180"],
      keyIdea: "Tổng 180° chỉ cho biết hai góc bù, chưa cho biết chúng kề nhau.",
      hint1: "Đề nói hai góc không chung cạnh.",
      hint2: "Không kề nhau thì không thể gọi là kề bù.",
      explanation: "Kết luận của bạn sai vì thiếu điều kiện kề nhau.",
      misconceptionPatterns: [
        {
          pattern: "chỉ cần tổng 180",
          category: "CONCEPT",
          label: "KE_BU_SUM_ONLY",
          feedback: "Tổng 180° chỉ cho biết hai góc bù; em còn phải kiểm tra vị trí kề nhau."
        }
      ],
    },
  ],
  finalAnswer: "Không thể kết luận kề bù chỉ từ tổng 180°",
},
{
  id: "reasoning-l8-bisector",
  lessonId: "lesson-player-08",
  knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
  title: "Kiểm tra đủ điều kiện tia phân giác",
  prompt: "Om nằm trong ∠xOy, ∠xOm = ∠mOy và ∠xOy = 120°. Hãy giải thích vì sao Om là phân giác rồi tính ∠xOm.",
  skillName: "Điều kiện tia phân giác",
  difficulty: 2,
  steps: [
    {
      id: "definition",
      instruction: "Bước 1: Nêu đủ hai điều kiện cho thấy Om là tia phân giác.",
      acceptedPatterns: ["nằm trong", "xOm = mOy"],
      requiredPatternGroups: [
        ["nằm trong", "ở trong"],
        ["xOm = mOy", "hai góc bằng nhau"]
      ],
      keyIdea: "Om nằm trong góc và tạo hai góc bằng nhau.",
      hint1: "Định nghĩa có một điều kiện vị trí và một điều kiện số đo.",
      hint2: "Om nằm trong ∠xOy; ∠xOm = ∠mOy.",
      explanation: "Đủ hai điều kiện nên Om là tia phân giác.",
    },
    {
      id: "calculate",
      instruction: "Bước 2: Tính ∠xOm.",
      acceptedPatterns: ["60°", "120 : 2", "120/2"],
      keyIdea: "Tia phân giác chia 120° thành hai góc 60°.",
      hint1: "Hai phần bằng nhau.",
      hint2: "120 : 2.",
      explanation: "∠xOm = 60°.",
    },
  ],
  finalAnswer: "Om là tia phân giác và ∠xOm = 60°",
},
{
  id: "reasoning-l9-parallel",
  lessonId: "lesson-player-09",
  knowledgeNodeId: "lesson-9-hai-duong-thang-song-song-dau-hieu",
  title: "Dùng đúng dấu hiệu song song",
  prompt: "Đường c cắt a và b tạo một cặp góc so le trong cùng bằng 65°. Hãy chứng minh a ∥ b.",
  skillName: "Dấu hiệu so le trong",
  difficulty: 2,
  steps: [
    {
      id: "identify",
      instruction: "Bước 1: Nêu đủ vị trí và quan hệ của cặp góc.",
      acceptedPatterns: ["so le trong", "bằng nhau"],
      requiredPatternGroups: [
        ["so le trong"],
        ["bằng nhau", "cùng bằng 65"]
      ],
      keyIdea: "Đây là cặp góc so le trong bằng nhau.",
      hint1: "Nêu loại cặp góc trước.",
      hint2: "So le trong và cùng bằng 65°.",
      explanation: "Có một cặp góc so le trong bằng nhau.",
    },
    {
      id: "conclude",
      instruction: "Bước 2: Gọi đúng dấu hiệu và kết luận.",
      acceptedPatterns: ["dấu hiệu", "a ∥ b", "a song song b"],
      requiredPatternGroups: [
        ["dấu hiệu", "nhận biết"],
        ["a ∥ b", "a song song b", "a // b"]
      ],
      keyIdea: "Theo dấu hiệu nhận biết, a ∥ b.",
      hint1: "Đây là chiều góc → song song.",
      hint2: "Nêu tên dấu hiệu rồi kết luận a ∥ b.",
      explanation: "Theo dấu hiệu nhận biết hai đường thẳng song song, a ∥ b.",
      misconceptionPatterns: [
        {
          pattern: "tính chất hai đường thẳng song song",
          category: "CONCEPT",
          label: "DIRECTIONALITY_PROPERTY_FOR_SIGN",
          feedback: "Ở đây song song chưa được cho; em đang dùng dấu hiệu nhận biết, không phải tính chất."
        }
      ],
    },
  ],
  finalAnswer: "Theo dấu hiệu so le trong bằng nhau, a ∥ b",
},
{
  id: "reasoning-l9-invalid-pair",
  lessonId: "lesson-player-09",
  knowledgeNodeId: "lesson-9-hai-duong-thang-song-song-dau-hieu",
  title: "Hai góc bằng nhau bất kì chưa đủ",
  prompt: "Đường c cắt a và b. Hai góc bằng nhau nhưng không phải cặp so le trong hay đồng vị tương ứng. Có thể kết luận a ∥ b không? Vì sao?",
  skillName: "Điều kiện dấu hiệu song song",
  difficulty: 3,
  steps: [
    {
      id: "check-position",
      instruction: "Bước 1: Kiểm tra vị trí của cặp góc.",
      acceptedPatterns: ["không phải", "so le trong", "đồng vị"],
      requiredPatternGroups: [
        ["không phải", "không đúng"],
        ["so le trong", "đồng vị"]
      ],
      keyIdea: "Cặp góc không thuộc vị trí được dùng trong dấu hiệu.",
      hint1: "Không chỉ kiểm tra số đo; hãy kiểm tra loại cặp góc.",
      hint2: "Đề đã nói chúng không phải cặp thích hợp.",
      explanation: "Cặp góc không thỏa điều kiện vị trí.",
    },
    {
      id: "conclusion",
      instruction: "Bước 2: Kết luận mức độ đủ dữ kiện.",
      acceptedPatterns: ["chưa đủ", "không thể kết luận", "không kết luận"],
      keyIdea: "Hai góc bằng nhau bất kì không đủ để kết luận song song.",
      hint1: "Dấu hiệu cần cả vị trí lẫn quan hệ bằng nhau.",
      hint2: "Thiếu điều kiện vị trí nên chưa đủ.",
      explanation: "Không thể kết luận a ∥ b chỉ từ dữ kiện này.",
      misconceptionPatterns: [
        {
          pattern: "hai góc bằng nhau nên song song",
          category: "CONCEPT",
          label: "ANGLE_PAIR_TYPE_ERROR",
          feedback: "Hai góc bằng nhau bất kì không đủ; cần đúng cặp so le trong hoặc đồng vị."
        }
      ],
    },
  ],
  finalAnswer: "Chưa đủ dữ kiện để kết luận a ∥ b",
},
{
  id: "reasoning-l10-euclid",
  lessonId: "lesson-player-10",
  knowledgeNodeId: "lesson-10-tien-de-euclid-tinh-chat-song-song",
  title: "Tính góc từ giả thiết song song",
  prompt: "Biết a ∥ b, c cắt a và b. Một góc đồng vị bằng 110°. Tính góc đồng vị tương ứng và nêu chiều suy luận.",
  skillName: "Tính chất góc đồng vị",
  difficulty: 2,
  steps: [
    {
      id: "given-direction",
      instruction: "Bước 1: Xác định GIVEN và tên kiến thức cần dùng.",
      acceptedPatterns: ["a ∥ b", "tính chất"],
      requiredPatternGroups: [
        ["a ∥ b", "a song song b"],
        ["tính chất"]
      ],
      keyIdea: "Song song là GIVEN nên dùng tính chất hai đường thẳng song song.",
      hint1: "Điều nào đã được cho?",
      hint2: "a ∥ b là giả thiết; đây là chiều song song → góc.",
      explanation: "Dùng tính chất của hai đường thẳng song song.",
      misconceptionPatterns: [
        {
          pattern: "dấu hiệu nhận biết",
          category: "CONCEPT",
          label: "DIRECTIONALITY_SIGN_FOR_PROPERTY",
          feedback: "Dấu hiệu dùng khi cần suy ra song song. Ở đây a ∥ b đã là giả thiết."
        }
      ],
    },
    {
      id: "property",
      instruction: "Bước 2: Nêu quan hệ của hai góc đồng vị.",
      acceptedPatterns: ["đồng vị bằng nhau", "hai góc bằng nhau"],
      keyIdea: "Các góc đồng vị tương ứng bằng nhau.",
      hint1: "Đường c cắt hai đường song song.",
      hint2: "Góc đồng vị tương ứng bằng nhau.",
      explanation: "Hai góc đồng vị bằng nhau.",
    },
    {
      id: "answer",
      instruction: "Bước 3: Kết luận số đo.",
      acceptedPatterns: ["110°", "110"],
      keyIdea: "Góc tương ứng bằng 110°.",
      hint1: "Hai góc có cùng số đo.",
      hint2: "Giữ nguyên 110°.",
      explanation: "Góc đồng vị tương ứng bằng 110°.",
    },
  ],
  finalAnswer: "110° theo tính chất hai đường thẳng song song",
},
{
  id: "reasoning-l10-perpendicular",
  lessonId: "lesson-player-10",
  knowledgeNodeId: "lesson-10-tien-de-euclid-tinh-chat-song-song",
  title: "Vuông góc với một trong hai đường song song",
  prompt: "Biết a ∥ b và c ⟂ a. Hãy giải thích vì sao c ⟂ b.",
  skillName: "Vuông góc với hai đường song song",
  difficulty: 2,
  steps: [
    {
      id: "right-angle",
      instruction: "Bước 1: Từ c ⟂ a, nêu số đo góc c tạo với a.",
      acceptedPatterns: ["90°", "90"],
      keyIdea: "c ⟂ a nên góc tạo bởi c và a bằng 90°.",
      hint1: "Định nghĩa vuông góc.",
      hint2: "Góc vuông bằng 90°.",
      explanation: "Góc c với a là 90°.",
    },
    {
      id: "parallel-transfer",
      instruction: "Bước 2: Dùng a ∥ b để suy ra góc tương ứng c tạo với b.",
      acceptedPatterns: ["đồng vị", "90°", "bằng nhau"],
      requiredPatternGroups: [
        ["đồng vị", "tương ứng"],
        ["90°", "90", "bằng nhau"]
      ],
      keyIdea: "Góc tương ứng bằng 90°.",
      hint1: "Đường c là đường cắt hai đường song song a,b.",
      hint2: "Góc đồng vị tương ứng bằng nhau.",
      explanation: "Góc c tạo với b cũng bằng 90°.",
    },
    {
      id: "conclude",
      instruction: "Bước 3: Kết luận.",
      acceptedPatterns: ["c ⟂ b", "c vuông góc b"],
      keyIdea: "Góc tạo bởi c,b bằng 90° nên c ⟂ b.",
      hint1: "Quay lại định nghĩa vuông góc.",
      hint2: "Góc 90° ⇒ vuông góc.",
      explanation: "c ⟂ b.",
    },
  ],
  finalAnswer: "c ⟂ b",
},
{
  id: "reasoning-l11-theorem",
  lessonId: "lesson-player-11",
  knowledgeNodeId: "lesson-11-dinh-li-chung-minh",
  title: "GIVEN và GOAL của định lí",
  prompt: "Với định lí 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc đồng vị bằng nhau', hãy nêu GIVEN và GOAL.",
  skillName: "Giả thiết và kết luận",
  difficulty: 2,
  steps: [
    {
      id: "hypothesis",
      instruction: "Bước 1: Nêu đầy đủ giả thiết.",
      acceptedPatterns: ["hai đường thẳng song song", "đường cắt"],
      requiredPatternGroups: [
        ["hai đường thẳng song song", "a ∥ b"],
        ["đường cắt", "c cắt"]
      ],
      keyIdea: "GIVEN gồm hai đường thẳng song song và một đường cắt.",
      hint1: "Phần từ sau 'Nếu' đến trước 'thì'.",
      hint2: "Có hai dữ kiện: song song và đường cắt.",
      explanation: "GT: hai đường thẳng song song và có một đường cắt chúng.",
    },
    {
      id: "conclusion",
      instruction: "Bước 2: Nêu kết luận.",
      acceptedPatterns: ["góc đồng vị bằng nhau", "đồng vị bằng nhau"],
      keyIdea: "GOAL là cặp góc đồng vị tương ứng bằng nhau.",
      hint1: "Phần sau từ 'thì'.",
      hint2: "Điều cần suy ra là quan hệ giữa cặp góc.",
      explanation: "KL: cặp góc đồng vị tương ứng bằng nhau.",
    },
  ],
  finalAnswer: "GIVEN: song song + đường cắt; GOAL: góc đồng vị bằng nhau",
},
{
  id: "reasoning-l11-circular",
  lessonId: "lesson-player-11",
  knowledgeNodeId: "lesson-11-dinh-li-chung-minh",
  title: "Phát hiện chứng minh vòng tròn",
  prompt: "Cần chứng minh a ∥ b. Một lời giải mở đầu: 'Vì a ∥ b nên hai góc so le trong bằng nhau...'. Hãy chẩn đoán lỗi và sửa hướng.",
  skillName: "Phát hiện lập luận vòng tròn",
  difficulty: 3,
  steps: [
    {
      id: "diagnose",
      instruction: "Bước 1: Chỉ ra điều bạn ấy đã dùng sai.",
      acceptedPatterns: ["dùng kết luận", "giả sử a ∥ b", "vòng tròn"],
      keyIdea: "Bạn ấy dùng chính a ∥ b, điều cần chứng minh, làm tiền đề.",
      hint1: "So sánh câu mở đầu với GOAL.",
      hint2: "GOAL a ∥ b đã bị giả sử là đúng.",
      explanation: "Đây là lập luận vòng tròn.",
      misconceptionPatterns: [
        {
          pattern: "lời giải đúng",
          category: "PROCEDURE",
          label: "CIRCULAR_REASONING",
          feedback: "Không thể dùng chính kết luận làm giả thiết để chứng minh nó."
        }
      ],
    },
    {
      id: "repair",
      instruction: "Bước 2: Nêu hướng sửa hợp lệ.",
      acceptedPatterns: ["giả thiết", "góc so le trong", "góc đồng vị", "dấu hiệu"],
      requiredPatternGroups: [
        ["giả thiết", "dữ kiện"],
        ["dấu hiệu", "so le trong", "đồng vị"]
      ],
      keyIdea: "Phải xuất phát từ dữ kiện thật, chứng minh một cặp góc thích hợp bằng nhau rồi dùng dấu hiệu.",
      hint1: "Bắt đầu từ điều đề bài thực sự cho.",
      hint2: "Nếu chứng minh được cặp so le trong/đồng vị bằng nhau, dùng dấu hiệu song song.",
      explanation: "Sửa bằng chuỗi GIVEN → quan hệ góc → dấu hiệu → a ∥ b.",
    },
  ],
  finalAnswer: "Không dùng a ∥ b làm tiền đề; phải đi từ giả thiết đến dấu hiệu song song",
},
{
  id: "reasoning-l12-angle-sum",
  lessonId: "lesson-player-12",
  knowledgeNodeId: "lesson-12-academic12",
  title: "Tìm góc còn lại của tam giác",
  prompt: "Tam giác ABC có A = 50°, B = 60°. Hãy trình bày từng bước để tính C.",
  skillName: "Tính góc còn lại của tam giác",
  difficulty: 2,
  steps: [
    {
      id: "sum",
      instruction: "Bước 1: Nêu định lí cần dùng.",
      acceptedPatterns: ["tổng ba góc", "180"],
      requiredPatternGroups: [
        ["tổng ba góc"],
        ["180"]
      ],
      keyIdea: "Tổng ba góc trong tam giác bằng 180°.",
      hint1: "Nêu tên quan hệ trước khi tính.",
      hint2: "A + B + C = 180°.",
      explanation: "A + B + C = 180°.",
    },
    {
      id: "calc",
      instruction: "Bước 2: Tính C.",
      acceptedPatterns: ["70", "180 - 50 - 60"],
      keyIdea: "C = 70°.",
      hint1: "Lấy 180° trừ hai góc đã biết.",
      hint2: "180 - 50 - 60.",
      explanation: "C = 70°.",
    },
  ],
  finalAnswer: "C = 70°",
},
{
  id: "reasoning-l12-exterior",
  lessonId: "lesson-player-12",
  knowledgeNodeId: "lesson-12-academic12",
  title: "Góc ngoài của tam giác",
  prompt: "Góc ngoài tại C của tam giác ABC là 120°, góc A = 50°. Hãy tính góc B và nêu tính chất dùng.",
  skillName: "Góc ngoài của tam giác",
  difficulty: 2,
  steps: [
    {
      id: "property",
      instruction: "Bước 1: Nêu tính chất góc ngoài.",
      acceptedPatterns: ["góc ngoài", "hai góc trong không kề", "A + B"],
      requiredPatternGroups: [
        ["góc ngoài"],
        ["hai góc trong không kề", "A + B"]
      ],
      keyIdea: "Góc ngoài bằng tổng hai góc trong không kề.",
      hint1: "Không cần tìm góc C trước.",
      hint2: "120° = A + B.",
      explanation: "120° = 50° + B.",
    },
    {
      id: "calc",
      instruction: "Bước 2: Tính B.",
      acceptedPatterns: ["70°", "70", "120 - 50"],
      keyIdea: "B = 70°.",
      hint1: "Lấy góc ngoài trừ góc A.",
      hint2: "120 - 50.",
      explanation: "B = 70°.",
    },
  ],
  finalAnswer: "B = 70°",
},
{
  id: "reasoning-l13-sss",
  lessonId: "lesson-player-13",
  knowledgeNodeId: "lesson-13-academic13",
  title: "Lập luận c.c.c với đúng tương ứng",
  prompt: "Biết AB = DE, BC = EF, AC = DF. Hãy chứng minh ΔABC = ΔDEF.",
  skillName: "Trường hợp cạnh-cạnh-cạnh",
  difficulty: 2,
  steps: [
    {
      id: "pairs",
      instruction: "Bước 1: Viết đủ ba cặp cạnh tương ứng.",
      acceptedPatterns: ["AB = DE", "BC = EF", "AC = DF"],
      requiredPatternGroups: [
        ["AB = DE", "AB=DE"],
        ["BC = EF", "BC=EF"],
        ["AC = DF", "AC=DF"]
      ],
      keyIdea: "Phải có đủ ba cặp cạnh đúng tương ứng.",
      hint1: "Không chỉ viết 'ba cặp cạnh bằng nhau'; hãy liệt kê cụ thể.",
      hint2: "AB↔DE, BC↔EF, AC↔DF.",
      explanation: "AB = DE, BC = EF, AC = DF.",
    },
    {
      id: "conclude",
      instruction: "Bước 2: Nêu trường hợp và viết tên tam giác đúng thứ tự.",
      acceptedPatterns: ["c.c.c", "ΔABC = ΔDEF"],
      requiredPatternGroups: [
        ["c.c.c", "ccc", "cạnh-cạnh-cạnh"],
        ["ΔABC = ΔDEF", "ABC = DEF"]
      ],
      keyIdea: "Theo c.c.c, ΔABC = ΔDEF đúng thứ tự A↔D, B↔E, C↔F.",
      hint1: "Tên tam giác phải theo đúng đỉnh tương ứng.",
      hint2: "A↔D, B↔E, C↔F.",
      explanation: "ΔABC = ΔDEF theo c.c.c.",
      misconceptionPatterns: [
        {
          pattern: "ΔABC = ΔDFE",
          category: "PROCEDURE",
          label: "TRIANGLE_CORRESPONDENCE_ERROR",
          feedback: "Thứ tự đỉnh chưa đúng với ba cặp cạnh đã cho."
        }
      ],
    },
  ],
  finalAnswer: "ΔABC = ΔDEF theo c.c.c",
},
{
  id: "reasoning-l13-insufficient",
  lessonId: "lesson-player-13",
  knowledgeNodeId: "lesson-13-academic13",
  title: "Phát hiện dữ kiện chưa đủ cho c.c.c",
  prompt: "Biết AB = DE và BC = EF nhưng chưa biết AC, DF. Có thể dùng c.c.c để kết luận hai tam giác bằng nhau không?",
  skillName: "Điều kiện c.c.c",
  difficulty: 3,
  steps: [
    {
      id: "count",
      instruction: "Bước 1: Kiểm tra số cặp cạnh đã biết.",
      acceptedPatterns: ["hai cặp", "2 cặp", "thiếu AC", "thiếu DF"],
      keyIdea: "Mới có hai cặp cạnh tương ứng bằng nhau.",
      hint1: "c.c.c cần bao nhiêu cặp cạnh?",
      hint2: "Đề mới cho AB=DE và BC=EF.",
      explanation: "Còn thiếu quan hệ AC và DF.",
    },
    {
      id: "conclude",
      instruction: "Bước 2: Kết luận có dùng được c.c.c không.",
      acceptedPatterns: ["không", "chưa đủ"],
      keyIdea: "Chưa đủ dữ kiện cho c.c.c.",
      hint1: "Hai chữ 'c' chưa thành ba chữ 'c'.",
      hint2: "Cần thêm cặp cạnh thứ ba.",
      explanation: "Không thể dùng c.c.c từ hai cặp cạnh.",
      misconceptionPatterns: [
        {
          pattern: "đủ c.c.c",
          category: "CONCEPT",
          label: "INSUFFICIENT_CONGRUENCE_CONDITION",
          feedback: "c.c.c cần đủ ba cặp cạnh tương ứng bằng nhau."
        }
      ],
    },
  ],
  finalAnswer: "Chưa đủ dữ kiện cho c.c.c",
},
{
  id: "reasoning-l14-sas",
  lessonId: "lesson-player-14",
  knowledgeNodeId: "lesson-14-academic14",
  title: "Kiểm tra điều kiện c.g.c",
  prompt: "Biết AB = DE, AC = DF và ∠A = ∠D. Hãy giải thích vì sao có thể dùng c.g.c.",
  skillName: "Trường hợp cạnh-góc-cạnh",
  difficulty: 2,
  steps: [
    {
      id: "pairs",
      instruction: "Bước 1: Nêu hai cặp cạnh tương ứng.",
      acceptedPatterns: ["AB = DE", "AC = DF"],
      requiredPatternGroups: [
        ["AB = DE", "AB=DE"],
        ["AC = DF", "AC=DF"]
      ],
      keyIdea: "Có hai cặp cạnh tương ứng bằng nhau.",
      hint1: "Liệt kê cụ thể hai cặp cạnh.",
      hint2: "AB↔DE và AC↔DF.",
      explanation: "AB = DE và AC = DF.",
    },
    {
      id: "included-angle",
      instruction: "Bước 2: Giải thích vì sao ∠A, ∠D là góc xen giữa.",
      acceptedPatterns: ["AB và AC", "DE và DF", "góc xen giữa"],
      requiredPatternGroups: [
        ["AB và AC", "AB, AC"],
        ["DE và DF", "DE, DF"],
        ["góc xen giữa"]
      ],
      keyIdea: "∠A do AB,AC tạo; ∠D do DE,DF tạo nên chúng là các góc xen giữa.",
      hint1: "Tên hai cạnh tạo nên ∠A và ∠D.",
      hint2: "AB,AC tạo ∠A; DE,DF tạo ∠D.",
      explanation: "Hai góc đã cho là góc xen giữa hai cặp cạnh.",
      misconceptionPatterns: [
        {
          pattern: "mọi góc bằng nhau đều dùng c.g.c",
          category: "CONCEPT",
          label: "NON_INCLUDED_ANGLE_ERROR",
          feedback: "c.g.c yêu cầu góc bằng nhau phải là góc xen giữa hai cạnh đã biết."
        }
      ],
    },
    {
      id: "conclude",
      instruction: "Bước 3: Kết luận.",
      acceptedPatterns: ["c.g.c", "ΔABC = ΔDEF"],
      requiredPatternGroups: [
        ["c.g.c", "cgc", "cạnh-góc-cạnh"],
        ["ΔABC = ΔDEF", "ABC = DEF"]
      ],
      keyIdea: "Đủ c.g.c nên ΔABC = ΔDEF.",
      hint1: "Gọi tên trường hợp rồi viết kết luận.",
      hint2: "c.g.c → ΔABC = ΔDEF.",
      explanation: "ΔABC = ΔDEF theo c.g.c.",
    },
  ],
  finalAnswer: "ΔABC = ΔDEF theo c.g.c",
},
{
  id: "reasoning-l14-asa",
  lessonId: "lesson-player-14",
  knowledgeNodeId: "lesson-14-academic14",
  title: "Kiểm tra điều kiện g.c.g",
  prompt: "Biết ∠A = ∠D, AB = DE và ∠B = ∠E. Hãy giải thích vì sao có thể dùng g.c.g.",
  skillName: "Trường hợp góc-cạnh-góc",
  difficulty: 2,
  steps: [
    {
      id: "angles",
      instruction: "Bước 1: Nêu hai cặp góc tương ứng.",
      acceptedPatterns: ["A = D", "B = E"],
      requiredPatternGroups: [
        ["∠A = ∠D", "A = D"],
        ["∠B = ∠E", "B = E"]
      ],
      keyIdea: "Có hai cặp góc tương ứng bằng nhau.",
      hint1: "Liệt kê cụ thể hai cặp góc.",
      hint2: "A↔D và B↔E.",
      explanation: "∠A=∠D và ∠B=∠E.",
    },
    {
      id: "included-side",
      instruction: "Bước 2: Kiểm tra cạnh AB, DE có phải cạnh xen giữa.",
      acceptedPatterns: ["AB", "DE", "cạnh xen giữa"],
      requiredPatternGroups: [
        ["AB"],
        ["DE"],
        ["cạnh xen giữa", "nằm giữa hai góc"]
      ],
      keyIdea: "AB nằm giữa ∠A,∠B; DE nằm giữa ∠D,∠E.",
      hint1: "Cạnh nào nối hai đỉnh của hai góc đã biết?",
      hint2: "AB và DE là cạnh xen giữa.",
      explanation: "Đúng điều kiện cạnh xen giữa.",
      misconceptionPatterns: [
        {
          pattern: "cạnh bất kì",
          category: "CONCEPT",
          label: "NON_INCLUDED_SIDE_ERROR",
          feedback: "g.c.g yêu cầu cạnh tương ứng nằm giữa hai góc đã biết."
        }
      ],
    },
    {
      id: "conclude",
      instruction: "Bước 3: Nêu trường hợp và kết luận.",
      acceptedPatterns: ["g.c.g", "ΔABC = ΔDEF"],
      requiredPatternGroups: [
        ["g.c.g", "gcg", "góc-cạnh-góc"],
        ["ΔABC = ΔDEF", "ABC = DEF"]
      ],
      keyIdea: "Đủ g.c.g nên ΔABC = ΔDEF.",
      hint1: "Gọi tên trường hợp rồi kết luận.",
      hint2: "g.c.g → ΔABC = ΔDEF.",
      explanation: "ΔABC = ΔDEF theo g.c.g.",
    },
  ],
  finalAnswer: "ΔABC = ΔDEF theo g.c.g",
},
{
  id: "reasoning-l15-right",
  lessonId: "lesson-player-15",
  knowledgeNodeId: "lesson-15-academic15",
  title: "Chọn đúng trường hợp bằng nhau của tam giác vuông",
  prompt: "ΔABC và ΔDEF vuông tại A,D; BC = EF và AB = DE. Hãy xác định dữ kiện rồi gọi đúng trường hợp bằng nhau.",
  skillName: "Phân biệt trường hợp bằng nhau của tam giác vuông",
  difficulty: 2,
  steps: [
    { id:"identify", instruction:"Bước 1: Xác định cạnh huyền và cạnh góc vuông đã biết.", acceptedPatterns:["BC","EF","AB","DE","cạnh huyền"], keyIdea:"BC, EF là cạnh huyền; AB, DE là cạnh góc vuông.", hint1:"Cạnh nào đối diện góc vuông?", hint2:"BC và EF là cạnh huyền.", explanation:"Có một cặp cạnh huyền và một cặp cạnh góc vuông bằng nhau." },
    { id:"case", instruction:"Bước 2: Nêu trường hợp và kết luận.", acceptedPatterns:["cạnh huyền cạnh góc vuông","ΔABC = ΔDEF","ABC = DEF"], keyIdea:"Hai tam giác bằng nhau theo cạnh huyền-cạnh góc vuông.", hint1:"Tên trường hợp phải khớp đúng dữ kiện.", hint2:"Cạnh huyền-cạnh góc vuông.", explanation:"Suy ra ΔABC = ΔDEF." },
  ],
  finalAnswer: "ΔABC = ΔDEF theo cạnh huyền-cạnh góc vuông",
},
{
  id: "reasoning-l16-isosceles-converse",
  lessonId: "lesson-player-16",
  knowledgeNodeId: "lesson-16-academic16",
  title: "Dùng định lí đảo của tam giác cân",
  prompt: "Trong tam giác ABC, biết ∠B = ∠C. Hãy giải thích vì sao tam giác ABC cân tại A.",
  skillName: "Định lí đảo của tam giác cân",
  difficulty: 2,
  steps: [
    { id:"opposite-sides", instruction:"Bước 1: Xác định hai cạnh đối diện hai góc B và C.", acceptedPatterns:["AC","AB","đối diện"], keyIdea:"AC đối diện ∠B, AB đối diện ∠C.", hint1:"Mỗi góc đối diện cạnh nào?", hint2:"∠B đối diện AC; ∠C đối diện AB.", explanation:"Hai cạnh cần so sánh là AC và AB." },
    { id:"converse", instruction:"Bước 2: Dùng định lí đảo của tam giác cân.", acceptedPatterns:["AB = AC","AB=AC","tam giác cân","cân tại A"], keyIdea:"Hai góc bằng nhau thì hai cạnh đối diện bằng nhau.", hint1:"Nhớ chiều đảo của tính chất góc ở đáy.", hint2:"∠B = ∠C ⇒ AC = AB.", explanation:"AB = AC nên tam giác ABC cân tại A." },
  ],
  finalAnswer: "AB = AC, nên ΔABC cân tại A",
},
{
  id: "reasoning-l16-bisector-converse",
  lessonId: "lesson-player-16",
  knowledgeNodeId: "lesson-16-academic16",
  title: "Tính chất đảo của đường trung trực",
  prompt: "Biết MA = MB. Hãy giải thích vì sao M thuộc đường trung trực của AB.",
  skillName: "Tính chất đảo của đường trung trực",
  difficulty: 2,
  steps: [
    { id:"meaning", instruction:"Bước 1: Diễn giải MA = MB.", acceptedPatterns:["cách đều","A và B"], keyIdea:"M cách đều hai đầu A và B.", hint1:"MA và MB là hai khoảng cách nào?", hint2:"M cách A và B bằng nhau.", explanation:"M là điểm cách đều A và B." },
    { id:"conclude", instruction:"Bước 2: Dùng tính chất đảo để kết luận.", acceptedPatterns:["đường trung trực","M thuộc"], keyIdea:"Điểm cách đều hai đầu đoạn thẳng thuộc đường trung trực.", hint1:"Tập hợp điểm cách đều A và B nằm trên đường nào?", hint2:"Đường trung trực của AB.", explanation:"M thuộc đường trung trực của AB." },
  ],
  finalAnswer: "M thuộc đường trung trực của AB",
},
{
  id: "reasoning-l17-representative",
  lessonId: "lesson-player-17",
  knowledgeNodeId: "lesson-17-academic17",
  title: "Kiểm tra tính đại diện",
  prompt: "Muốn biết sở thích đọc sách của toàn trường nhưng chỉ hỏi học sinh câu lạc bộ sách. Hãy giải thích vấn đề của mẫu khảo sát.",
  skillName: "Nhận biết tính đại diện của dữ liệu thu thập.",
  difficulty: 2,
  steps: [
    { id:"target", instruction:"Bước 1: Xác định đối tượng cần kết luận.", acceptedPatterns:["toan truong", "toàn trường", "hoc sinh truong", "học sinh trường"], keyIdea:"Đối tượng cần tìm hiểu là toàn bộ học sinh trong trường.", hint1:"Câu hỏi muốn kết luận về ai?", hint2:"Toàn trường.", explanation:"Đích khảo sát là học sinh toàn trường." },
    { id:"bias", instruction:"Bước 2: Giải thích vì sao nhóm được hỏi chưa đại diện.", acceptedPatterns:["khong dai dien", "không đại diện", "thien lech", "thiên lệch", "cau lac bo sach", "câu lạc bộ sách"], keyIdea:"CLB sách có thể có sở thích đọc khác số đông, nên mẫu bị thiên lệch.", hint1:"Nhóm này có đặc điểm đặc biệt gì?", hint2:"Các bạn CLB sách thường quan tâm đọc sách hơn.", explanation:"Mẫu có nguy cơ thiên lệch và không đại diện cho toàn trường." },
  ],
  finalAnswer: "Mẫu không đại diện vì chỉ gồm học sinh CLB sách",
},
{
  id: "reasoning-l18-pie",
  lessonId: "lesson-player-18",
  knowledgeNodeId: "lesson-18-academic18",
  title: "Từ tỉ lệ đến số lượng",
  prompt: "Lớp có 40 học sinh, biểu đồ quạt tròn cho biết 25% thích bóng đá. Hãy tính số học sinh và giải thích.",
  skillName: "Đọc và mô tả dữ liệu từ biểu đồ hình quạt tròn.",
  difficulty: 2,
  steps: [
    { id:"percent", instruction:"Bước 1: Đổi 25% thành phép tính với 40.", acceptedPatterns:["40 x 25%", "40*0.25", "40 × 0,25", "1/4"], keyIdea:"25% = 1/4 nên lấy 40 × 25%.", hint1:"25% bằng phân số quen thuộc nào?", hint2:"25% = 1/4.", explanation:"Số học sinh = 40 × 25%." },
    { id:"answer", instruction:"Bước 2: Tính và kết luận.", acceptedPatterns:["10", "10 hoc sinh", "10 học sinh"], keyIdea:"40 × 0,25 = 10.", hint1:"Tính một phần tư của 40.", hint2:"40 : 4 = 10.", explanation:"Có 10 học sinh thích bóng đá." },
  ],
  finalAnswer: "10 học sinh",
},
{
  id: "reasoning-l19-trend",
  lessonId: "lesson-player-19",
  knowledgeNodeId: "lesson-19-academic19",
  title: "Mô tả xu hướng từ biểu đồ",
  prompt: "Dữ liệu bốn tháng lần lượt là 10, 12, 15, 14. Hãy mô tả xu hướng bằng từng bước.",
  skillName: "Nhận ra xu hướng hoặc quy luật đơn giản từ biểu đồ.",
  difficulty: 2,
  steps: [
    { id:"compare", instruction:"Bước 1: So sánh từng cặp tháng liên tiếp.", acceptedPatterns:["10 12 15", "tang", "tăng", "15 14", "giam", "giảm"], keyIdea:"10→12 tăng, 12→15 tăng, 15→14 giảm.", hint1:"So sánh từng cặp số liền nhau.", hint2:"Hai lần đầu tăng, lần cuối giảm.", explanation:"Dữ liệu tăng trong ba tháng đầu rồi giảm ở tháng cuối." },
    { id:"describe", instruction:"Bước 2: Viết nhận xét xu hướng chung.", acceptedPatterns:["tang roi giam", "tăng rồi giảm", "tang trong ba thang", "tăng trong ba tháng", "giam nhe", "giảm nhẹ"], keyIdea:"Xu hướng tăng đến tháng 3 rồi giảm nhẹ tháng 4.", hint1:"Gộp các so sánh thành một câu.", hint2:"Tăng trước, giảm nhẹ sau.", explanation:"Tăng trong ba tháng đầu và giảm nhẹ ở tháng cuối." },
  ],
  finalAnswer: "Tăng đến tháng 3 rồi giảm nhẹ ở tháng 4",
},

];

export function getReasoningProblemsByLesson(lessonId: string): ReasoningProblem[] {
  return reasoningProblems.filter((problem) => problem.lessonId === lessonId);
}
