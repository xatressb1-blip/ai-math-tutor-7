import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson4AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l4-advanced-operation-strategy",
    lessonId: "lesson-player-04",
    knowledgeNodeId: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
    title: "Tính đúng thứ tự nhưng vẫn phải chọn cách làm thông minh",
    prompt:
      "Tính A = 3/4 - [1/2 - (5/6 - 1/3)]. Em không chỉ nêu kết quả; hãy chỉ rõ thứ tự xử lí dấu ngoặc và giải thích vì sao không được tính từ trái sang phải một cách máy móc.",
    skillName: "Lựa chọn chiến lược thực hiện phép tính",
    canonicalSkillId: "L04_ADV_OPERATION_STRATEGY",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Vận dụng",
    learningGoal:
      "Thực hiện biểu thức nhiều tầng ngoặc đúng thứ tự và biết giải thích chiến lược tính.",
    companionMessage:
      "Em hãy coi các dấu ngoặc như những lớp cần mở từ trong ra ngoài. AI sẽ quan tâm thứ tự em chọn hơn là tốc độ tính.",
    steps: [
      {
        id: "l4a1-step1",
        instruction:
          "Tính ngoặc trong cùng 5/6 - 1/3 và giải thích vì sao phải bắt đầu từ đây.",
        acceptedPatterns: ["1/2", "5/6-1/3"],
        keyIdea:
          "Ngoặc trong cùng phải được xử lí trước: 5/6 - 1/3 = 5/6 - 2/6 = 1/2.",
        hint1: "Hãy nhìn dấu ngoặc nằm sâu nhất.",
        hint2: "Quy đồng 1/3 thành 2/6 rồi trừ.",
        explanation:
          "Ta bắt đầu từ ngoặc trong cùng vì biểu thức có các lớp ngoặc lồng nhau. 5/6 - 1/3 = 1/2.",
      },
      {
        id: "l4a1-step2",
        instruction:
          "Thay kết quả vừa tìm vào ngoặc vuông và tính 1/2 - 1/2. Nêu tác dụng của bước thay thế này.",
        acceptedPatterns: ["0", "1/2-1/2"],
        keyIdea:
          "Ngoặc vuông trở thành 1/2 - 1/2 = 0; việc thay kết quả của ngoặc trong giúp biểu thức đơn giản dần.",
        hint1: "Thay đúng kết quả 1/2 vào vị trí của ngoặc tròn.",
        hint2: "1/2 - 1/2 bằng bao nhiêu?",
        explanation:
          "Sau khi xử lí ngoặc trong, ngoặc vuông là 1/2 - 1/2 = 0. Biểu thức đã được rút gọn rất nhiều.",
      },
      {
        id: "l4a1-step3",
        instruction:
          "Kết luận giá trị A và giải thích vì sao cách làm 'từ ngoặc trong ra ngoài' đáng tin cậy hơn việc tính tùy ý.",
        acceptedPatterns: ["3/4", "a=3/4"],
        keyIdea:
          "A=3/4-0=3/4. Thực hiện đúng thứ tự giúp tránh thay đổi cấu trúc biểu thức và tránh sai dấu.",
        hint1: "Sau khi ngoặc vuông bằng 0, biểu thức còn lại rất ngắn.",
        hint2: "A = 3/4 - 0.",
        explanation:
          "A=3/4. Làm từ ngoặc trong ra ngoài giúp ta luôn giữ đúng cấu trúc và không bỏ sót dấu trừ.",
      },
    ],
    finalAnswer:
      "5/6-1/3=1/2; 1/2-1/2=0; do đó A=3/4. Thứ tự ngoặc phải được xử lí từ trong ra ngoài.",
  },
  {
    id: "l4-advanced-transposition-error",
    lessonId: "lesson-player-04",
    knowledgeNodeId: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
    title: "Bắt lỗi chuyển vế khi có số hữu tỉ âm",
    prompt:
      "Một bạn giải x - 2/3 = -5/6 như sau: x = -5/6 - 2/3 = -3/2. Em hãy chỉ ra chính xác lỗi, sửa lời giải và phát biểu quy tắc chuyển vế bằng lời của mình.",
    skillName: "Phân tích lỗi quy tắc chuyển vế",
    canonicalSkillId: "L04_ADV_TRANSPOSE_ERROR_ANALYSIS",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Suy luận",
    learningGoal:
      "Nhận ra lỗi đổi dấu khi chuyển vế và giải thích quy tắc thay vì chỉ sửa đáp số.",
    companionMessage:
      "Đừng chỉ nói '-3/2 sai'. Hãy chỉ đúng số hạng nào đã chuyển vế và dấu của nó phải thay đổi thế nào.",
    steps: [
      {
        id: "l4a2-step1",
        instruction:
          "Chỉ ra bước sai trong lời giải và nói dấu của -2/3 phải thay đổi thế nào khi chuyển sang vế phải.",
        acceptedPatterns: ["+2/3", "doi dau", "đổi dấu"],
        keyIdea:
          "Sai ở chỗ giữ -2/3 thành -2/3. Khi chuyển -2/3 sang vế phải, nó phải trở thành +2/3.",
        hint1: "Hãy nhìn số hạng -2/3 đang ở cùng vế với x.",
        hint2: "Chuyển một số hạng sang vế kia thì phải đổi dấu.",
        explanation:
          "Từ x - 2/3 = -5/6 phải suy ra x = -5/6 + 2/3, không phải trừ tiếp 2/3.",
      },
      {
        id: "l4a2-step2",
        instruction:
          "Tính lại x từ x = -5/6 + 2/3 và trình bày bước quy đồng.",
        acceptedPatterns: ["-1/6", "-5/6+4/6"],
        keyIdea:
          "-5/6 + 2/3 = -5/6 + 4/6 = -1/6.",
        hint1: "Đổi 2/3 thành phân số có mẫu 6.",
        hint2: "2/3 = 4/6.",
        explanation:
          "x=-5/6+4/6=-1/6.",
      },
      {
        id: "l4a2-step3",
        instruction:
          "Phát biểu quy tắc chuyển vế và kiểm tra lại x=-1/6 trong phương trình ban đầu.",
        acceptedPatterns: ["doi dau", "đổi dấu", "-1/6-2/3=-5/6"],
        keyIdea:
          "Chuyển một số hạng sang vế kia phải đổi dấu; thay x=-1/6 vào vế trái được -1/6-2/3=-5/6.",
        hint1: "Nêu quy tắc trước, sau đó thay x vào phương trình ban đầu.",
        hint2: "-1/6 - 2/3 = -1/6 - 4/6.",
        explanation:
          "Quy tắc: chuyển số hạng sang vế kia thì đổi dấu. Kiểm tra: -1/6-4/6=-5/6, đúng.",
      },
    ],
    finalAnswer:
      "Sai vì chuyển -2/3 mà không đổi thành +2/3. Đúng là x=-5/6+2/3=-1/6; thay lại cho vế trái bằng -5/6.",
  },
  {
    id: "l4-advanced-reverse-equation",
    lessonId: "lesson-player-04",
    knowledgeNodeId: "lesson-4-thu-tu-phep-tinh-chuyen-ve",
    title: "Tìm x bằng cách vừa rút gọn vừa chuyển vế",
    prompt:
      "Tìm x biết x - 3/4 + 1/2 = -1/3. Em phải rút gọn các số hạng đã biết trước, sau đó mới chuyển vế và cuối cùng thay lại để kiểm tra.",
    skillName: "Giải bài toán ngược bằng rút gọn và chuyển vế",
    canonicalSkillId: "L04_ADV_REVERSE_TRANSPOSE",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Khám phá",
    learningGoal:
      "Phối hợp rút gọn biểu thức với quy tắc chuyển vế trong một chuỗi suy luận nhiều bước.",
    companionMessage:
      "Đừng chuyển từng số hạng một cách vội vàng. Hãy xem -3/4 và +1/2 có thể gộp trước thành một số duy nhất hay không.",
    steps: [
      {
        id: "l4a3-step1",
        instruction:
          "Rút gọn -3/4 + 1/2 thành một số hữu tỉ và viết lại phương trình đơn giản hơn.",
        acceptedPatterns: ["-1/4", "x-1/4=-1/3"],
        keyIdea:
          "-3/4+1/2=-3/4+2/4=-1/4, nên phương trình trở thành x-1/4=-1/3.",
        hint1: "Quy đồng 1/2 thành 2/4.",
        hint2: "-3/4 + 2/4 = -1/4.",
        explanation:
          "Phương trình được rút gọn thành x-1/4=-1/3.",
      },
      {
        id: "l4a3-step2",
        instruction:
          "Dùng quy tắc chuyển vế để tìm x và trình bày phép tính phân số.",
        acceptedPatterns: ["x=-1/3+1/4", "-1/12", "-4/12+3/12"],
        keyIdea:
          "Chuyển -1/4 sang vế phải thành +1/4: x=-1/3+1/4=-4/12+3/12=-1/12.",
        hint1: "Chuyển -1/4 sang vế phải thì đổi dấu.",
        hint2: "x=-1/3+1/4; quy đồng mẫu 12.",
        explanation:
          "x=-4/12+3/12=-1/12.",
      },
      {
        id: "l4a3-step3",
        instruction:
          "Thay x=-1/12 vào biểu thức ban đầu để kiểm tra. Em phải chỉ ra vế trái trở thành -1/3.",
        acceptedPatterns: ["-1/12-3/4+1/2=-1/3", "-1/3"],
        keyIdea:
          "-1/12-3/4+1/2=-1/12-9/12+6/12=-4/12=-1/3, đúng bằng vế phải.",
        hint1: "Đưa cả ba số ở vế trái về mẫu 12.",
        hint2: "-1/12 - 9/12 + 6/12 = -4/12.",
        explanation:
          "Vế trái=-4/12=-1/3, bằng vế phải. Vậy x=-1/12 là nghiệm đúng.",
      },
    ],
    finalAnswer:
      "Rút gọn được x-1/4=-1/3; chuyển vế suy ra x=-1/12; thay lại cho vế trái bằng -1/3.",
  },
];
