import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson13AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l13-advanced-correspondence",
    lessonId: "lesson-player-13",
    knowledgeNodeId: "lesson-13-hai-tam-giac-bang-nhau-ccc",
    title: "Khóa đúng thứ tự đỉnh trước khi kết luận hai tam giác bằng nhau",
    prompt:
      "Cho AB = DE, BC = EF, CA = FD. Hãy xác định đúng sự tương ứng giữa các đỉnh của ΔABC và tam giác còn lại, rồi viết kí hiệu hai tam giác bằng nhau theo đúng thứ tự. Giải thích vì sao không thể tùy ý đổi thứ tự đỉnh.",
    skillName: "Xác định tương ứng đỉnh từ ba cặp cạnh",
    canonicalSkillId: "L13_ADV_CCC_VERTEX_CORRESPONDENCE",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Khóa tương ứng đỉnh",
    learningGoal:
      "Suy ra đúng ánh xạ đỉnh từ ba cặp cạnh trước khi viết kí hiệu hai tam giác bằng nhau.",
    companionMessage:
      "Đừng nhìn tên tam giác trước. Hãy xem đỉnh nào là giao của hai cạnh tương ứng.",
    steps: [
      {
        id: "l13a1-step1",
        instruction:
          "Từ AB↔DE và CA↔FD, xác định đỉnh A tương ứng với đỉnh nào và nêu căn cứ.",
        acceptedPatterns: ["A↔D", "A tương ứng D", "AB và AC", "DE và DF"],
        keyIdea:
          "A là đỉnh chung của AB và AC; D là đỉnh chung của DE và DF, nên A↔D.",
        hint1: "Tìm giao của hai cạnh chứa A.",
        hint2: "AB, AC tương ứng DE, DF.",
        explanation:
          "Đỉnh tương ứng được xác định bởi các cạnh tương ứng cùng đi qua nó.",
      },
      {
        id: "l13a1-step2",
        instruction:
          "Xác định tiếp B↔? và C↔? rồi kiểm tra với cặp BC↔EF.",
        acceptedPatterns: ["B↔E", "C↔F", "BC↔EF"],
        keyIdea:
          "Từ AB↔DE và A↔D suy ra B↔E; từ AC↔DF suy ra C↔F; khi đó BC↔EF khớp.",
        hint1: "A đã ghép với D.",
        hint2: "Cặp cạnh thứ ba dùng để kiểm tra tính nhất quán.",
        explanation:
          "Ánh xạ đầy đủ là A↔D, B↔E, C↔F.",
      },
      {
        id: "l13a1-step3",
        instruction:
          "Viết kết luận bằng nhau đúng thứ tự và giải thích lỗi của ΔABC = ΔDFE.",
        acceptedPatterns: ["ΔABC=ΔDEF", "ABC=DEF", "DFE sai", "sai thứ tự"],
        keyIdea:
          "Đúng là ΔABC=ΔDEF. ΔDFE sai vì khi đó B bị ghép với F thay vì E.",
        hint1: "Đọc lần lượt A↔D, B↔E, C↔F.",
        hint2: "Kí hiệu bằng nhau mang thông tin tương ứng đỉnh.",
        explanation:
          "Thứ tự đỉnh không phải trang trí; nó mã hóa các cặp tương ứng.",
      },
    ],
    finalAnswer:
      "A↔D vì A là giao của AB,AC còn D là giao của DE,DF. Sau đó B↔E, C↔F và BC↔EF xác nhận ánh xạ. Vì vậy ΔABC=ΔDEF theo c.c.c.; viết ΔABC=ΔDFE là sai thứ tự.",
  },
  {
    id: "l13-advanced-ccc-proof",
    lessonId: "lesson-player-13",
    knowledgeNodeId: "lesson-13-hai-tam-giac-bang-nhau-ccc",
    title: "Chứng minh c.c.c. rồi mới suy ra góc tương ứng",
    prompt:
      "Cho hai tam giác ABC và MNP có AB=MN, BC=NP, AC=MP. Hãy chứng minh ∠B=∠N. Không được dùng ∠B=∠N như giả thiết và không được kết luận góc bằng nhau trước khi chứng minh hai tam giác bằng nhau.",
    skillName: "Lập chuỗi chứng minh c.c.c. đến góc tương ứng",
    canonicalSkillId: "L13_ADV_CCC_PROOF_CHAIN",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Chuỗi chứng minh c.c.c.",
    learningGoal:
      "Tổ chức chứng minh theo đúng thứ tự: ba cặp cạnh → hai tam giác bằng nhau → góc tương ứng bằng nhau.",
    companionMessage:
      "Mục tiêu là góc, nhưng cây cầu phải đi qua c.c.c. trước.",
    steps: [
      {
        id: "l13a2-step1",
        instruction:
          "Liệt kê đủ ba cặp cạnh bằng nhau và xác định ánh xạ đỉnh.",
        acceptedPatterns: ["AB=MN", "BC=NP", "AC=MP", "A↔M", "B↔N", "C↔P"],
        keyIdea:
          "AB=MN, BC=NP, AC=MP cho ánh xạ A↔M, B↔N, C↔P.",
        hint1: "Không được bỏ cặp cạnh thứ ba.",
        hint2: "Kiểm tra B là giao của AB và BC; N là giao của MN và NP.",
        explanation:
          "Ba cặp cạnh và ánh xạ đúng là dữ liệu cần cho c.c.c.",
      },
      {
        id: "l13a2-step2",
        instruction:
          "Kết luận hai tam giác bằng nhau và ghi rõ trường hợp.",
        acceptedPatterns: ["ΔABC=ΔMNP", "c.c.c", "ccc"],
        keyIdea:
          "ΔABC=ΔMNP theo trường hợp c.c.c.",
        hint1: "Giữ đúng thứ tự A↔M, B↔N, C↔P.",
        hint2: "Nêu tên trường hợp bằng nhau.",
        explanation:
          "Đây là bước trung gian bắt buộc trước khi suy ra góc.",
      },
      {
        id: "l13a2-step3",
        instruction:
          "Từ hai tam giác bằng nhau, suy ra ∠B=∠N và nêu lý do.",
        acceptedPatterns: ["∠B=∠N", "góc tương ứng", "hai tam giác bằng nhau"],
        keyIdea:
          "Vì ΔABC=ΔMNP nên các góc tương ứng bằng nhau; B↔N nên ∠B=∠N.",
        hint1: "Dùng hệ quả của hai tam giác bằng nhau.",
        hint2: "Nhắc lại B↔N.",
        explanation:
          "Kết luận góc chỉ hợp lệ sau khi c.c.c. đã được thiết lập.",
      },
    ],
    finalAnswer:
      "AB=MN, BC=NP, AC=MP và A↔M, B↔N, C↔P. Suy ra ΔABC=ΔMNP theo c.c.c. Do đó các góc tương ứng bằng nhau, nên ∠B=∠N.",
  },
  {
    id: "l13-advanced-insufficient-data",
    lessonId: "lesson-player-13",
    knowledgeNodeId: "lesson-13-hai-tam-giac-bang-nhau-ccc",
    title: "Phản biện: hai cặp cạnh bằng nhau đã đủ cho c.c.c. chưa?",
    prompt:
      "Một bạn lập luận: “AB=DE và AC=DF nên ΔABC=ΔDEF theo c.c.c.” Hãy đánh giá lập luận. Nếu chưa đủ, chỉ rõ dữ kiện còn thiếu và giải thích vì sao không được suy ra các góc tương ứng bằng nhau.",
    skillName: "Phát hiện thiếu dữ kiện trong chứng minh c.c.c.",
    canonicalSkillId: "L13_ADV_CCC_INSUFFICIENT_EVIDENCE",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chống kết luận thiếu dữ kiện",
    learningGoal:
      "Nhận biết c.c.c. bắt buộc có ba cặp cạnh tương ứng bằng nhau và ngăn false proof từ hai cặp cạnh.",
    companionMessage:
      "Tên trường hợp là c.c.c.: hãy đếm xem lập luận đã thật sự có đủ ba chữ c chưa.",
    steps: [
      {
        id: "l13a3-step1",
        instruction:
          "Đánh giá kết luận “theo c.c.c.” khi mới có AB=DE và AC=DF.",
        acceptedPatterns: ["chưa đủ", "sai", "mới có hai cặp cạnh"],
        keyIdea:
          "Chưa đủ điều kiện c.c.c. vì mới biết hai cặp cạnh bằng nhau.",
        hint1: "c.c.c. cần bao nhiêu cặp cạnh?",
        hint2: "Hai không phải ba.",
        explanation:
          "Không được gọi tên trường hợp c.c.c. khi thiếu một cặp cạnh.",
      },
      {
        id: "l13a3-step2",
        instruction:
          "Nêu chính xác dữ kiện cạnh còn thiếu để có thể áp dụng c.c.c. theo thứ tự ABC↔DEF.",
        acceptedPatterns: ["BC=EF", "cạnh thứ ba"],
        keyIdea:
          "Cần thêm BC=EF.",
        hint1: "A↔D, B↔E, C↔F.",
        hint2: "Cạnh nối B,C phải tương ứng cạnh nối E,F.",
        explanation:
          "BC=EF hoàn tất ba cặp cạnh tương ứng.",
      },
      {
        id: "l13a3-step3",
        instruction:
          "Giải thích vì sao trước khi có BC=EF không được suy ra ∠B=∠E hoặc ∠C=∠F.",
        acceptedPatterns: ["chưa chứng minh hai tam giác bằng nhau", "không đủ dữ kiện", "góc tương ứng"],
        keyIdea:
          "Chưa đủ c.c.c. nên chưa chứng minh được hai tam giác bằng nhau; vì thế chưa có căn cứ dùng hệ quả góc tương ứng.",
        hint1: "Góc tương ứng bằng nhau là hệ quả sau bước nào?",
        hint2: "Không được đảo thứ tự chứng minh.",
        explanation:
          "Thiếu dữ kiện cạnh làm đứt chuỗi suy luận trước bước kết luận góc.",
      },
    ],
    finalAnswer:
      "Lập luận sai vì mới có hai cặp cạnh. Muốn dùng c.c.c. theo ABC↔DEF phải thêm BC=EF. Trước khi đủ ba cặp cạnh và chứng minh ΔABC=ΔDEF, chưa có căn cứ suy ra các góc tương ứng bằng nhau.",
  },
];
