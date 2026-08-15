import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson7AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l7-advanced-opposites-structure",
    lessonId: "lesson-player-07",
    knowledgeNodeId: "lesson-7-tap-hop-cac-so-thuc",
    title: "Số đối trong R: từ biểu thức đến cấu trúc",
    prompt:
      "Cho A = 3 - √2. Hãy tìm số đối của A, giải thích bằng tổng bằng 0 và chỉ ra vì sao viết √2 - 3 là đúng. Không được chỉ đổi dấu theo cảm tính.",
    skillName: "Suy luận số đối của số thực bằng định nghĩa tổng bằng 0",
    canonicalSkillId: "L07_ADV_REAL_OPPOSITE_REASONING",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Số đối có căn cứ",
    learningGoal:
      "Dùng định nghĩa số đối để biến đổi biểu thức số thực và kiểm chứng bằng tổng bằng 0.",
    companionMessage:
      "Số đối không chỉ là thao tác 'đổi dấu'. Hãy tìm B sao cho A+B=0 rồi rút gọn.",
    steps: [
      {
        id: "l7a1-step1",
        instruction:
          "Gọi B là số đối của A. Viết điều kiện định nghĩa liên hệ A và B.",
        acceptedPatterns: ["A+B=0", "B=-A"],
        keyIdea:
          "Hai số đối nhau có tổng bằng 0, nên A+B=0 và B=-A.",
        hint1: "Định nghĩa số đối dựa vào phép cộng.",
        hint2: "Nếu B đối của A thì A+B bằng bao nhiêu?",
        explanation:
          "B là số đối của A khi và chỉ khi A+B=0; tương đương B=-A.",
      },
      {
        id: "l7a1-step2",
        instruction:
          "Từ B=-(3-√2), bỏ ngoặc đúng để tìm B dưới dạng đơn giản.",
        acceptedPatterns: ["-(3-√2)=-3+√2", "√2-3"],
        keyIdea:
          "B=-(3-√2)=-3+√2=√2-3.",
        hint1: "Dấu trừ trước ngoặc đổi dấu từng hạng tử.",
        hint2: "-(3-√2)=-3+√2.",
        explanation:
          "B=-3+√2=√2-3.",
      },
      {
        id: "l7a1-step3",
        instruction:
          "Kiểm chứng bằng cách cộng A với B và rút gọn về 0.",
        acceptedPatterns: ["(3-√2)+(√2-3)=0", "3-√2+√2-3=0"],
        keyIdea:
          "(3-√2)+(√2-3)=3-3-√2+√2=0.",
        hint1: "Ghép 3 với -3 và -√2 với +√2.",
        hint2: "Nếu tổng chưa về 0 thì số đối hoặc bước bỏ ngoặc đang sai.",
        explanation:
          "Tổng bằng 0 xác nhận √2-3 chính là số đối của 3-√2.",
      },
    ],
    finalAnswer:
      "Số đối của A=3-√2 là B=-(3-√2)=√2-3, vì (3-√2)+(√2-3)=0.",
  },
  {
    id: "l7-advanced-real-line-order",
    lessonId: "lesson-player-07",
    knowledgeNodeId: "lesson-7-tap-hop-cac-so-thuc",
    title: "Đặt √2 trên trục số và so sánh mà không dùng máy tính căn",
    prompt:
      "Không dùng máy tính căn, hãy xác định √2 nằm giữa 1,4 và 1,5 trên trục số. Sau đó quyết định √2 nằm bên trái hay bên phải 1,42. Mọi kết luận phải dựa trên bình phương.",
    skillName: "Định vị và so sánh số thực trên trục số bằng bình phương",
    canonicalSkillId: "L07_ADV_REAL_LINE_ORDER",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Trục số và thứ tự",
    learningGoal:
      "Kết nối bình phương, thứ tự số dương và vị trí trên trục số để định vị số vô tỉ.",
    companionMessage:
      "Trên trục số, số lớn hơn nằm bên phải. Nhưng trước hết em phải chứng minh √2 lớn hay nhỏ hơn các mốc bằng bình phương.",
    steps: [
      {
        id: "l7a2-step1",
        instruction:
          "Tính 1,4² và 1,5² rồi suy ra khoảng chứa √2.",
        acceptedPatterns: ["1,4²=1,96", "1,5²=2,25", "1,4<√2<1,5"],
        keyIdea:
          "1,4²=1,96<2<2,25=1,5² nên 1,4<√2<1,5.",
        hint1: "Cả 1,4; √2; 1,5 đều không âm.",
        hint2: "So 1,96 và 2,25 với 2.",
        explanation:
          "Vì các số đang xét không âm, thứ tự bình phương cho 1,4<√2<1,5.",
      },
      {
        id: "l7a2-step2",
        instruction:
          "Tính 1,42² và so với 2 để quyết định √2 so với 1,42.",
        acceptedPatterns: ["1,42²=2,0164", "√2<1,42"],
        keyIdea:
          "1,42²=2,0164>2 nên √2<1,42.",
        hint1: "Nếu một số dương có bình phương lớn hơn 2 thì nó lớn hơn √2.",
        hint2: "1,42²=2,0164.",
        explanation:
          "1,42²>2=(√2)² và hai số đều không âm, nên 1,42>√2.",
      },
      {
        id: "l7a2-step3",
        instruction:
          "Diễn giải trên trục số: √2 nằm ở đâu so với 1,4; 1,42; 1,5?",
        acceptedPatterns: ["1,4<√2<1,42<1,5", "bên phải 1,4", "bên trái 1,42"],
        keyIdea:
          "1,4<√2<1,42<1,5; vì thế √2 nằm bên phải 1,4 và bên trái 1,42.",
        hint1: "Số nhỏ hơn nằm bên trái trên trục số.",
        hint2: "Ghép hai kết quả trước thành một chuỗi thứ tự.",
        explanation:
          "Vị trí đúng là 1,4<√2<1,42<1,5.",
      },
    ],
    finalAnswer:
      "1,4²=1,96<2<2,25=1,5² nên 1,4<√2<1,5. Vì 1,42²=2,0164>2 nên √2<1,42. Do đó 1,4<√2<1,42<1,5.",
  },
  {
    id: "l7-advanced-absolute-distance",
    lessonId: "lesson-player-07",
    knowledgeNodeId: "lesson-7-tap-hop-cac-so-thuc",
    title: "Khoảng cách trên trục số: tìm điểm cách √2 đúng 1 đơn vị",
    prompt:
      "Trên trục số thực, tìm tất cả các số x cách √2 đúng 1 đơn vị. Hãy lập phương trình khoảng cách, tìm đủ hai nghiệm và giải thích vị trí của chúng so với √2.",
    skillName: "Mô hình hóa khoảng cách trên trục số bằng giá trị tuyệt đối",
    canonicalSkillId: "L07_ADV_ABSOLUTE_DISTANCE_MODEL",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Khoảng cách và giá trị tuyệt đối",
    learningGoal:
      "Dùng giá trị tuyệt đối như khoảng cách để giải bài toán hai vị trí đối xứng quanh một số thực.",
    companionMessage:
      "Khoảng cách từ x đến √2 là |x-√2|. Một khoảng cách dương thường cho hai vị trí trên trục số.",
    steps: [
      {
        id: "l7a3-step1",
        instruction:
          "Chuyển câu 'x cách √2 đúng 1 đơn vị' thành một phương trình giá trị tuyệt đối.",
        acceptedPatterns: ["|x-√2|=1"],
        keyIdea:
          "Khoảng cách giữa x và √2 là |x-√2|, nên |x-√2|=1.",
        hint1: "Khoảng cách giữa hai số a và b là |a-b|.",
        hint2: "Thay a=x, b=√2 và khoảng cách bằng 1.",
        explanation:
          "Mô hình đúng là |x-√2|=1.",
      },
      {
        id: "l7a3-step2",
        instruction:
          "Từ |x-√2|=1, xét đủ hai trường hợp và tìm tất cả nghiệm.",
        acceptedPatterns: ["x-√2=1", "x-√2=-1", "x=√2+1", "x=√2-1"],
        keyIdea:
          "x-√2=1 hoặc x-√2=-1, nên x=√2+1 hoặc x=√2-1.",
        hint1: "|u|=1 thì u=1 hoặc u=-1.",
        hint2: "Đặt u=x-√2.",
        explanation:
          "Có hai nghiệm: √2+1 và √2-1.",
      },
      {
        id: "l7a3-step3",
        instruction:
          "Giải thích hình học vì sao phải có hai nghiệm và chúng nằm ở đâu so với √2.",
        acceptedPatterns: ["một bên trái", "một bên phải", "cách 1 đơn vị", "√2-1", "√2+1"],
        keyIdea:
          "√2-1 nằm bên trái √2 một đơn vị; √2+1 nằm bên phải √2 một đơn vị.",
        hint1: "Trên một đường thẳng, từ một điểm đi 1 đơn vị có mấy hướng?",
        hint2: "Trừ 1 đi sang trái, cộng 1 đi sang phải.",
        explanation:
          "Hai nghiệm đối xứng qua điểm √2 và đều cách √2 đúng 1 đơn vị.",
      },
    ],
    finalAnswer:
      "|x-√2|=1 nên x-√2=±1. Vì vậy x=√2-1 hoặc x=√2+1; hai điểm nằm hai phía của √2 và cùng cách √2 một đơn vị.",
  },
];
