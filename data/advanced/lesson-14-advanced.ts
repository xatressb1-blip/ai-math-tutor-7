import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson14AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l14-advanced-sas-included-angle",
    lessonId: "lesson-player-14",
    knowledgeNodeId: "lesson-14-cgc-gcg",
    title: "c.g.c.: góc nào mới thật sự là góc xen giữa?",
    prompt:
      "Cho AB=DE, AC=DF và ∠A=∠D. Một bạn kết luận ΔABC=ΔDEF theo c.g.c. Em hãy kiểm tra đầy đủ: xác định góc xen giữa hai cặp cạnh đã cho, khóa tương ứng đỉnh và giải thích vì sao nếu thay ∠A=∠D bằng ∠B=∠E thì chưa thể dùng c.g.c.",
    skillName: "Nhận diện góc xen giữa và áp dụng c.g.c. đúng điều kiện",
    canonicalSkillId: "L14_ADV_SAS_INCLUDED_ANGLE",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Khóa góc xen giữa",
    learningGoal:
      "Phân biệt dữ kiện c.g.c. hợp lệ với hai cạnh và một góc không xen giữa.",
    companionMessage:
      "Hãy tìm đỉnh chung của AB và AC. Góc c.g.c. phải nằm chính tại đỉnh chung ấy.",
    steps: [
      {
        id: "l14a1-step1",
        instruction: "Xác định góc xen giữa AB, AC và góc xen giữa DE, DF.",
        acceptedPatterns: ["∠A", "∠D", "AB và AC", "DE và DF"],
        keyIdea: "AB và AC gặp nhau tại A nên góc xen giữa là ∠A; DE và DF gặp nhau tại D nên góc xen giữa là ∠D.",
        hint1: "Góc xen giữa có hai cạnh là hai cạnh đang xét.",
        hint2: "Tìm đỉnh chung của từng cặp cạnh.",
        explanation: "Dữ kiện ∠A=∠D đúng vị trí cần cho c.g.c.",
      },
      {
        id: "l14a1-step2",
        instruction: "Từ AB=DE, AC=DF, ∠A=∠D, xác định tương ứng đỉnh và kết luận hai tam giác bằng nhau.",
        acceptedPatterns: ["A↔D", "B↔E", "C↔F", "ΔABC=ΔDEF", "c.g.c"],
        keyIdea: "A↔D, B↔E, C↔F; do đó ΔABC=ΔDEF theo c.g.c.",
        hint1: "AB↔DE và AC↔DF.",
        hint2: "Giữ đúng thứ tự A↔D, B↔E, C↔F.",
        explanation: "Hai cạnh và góc xen giữa tương ứng bằng nhau nên hai tam giác bằng nhau.",
      },
      {
        id: "l14a1-step3",
        instruction: "Phản biện trường hợp chỉ biết AB=DE, AC=DF, ∠B=∠E: vì sao chưa được kết luận theo c.g.c.?",
        acceptedPatterns: ["không xen giữa", "chưa đủ", "∠B không xen giữa AB và AC", "SSA"],
        keyIdea: "∠B không phải góc xen giữa AB và AC, nên bộ dữ kiện không phải c.g.c.; chưa đủ căn cứ kết luận hai tam giác bằng nhau.",
        hint1: "Hai cạnh đã cho ở tam giác ABC là AB và AC.",
        hint2: "Góc xen giữa của chúng là ∠A, không phải ∠B.",
        explanation: "Không được chỉ đếm 'hai cạnh + một góc'; vị trí của góc là điều kiện quyết định.",
      },
    ],
    finalAnswer:
      "Góc xen giữa AB,AC là ∠A; giữa DE,DF là ∠D. Vì AB=DE, AC=DF, ∠A=∠D nên A↔D, B↔E, C↔F và ΔABC=ΔDEF theo c.g.c. Nếu thay bằng ∠B=∠E thì góc không xen giữa hai cạnh đã cho, nên chưa thể áp dụng c.g.c.",
  },
  {
    id: "l14-advanced-asa-included-side",
    lessonId: "lesson-player-14",
    knowledgeNodeId: "lesson-14-cgc-gcg",
    title: "g.c.g.: cạnh phải nằm giữa đúng hai góc",
    prompt:
      "Cho ∠B=∠E, BC=EF, ∠C=∠F. Hãy chứng minh ΔABC=ΔDEF theo g.c.g., nhưng phải giải thích vì sao BC và EF là các cạnh xen giữa hai góc đã cho và viết đúng thứ tự tương ứng.",
    skillName: "Nhận diện cạnh xen giữa và lập chuỗi g.c.g.",
    canonicalSkillId: "L14_ADV_ASA_INCLUDED_SIDE",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Chuỗi g.c.g.",
    learningGoal:
      "Tổ chức chứng minh g.c.g. theo đúng vị trí hai góc kề và cạnh xen giữa.",
    companionMessage:
      "Hai góc đang nằm ở B,C. Cạnh nào nối trực tiếp B với C?",
    steps: [
      {
        id: "l14a2-step1",
        instruction: "Chỉ ra vì sao BC và EF là cạnh xen giữa hai góc tương ứng đã cho.",
        acceptedPatterns: ["BC nối B và C", "EF nối E và F", "cạnh xen giữa"],
        keyIdea: "BC nối hai đỉnh B,C của hai góc ∠B,∠C; EF nối E,F của ∠E,∠F, nên đây là hai cạnh xen giữa.",
        hint1: "Cạnh xen giữa phải nối hai đỉnh của hai góc.",
        hint2: "B,C ↔ E,F.",
        explanation: "Dữ kiện có đúng cấu trúc góc-cạnh-góc.",
      },
      {
        id: "l14a2-step2",
        instruction: "Khóa tương ứng đỉnh rồi kết luận hai tam giác bằng nhau theo g.c.g.",
        acceptedPatterns: ["B↔E", "C↔F", "A↔D", "ΔABC=ΔDEF", "g.c.g"],
        keyIdea: "B↔E, C↔F nên A↔D; suy ra ΔABC=ΔDEF theo g.c.g.",
        hint1: "Hai đầu BC lần lượt ghép với hai đầu EF.",
        hint2: "Đỉnh còn lại A phải ghép với D.",
        explanation: "Thứ tự ABC↔DEF nhất quán với cả hai góc và cạnh xen giữa.",
      },
      {
        id: "l14a2-step3",
        instruction: "Sau khi đã có ΔABC=ΔDEF, hãy suy ra một cặp cạnh chưa cho bằng nhau và nêu căn cứ.",
        acceptedPatterns: ["AB=DE", "AC=DF", "cạnh tương ứng", "hai tam giác bằng nhau"],
        keyIdea: "Từ hai tam giác bằng nhau, các cạnh tương ứng bằng nhau; chẳng hạn AB=DE (hoặc AC=DF).",
        hint1: "Chỉ dùng hệ quả sau khi đã chứng minh hai tam giác bằng nhau.",
        hint2: "A↔D, B↔E, C↔F.",
        explanation: "g.c.g. là cầu nối để suy ra các yếu tố tương ứng còn lại.",
      },
    ],
    finalAnswer:
      "BC và EF lần lượt nối hai đỉnh của hai góc B,C và E,F nên là cạnh xen giữa. B↔E, C↔F, A↔D; vì ∠B=∠E, BC=EF, ∠C=∠F nên ΔABC=ΔDEF theo g.c.g. Suy ra AB=DE, AC=DF và các yếu tố tương ứng khác bằng nhau.",
  },
  {
    id: "l14-advanced-invalid-criteria",
    lessonId: "lesson-player-14",
    knowledgeNodeId: "lesson-14-cgc-gcg",
    title: "Phòng thí nghiệm phản biện: AAA và hai cạnh + góc sai vị trí",
    prompt:
      "Hai lời giải sau đều tuyên bố hai tam giác bằng nhau. (I) Ba góc tương ứng bằng nhau. (II) Hai cạnh tương ứng bằng nhau và một góc tương ứng bằng nhau nhưng góc đó không xen giữa hai cạnh. Hãy đánh giá từng lời giải, chỉ ra tiêu chuẩn nào của Bài 14 bị dùng sai và nêu dữ kiện tối thiểu cần sửa để có thể áp dụng c.g.c. hoặc g.c.g.",
    skillName: "Phản biện tiêu chuẩn bằng nhau c.g.c. và g.c.g.",
    canonicalSkillId: "L14_ADV_CONGRUENCE_CRITERIA_AUDIT",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chống tiêu chuẩn giả",
    learningGoal:
      "Không nhầm AAA hoặc hai cạnh với góc sai vị trí thành tiêu chuẩn bằng nhau; biết sửa dữ kiện về đúng c.g.c./g.c.g.",
    companionMessage:
      "Đừng đếm số dữ kiện. Hãy kiểm tra cấu trúc: c.g.c. cần góc xen giữa; g.c.g. cần cạnh xen giữa. Ba góc chỉ khóa hình dạng, không khóa kích thước.",
    steps: [
      {
        id: "l14a3-step1",
        instruction: "Đánh giá lời giải (I): ba góc tương ứng bằng nhau có đủ kết luận hai tam giác bằng nhau không? Vì sao?",
        acceptedPatterns: ["không đủ", "AAA", "cùng hình dạng", "khác kích thước"],
        keyIdea: "Không đủ. Ba góc bằng nhau có thể cho các tam giác cùng hình dạng nhưng kích thước khác nhau; AAA không phải trường hợp bằng nhau của Bài 14.",
        hint1: "Có thể phóng to một tam giác mà giữ nguyên ba góc không?",
        hint2: "Bằng nhau cần cả kích thước.",
        explanation: "AAA không khóa độ dài cạnh nên không đảm bảo hai tam giác bằng nhau.",
      },
      {
        id: "l14a3-step2",
        instruction: "Đánh giá lời giải (II): vì sao 'hai cạnh + một góc' vẫn có thể chưa phải c.g.c.?",
        acceptedPatterns: ["góc không xen giữa", "không phải c.g.c", "chưa đủ"],
        keyIdea: "c.g.c. yêu cầu góc bằng nhau phải là góc xen giữa đúng hai cạnh tương ứng đã cho.",
        hint1: "Tên c.g.c. còn chứa thông tin về vị trí.",
        hint2: "Góc phải nằm giữa hai cạnh.",
        explanation: "Đếm đủ ba dữ kiện không thay thế được điều kiện vị trí.",
      },
      {
        id: "l14a3-step3",
        instruction: "Nêu cách sửa mỗi lời giải để dùng đúng một tiêu chuẩn của Bài 14.",
        acceptedPatterns: ["thêm cạnh xen giữa", "đổi sang góc xen giữa", "c.g.c", "g.c.g"],
        keyIdea: "Với (I), thêm cạnh xen giữa một cặp góc tương ứng để có g.c.g.; với (II), thay góc đã cho bằng góc xen giữa hai cạnh để có c.g.c.",
        hint1: "AAA + một cạnh phù hợp có thể tạo g.c.g.",
        hint2: "Hai cạnh + đúng góc xen giữa tạo c.g.c.",
        explanation: "Sửa dữ kiện phải đưa cấu trúc về đúng g.c.g. hoặc c.g.c., không chỉ tăng số lượng dữ kiện.",
      },
    ],
    finalAnswer:
      "(I) AAA không đủ để kết luận bằng nhau vì không khóa kích thước; thêm một cạnh xen giữa hai góc tương ứng có thể dùng g.c.g. (II) Hai cạnh và góc không xen giữa chưa phải c.g.c.; thay bằng góc xen giữa hai cạnh tương ứng thì mới áp dụng c.g.c.",
  },
];
