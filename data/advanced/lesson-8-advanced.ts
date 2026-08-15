import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson8AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l8-advanced-supplementary-structure",
    lessonId: "lesson-player-08",
    knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
    title: "Bù chưa chắc kề bù: kiểm tra cấu trúc trước số đo",
    prompt:
      "Hai góc ∠AOB và ∠COD đều có tổng số đo 180°. Một bạn kết luận ngay chúng là hai góc kề bù. Em hãy đánh giá kết luận này và nêu chính xác những điều kiện hình học còn phải kiểm tra.",
    skillName: "Phản biện kết luận góc kề bù bằng điều kiện cấu trúc",
    canonicalSkillId: "L08_ADV_SUPPLEMENTARY_STRUCTURE",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Phản biện cấu trúc",
    learningGoal:
      "Phân biệt hai góc bù với hai góc kề bù và biết kiểm tra điều kiện cấu trúc trước khi kết luận.",
    companionMessage:
      "Tổng 180° mới cho em biết 'bù'. Từ 'kề' đòi hỏi thêm thông tin về vị trí các cạnh.",
    steps: [
      {
        id: "l8a1-step1",
        instruction:
          "Từ giả thiết tổng 180°, em được phép kết luận điều gì chắc chắn?",
        acceptedPatterns: ["hai góc bù nhau", "bù nhau"],
        keyIdea:
          "Tổng số đo bằng 180° chỉ đủ để kết luận hai góc bù nhau.",
        hint1: "Hãy tách tên gọi 'kề bù' thành hai ý.",
        hint2: "180° liên quan trực tiếp đến từ 'bù'.",
        explanation:
          "Từ tổng 180° ta chỉ suy ra hai góc bù nhau, chưa suy ra chúng kề nhau.",
      },
      {
        id: "l8a1-step2",
        instruction:
          "Nêu các điều kiện vị trí cần có để hai góc được gọi là kề bù.",
        acceptedPatterns: ["chung cạnh", "hai cạnh còn lại", "tia đối"],
        keyIdea:
          "Hai góc phải có một cạnh chung và hai cạnh còn lại là hai tia đối nhau.",
        hint1: "Một điều kiện nói về cạnh chung; một điều kiện nói về hai cạnh còn lại.",
        hint2: "Hai cạnh còn lại phải tạo thành một đường thẳng.",
        explanation:
          "Kề bù cần một cạnh chung và hai cạnh còn lại là hai tia đối nhau.",
      },
      {
        id: "l8a1-step3",
        instruction:
          "Kết luận nhận định của bạn đúng hay sai và giải thích bằng một phản ví dụ khái quát.",
        acceptedPatterns: ["sai", "không chung cạnh", "vẫn bù", "không kề"],
        keyIdea:
          "Nhận định sai: có thể có hai góc ở hai vị trí khác nhau, tổng 180° nhưng không chung cạnh; khi đó chúng bù nhau nhưng không kề bù.",
        hint1: "Hai góc không chung đỉnh/cạnh vẫn có thể có tổng 180°.",
        hint2: "Hãy dùng cụm 'bù nhau nhưng không kề nhau'.",
        explanation:
          "Tổng 180° không mang thông tin về vị trí. Vì vậy có thể bù nhưng không kề bù.",
      },
    ],
    finalAnswer:
      "Kết luận sai. Tổng 180° chỉ cho biết hai góc bù nhau. Muốn kề bù, chúng còn phải có một cạnh chung và hai cạnh còn lại là hai tia đối nhau.",
  },
  {
    id: "l8-advanced-bisectors-perpendicular",
    lessonId: "lesson-player-08",
    knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
    title: "Hai tia phân giác của hai góc kề bù có vuông góc không?",
    prompt:
      "Cho ∠xOy và ∠yOz là hai góc kề bù. Om là tia phân giác của ∠xOy, On là tia phân giác của ∠yOz. Không cần biết số đo cụ thể của ∠xOy, hãy chứng minh ∠mOn = 90°.",
    skillName: "Chứng minh hai tia phân giác của hai góc kề bù vuông góc",
    canonicalSkillId: "L08_ADV_BISECTOR_PERPENDICULAR_PROOF",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Chứng minh tổng quát",
    learningGoal:
      "Kết hợp kề bù và định nghĩa tia phân giác để chứng minh một kết quả không phụ thuộc số đo cụ thể.",
    companionMessage:
      "Đừng chọn một số đo cụ thể. Hãy đặt ∠xOy = α rồi để các điều kiện tự dẫn em đến 90°.",
    steps: [
      {
        id: "l8a2-step1",
        instruction:
          "Đặt ∠xOy = α. Vì hai góc kề bù, hãy biểu diễn ∠yOz theo α.",
        acceptedPatterns: ["180°-α", "∠yOz=180°-α"],
        keyIdea:
          "∠xOy+∠yOz=180°, nên ∠yOz=180°-α.",
        hint1: "Kề bù cho một phương trình tổng.",
        hint2: "α + ∠yOz = 180°.",
        explanation:
          "Ta có ∠yOz=180°-α.",
      },
      {
        id: "l8a2-step2",
        instruction:
          "Dùng tính chất phân giác để biểu diễn ∠mOy và ∠yOn theo α.",
        acceptedPatterns: ["α/2", "(180°-α)/2"],
        keyIdea:
          "∠mOy=α/2 và ∠yOn=(180°-α)/2.",
        hint1: "Mỗi tia phân giác chia góc tương ứng thành hai phần bằng nhau.",
        hint2: "Lấy một nửa của α và một nửa của 180°-α.",
        explanation:
          "∠mOy=α/2; ∠yOn=(180°-α)/2.",
      },
      {
        id: "l8a2-step3",
        instruction:
          "Tính ∠mOn và kết luận quan hệ giữa Om và On.",
        acceptedPatterns: ["90°", "Om⊥On", "vuông góc"],
        keyIdea:
          "∠mOn=α/2+(180°-α)/2=90°, nên Om⊥On.",
        hint1: "Tia Oy nằm giữa Om và On.",
        hint2: "Cộng hai nửa góc vừa tìm.",
        explanation:
          "∠mOn=[α+(180°-α)]/2=90°. Do đó Om vuông góc On.",
      },
    ],
    finalAnswer:
      "Đặt ∠xOy=α thì ∠yOz=180°-α. Vì Om, On là phân giác: ∠mOy=α/2, ∠yOn=(180°-α)/2. Suy ra ∠mOn=90°, nên Om⊥On.",
  },
  {
    id: "l8-advanced-vertical-bisectors",
    lessonId: "lesson-player-08",
    knowledgeNodeId: "lesson-8-goc-dac-biet-tia-phan-giac",
    title: "Phân giác của hai góc đối đỉnh: tìm quan hệ giữa hai tia",
    prompt:
      "Hai đường thẳng xx' và yy' cắt nhau tại O. Om là tia phân giác của ∠xOy, On là tia phân giác của góc đối đỉnh ∠x'Oy'. Hãy chứng minh Om và On là hai tia đối nhau. Không được kết luận chỉ vì hình vẽ trông thẳng hàng.",
    skillName: "Suy luận quan hệ hai tia phân giác của hai góc đối đỉnh",
    canonicalSkillId: "L08_ADV_VERTICAL_BISECTOR_RELATION",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chuỗi suy luận hình học",
    learningGoal:
      "Dùng tính chất góc đối đỉnh, tia phân giác và góc bẹt để suy ra quan hệ hai tia mà không dựa vào hình vẽ.",
    companionMessage:
      "Mục tiêu là chứng minh ∠mOn=180°. Hãy đặt số đo một góc là α và theo dõi các góc trên nửa mặt phẳng.",
    steps: [
      {
        id: "l8a3-step1",
        instruction:
          "Đặt ∠xOy = α. Từ tính chất góc đối đỉnh, nêu số đo ∠x'Oy'.",
        acceptedPatterns: ["∠x'Oy'=α", "α", "đối đỉnh bằng nhau"],
        keyIdea:
          "Hai góc đối đỉnh bằng nhau nên ∠x'Oy'=α.",
        hint1: "Đây là cặp góc đối đỉnh.",
        hint2: "Không cần lấy 180° trừ α.",
        explanation:
          "∠x'Oy'=∠xOy=α.",
      },
      {
        id: "l8a3-step2",
        instruction:
          "Dùng phân giác để nêu ∠mOy và ∠y'On. Sau đó nêu ∠yOy'.",
        acceptedPatterns: ["α/2", "180°", "∠yOy'=180°"],
        keyIdea:
          "∠mOy=α/2, ∠y'On=α/2 và Oy, Oy' là hai tia đối nên ∠yOy'=180°.",
        hint1: "Mỗi phân giác cho một nửa α.",
        hint2: "Oy và Oy' cùng nằm trên đường thẳng yy' và ngược hướng.",
        explanation:
          "Hai góc nửa đều bằng α/2; còn ∠yOy'=180°.",
      },
      {
        id: "l8a3-step3",
        instruction:
          "Tính ∠mOn theo một vòng qua Oy và Oy', rồi kết luận Om và On là hai tia gì.",
        acceptedPatterns: ["180°", "hai tia đối", "Om và On đối nhau"],
        keyIdea:
          "Góc từ Om đến On theo phía qua Oy, Oy' có tổng α/2 + (180°-α) + α/2 = 180°, nên Om và On là hai tia đối nhau.",
        hint1: "Góc giữa Oy và Oy' theo phía chứa hai tia phân giác không phải dùng toàn bộ 180° nếu đã tính hai nửa α; hãy tách góc bẹt thích hợp.",
        hint2: "Tổng cần rút gọn về 180°.",
        explanation:
          "Các góc thành phần cộng lại thành 180°, vì vậy Om và On thẳng hàng và ngược hướng, tức là hai tia đối nhau.",
      },
    ],
    finalAnswer:
      "Hai góc đối đỉnh bằng α; mỗi phân giác tạo góc α/2. Ghép các góc trên đường thẳng cho ∠mOn=180°. Vì cùng gốc O và tạo góc bẹt, Om và On là hai tia đối nhau.",
  },
];
