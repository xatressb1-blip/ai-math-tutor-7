import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson12AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l12-advanced-impossible-triangle",
    lessonId: "lesson-player-12",
    knowledgeNodeId: "lesson-12-tong-goc-trong-tam-giac",
    title: "Phản biện: một tam giác có thể có hai góc không nhỏ hơn 90° không?",
    prompt:
      "Một bạn nói: “Có thể vẽ một tam giác có hai góc đều không nhỏ hơn 90° nếu cạnh đủ dài.” Em hãy bác bỏ hoặc bảo vệ nhận định này chỉ bằng định lí tổng ba góc trong một tam giác. Không được dựa vào hình vẽ.",
    skillName: "Phản biện cấu hình góc tam giác bằng định lí tổng ba góc",
    canonicalSkillId: "L12_ADV_TRIANGLE_ANGLE_FEASIBILITY",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Kiểm tra khả năng tồn tại",
    learningGoal:
      "Dùng tổng ba góc bằng 180° và tính dương của góc tam giác để bác bỏ cấu hình không thể tồn tại.",
    companionMessage:
      "Đừng thử vẽ. Hãy giả sử hai góc đều ≥90° rồi xem tổng của chúng để lại bao nhiêu cho góc thứ ba.",
    steps: [
      {
        id: "l12a1-step1",
        instruction:
          "Giả sử hai góc A và B đều không nhỏ hơn 90°. Suy ra điều gì về A+B?",
        acceptedPatterns: ["A+B≥180°", "A+B >= 180°"],
        keyIdea:
          "Nếu A≥90° và B≥90° thì A+B≥180°.",
        hint1: "Cộng hai bất đẳng thức A≥90° và B≥90°.",
        hint2: "90°+90°=180°.",
        explanation:
          "Hai góc đã chiếm ít nhất 180°.",
      },
      {
        id: "l12a1-step2",
        instruction:
          "Kết hợp A+B+C=180° để suy ra điều gì về C?",
        acceptedPatterns: ["C≤0°", "C<=0°", "C không dương"],
        keyIdea:
          "Từ A+B≥180° và A+B+C=180° suy ra C≤0°.",
        hint1: "C=180°-(A+B).",
        hint2: "Nếu A+B≥180° thì hiệu này không dương.",
        explanation:
          "C≤0°, trái với việc góc trong tam giác phải dương.",
      },
      {
        id: "l12a1-step3",
        instruction:
          "Kết luận nhận định ban đầu và nêu mâu thuẫn quyết định.",
        acceptedPatterns: ["sai", "không thể", "góc tam giác phải dương"],
        keyIdea:
          "Nhận định sai: tam giác không thể có hai góc cùng ≥90° vì góc thứ ba sẽ ≤0°.",
        hint1: "Một tam giác thật phải có ba góc dương.",
        hint2: "Nêu rõ mâu thuẫn C≤0°.",
        explanation:
          "Định lí tổng ba góc đã đủ để bác bỏ, không phụ thuộc độ dài cạnh.",
      },
    ],
    finalAnswer:
      "Nếu A,B≥90° thì A+B≥180°. Vì A+B+C=180° nên C≤0°, vô lí vì góc trong tam giác phải dương. Do đó một tam giác không thể có hai góc đều không nhỏ hơn 90°.",
  },
  {
    id: "l12-advanced-exterior-angle-proof",
    lessonId: "lesson-player-12",
    knowledgeNodeId: "lesson-12-goc-ngoai-tam-giac",
    title: "Tự chứng minh định lí góc ngoài từ hai kiến thức đã biết",
    prompt:
      "Trong tam giác ABC, kéo dài BC qua C đến D. Hãy chứng minh ∠ACD = ∠A + ∠B chỉ từ: (1) tổng ba góc trong tam giác bằng 180° và (2) hai góc kề bù có tổng 180°. Không được dùng sẵn định lí góc ngoài.",
    skillName: "Chứng minh định lí góc ngoài từ tổng góc và kề bù",
    canonicalSkillId: "L12_ADV_EXTERIOR_ANGLE_DERIVATION",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Tự dựng chứng minh",
    learningGoal:
      "Dẫn xuất định lí góc ngoài bằng chuỗi đẳng thức độc lập, tránh circular reasoning.",
    companionMessage:
      "Em cần tạo hai biểu thức cùng bằng 180° rồi so sánh chúng. Đừng viện dẫn chính định lí đang cần chứng minh.",
    steps: [
      {
        id: "l12a2-step1",
        instruction:
          "Viết đẳng thức tổng ba góc của tam giác ABC.",
        acceptedPatterns: ["∠A+∠B+∠C=180°", "A+B+C=180°"],
        keyIdea:
          "∠A+∠B+∠C=180°.",
        hint1: "Dùng đúng định lí tổng ba góc.",
        hint2: "Chưa cần góc ngoài ở bước này.",
        explanation:
          "Đây là đẳng thức thứ nhất.",
      },
      {
        id: "l12a2-step2",
        instruction:
          "Viết đẳng thức kề bù tại C giữa ∠ACB và ∠ACD.",
        acceptedPatterns: ["∠C+∠ACD=180°", "∠ACB+∠ACD=180°"],
        keyIdea:
          "Vì CB và CD là hai tia đối nhau nên ∠ACB+∠ACD=180°.",
        hint1: "Hai góc có cạnh chung CA.",
        hint2: "CB và CD là hai tia đối.",
        explanation:
          "Đây là đẳng thức thứ hai, cũng có tổng 180°.",
      },
      {
        id: "l12a2-step3",
        instruction:
          "So sánh hai đẳng thức và suy ra ∠ACD = ∠A+∠B.",
        acceptedPatterns: ["∠ACD=∠A+∠B", "trừ ∠C", "cùng bằng 180°"],
        keyIdea:
          "Từ A+B+C=180° và C+ACD=180°, suy ra A+B=ACD.",
        hint1: "Hai vế trái cùng bằng 180°.",
        hint2: "Bớt cùng ∠C.",
        explanation:
          "Ta đã chứng minh định lí góc ngoài mà không dùng chính định lí đó.",
      },
    ],
    finalAnswer:
      "A+B+C=180° và C+∠ACD=180°. Hai tổng cùng bằng 180°; bớt C ở hai vế suy ra ∠ACD=A+B.",
  },
  {
    id: "l12-advanced-exterior-angle-constraint",
    lessonId: "lesson-player-12",
    knowledgeNodeId: "lesson-12-goc-ngoai-tam-giac",
    title: "Góc ngoài và điều kiện đại số: tìm tam giác rồi kiểm chứng",
    prompt:
      "Tam giác ABC có góc ngoài tại C bằng 120°. Biết ∠A = 2∠B. Hãy tìm ba góc trong của tam giác, phân loại tam giác theo góc và kiểm chứng lại bằng cả định lí góc ngoài lẫn tổng ba góc.",
    skillName: "Giải ràng buộc góc tam giác bằng góc ngoài và kiểm chứng kép",
    canonicalSkillId: "L12_ADV_EXTERIOR_ANGLE_CONSTRAINT",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Ràng buộc và kiểm chứng",
    learningGoal:
      "Kết hợp định lí góc ngoài, quan hệ đại số và tổng ba góc để giải rồi kiểm chứng một cấu hình tam giác.",
    companionMessage:
      "Góc ngoài 120° bằng tổng hai góc trong không kề. Hãy dùng A=2B trước, rồi mới tìm C.",
    steps: [
      {
        id: "l12a3-step1",
        instruction:
          "Dùng định lí góc ngoài và A=2B để tìm A, B.",
        acceptedPatterns: ["A+B=120°", "3B=120°", "B=40°", "A=80°"],
        keyIdea:
          "A+B=120°, A=2B nên 3B=120°; B=40°, A=80°.",
        hint1: "Góc ngoài tại C bằng A+B.",
        hint2: "Thay A bằng 2B.",
        explanation:
          "Hai góc trong không kề lần lượt là 80° và 40°.",
      },
      {
        id: "l12a3-step2",
        instruction:
          "Tìm C và phân loại tam giác theo góc.",
        acceptedPatterns: ["C=60°", "tam giác nhọn", "80°+40°+60°=180°"],
        keyIdea:
          "C=180°-80°-40°=60°. Cả ba góc đều nhỏ hơn 90° nên tam giác nhọn.",
        hint1: "Dùng tổng ba góc bằng 180°.",
        hint2: "So 80°, 40°, 60° với 90°.",
        explanation:
          "Tam giác có ba góc 80°,40°,60° nên là tam giác nhọn.",
      },
      {
        id: "l12a3-step3",
        instruction:
          "Kiểm chứng kép kết quả bằng tổng ba góc và góc ngoài tại C.",
        acceptedPatterns: ["80°+40°+60°=180°", "80°+40°=120°", "kiểm chứng"],
        keyIdea:
          "80+40+60=180 và 80+40=120, khớp cả hai định lí.",
        hint1: "Một phép kiểm tra cho tổng góc trong.",
        hint2: "Một phép kiểm tra cho góc ngoài.",
        explanation:
          "Hai kiểm chứng độc lập cùng khớp nên cấu hình nhất quán.",
      },
    ],
    finalAnswer:
      "A+B=120°, A=2B nên B=40°, A=80°. C=60°. Tam giác nhọn. Kiểm chứng: 80+40+60=180 và góc ngoài tại C=80+40=120°.",
  },
];
