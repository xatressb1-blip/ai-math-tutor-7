import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson15AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l15-advanced-four-criteria-selector",
    lessonId: "lesson-player-15",
    knowledgeNodeId: "lesson-15-tam-giac-vuong-bang-nhau",
    title: "Chọn đúng trường hợp bằng nhau của tam giác vuông từ dữ kiện",
    prompt:
      "Hai tam giác ABC và DEF đều vuông lần lượt tại A và D. Với mỗi bộ dữ kiện sau, hãy chọn đúng trường hợp bằng nhau: (I) AB=DE, AC=DF; (II) AB=DE, ∠B=∠E; (III) BC=EF, ∠B=∠E. Không được chỉ nói 'hai tam giác vuông bằng nhau' mà phải chỉ đúng loại dữ kiện.",
    skillName: "Phân biệt ba trường hợp bằng nhau cơ bản của tam giác vuông",
    canonicalSkillId: "L15_ADV_RIGHT_TRIANGLE_CRITERIA_SELECTION",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Chọn đúng tiêu chuẩn",
    learningGoal:
      "Phân biệt ba trường hợp bằng nhau đầu tiên của tam giác vuông theo đúng loại cạnh/góc được cho.",
    companionMessage:
      "Trước hết xác định cạnh nào là cạnh góc vuông, cạnh nào là cạnh huyền, rồi mới chọn trường hợp.",
    steps: [
      {
        id: "l15a1-step1",
        instruction:
          "Với (I) AB=DE, AC=DF, hãy xác định loại hai cạnh và chọn trường hợp.",
        acceptedPatterns: ["hai cạnh góc vuông", "AB và AC", "DE và DF"],
        keyIdea:
          "AB,AC và DE,DF đều là hai cạnh góc vuông tương ứng; hai tam giác vuông bằng nhau theo trường hợp hai cạnh góc vuông.",
        hint1: "A và D là góc vuông.",
        hint2: "Hai cạnh kề góc vuông là cạnh góc vuông.",
        explanation:
          "Đây là trường hợp hai cạnh góc vuông tương ứng bằng nhau.",
      },
      {
        id: "l15a1-step2",
        instruction:
          "Với (II) AB=DE, ∠B=∠E, hãy xác định đúng trường hợp và chỉ ra quan hệ 'kề cạnh ấy'.",
        acceptedPatterns: ["một cạnh góc vuông", "góc nhọn kề", "AB", "DE", "∠B", "∠E"],
        keyIdea:
          "AB,DE là cạnh góc vuông; ∠B,∠E là góc nhọn kề các cạnh ấy, nên áp dụng trường hợp một cạnh góc vuông và góc nhọn kề cạnh ấy.",
        hint1: "AB có đầu mút B nên ∠B kề cạnh AB.",
        hint2: "Không gọi đây là cạnh huyền–góc nhọn.",
        explanation:
          "Điều kiện 'góc nhọn kề cạnh ấy' là phần bắt buộc của trường hợp.",
      },
      {
        id: "l15a1-step3",
        instruction:
          "Với (III) BC=EF, ∠B=∠E, hãy xác định cạnh huyền và chọn trường hợp.",
        acceptedPatterns: ["BC và EF là cạnh huyền", "cạnh huyền và một góc nhọn", "∠B", "∠E"],
        keyIdea:
          "BC và EF đối diện góc vuông nên là cạnh huyền; cùng với ∠B=∠E, hai tam giác vuông bằng nhau theo cạnh huyền và một góc nhọn.",
        hint1: "Cạnh đối diện góc vuông là cạnh huyền.",
        hint2: "B,E là góc nhọn.",
        explanation:
          "Đây là trường hợp cạnh huyền và một góc nhọn tương ứng bằng nhau.",
      },
    ],
    finalAnswer:
      "(I) Hai cạnh góc vuông. (II) Một cạnh góc vuông và góc nhọn kề cạnh ấy. (III) Cạnh huyền và một góc nhọn.",
  },
  {
    id: "l15-advanced-hypotenuse-leg",
    lessonId: "lesson-player-15",
    knowledgeNodeId: "lesson-15-tam-giac-vuong-bang-nhau",
    title: "Trường hợp đặc biệt: cạnh huyền – cạnh góc vuông",
    prompt:
      "Hai tam giác ABC và DEF vuông tại A và D. Biết BC=EF và AB=DE. Hãy chứng minh hai tam giác bằng nhau bằng đúng trường hợp đặc biệt của tam giác vuông, rồi suy ra ∠C=∠F. Không được gọi nhầm BC hoặc EF là cạnh góc vuông.",
    skillName: "Chứng minh bằng trường hợp cạnh huyền–cạnh góc vuông",
    canonicalSkillId: "L15_ADV_RIGHT_TRIANGLE_HYPOTENUSE_LEG",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Cạnh huyền–cạnh góc vuông",
    learningGoal:
      "Xác định đúng cạnh huyền/cạnh góc vuông, áp dụng trường hợp đặc biệt và chỉ suy hệ quả sau khi chứng minh hai tam giác bằng nhau.",
    companionMessage:
      "Hãy bắt đầu bằng vị trí góc vuông: cạnh đối diện nó mới là cạnh huyền.",
    steps: [
      {
        id: "l15a2-step1",
        instruction:
          "Xác định cạnh huyền và cạnh góc vuông đang được cho bằng nhau.",
        acceptedPatterns: ["BC và EF là cạnh huyền", "AB và DE là cạnh góc vuông"],
        keyIdea:
          "BC,EF là cạnh huyền vì đối diện góc vuông A,D; AB,DE là cạnh góc vuông.",
        hint1: "Cạnh huyền đối diện góc 90°.",
        hint2: "AB đi qua đỉnh vuông A nên là cạnh góc vuông.",
        explanation:
          "Phân loại đúng cạnh là điều kiện trước khi gọi tên trường hợp.",
      },
      {
        id: "l15a2-step2",
        instruction:
          "Khóa tương ứng đỉnh và kết luận hai tam giác bằng nhau theo trường hợp đặc biệt.",
        acceptedPatterns: ["A↔D", "B↔E", "C↔F", "ΔABC=ΔDEF", "cạnh huyền", "cạnh góc vuông"],
        keyIdea:
          "A↔D, B↔E, C↔F; vì hai tam giác vuông có cạnh huyền BC=EF và cạnh góc vuông AB=DE nên ΔABC=ΔDEF.",
        hint1: "AB↔DE và BC↔EF.",
        hint2: "Nêu đầy đủ tên trường hợp.",
        explanation:
          "Đây là trường hợp đặc biệt cạnh huyền–cạnh góc vuông.",
      },
      {
        id: "l15a2-step3",
        instruction:
          "Từ hai tam giác bằng nhau, suy ra ∠C=∠F và nêu căn cứ.",
        acceptedPatterns: ["∠C=∠F", "góc tương ứng", "hai tam giác bằng nhau"],
        keyIdea:
          "Sau khi ΔABC=ΔDEF, các góc tương ứng bằng nhau; C↔F nên ∠C=∠F.",
        hint1: "Không dùng ∠C=∠F để chứng minh tam giác bằng nhau.",
        hint2: "Đây là hệ quả sau bước bằng nhau.",
        explanation:
          "Trình tự đúng: điều kiện → bằng nhau → hệ quả.",
      },
    ],
    finalAnswer:
      "BC,EF là cạnh huyền; AB,DE là cạnh góc vuông. Do đó ΔABC=ΔDEF theo trường hợp cạnh huyền–cạnh góc vuông. Suy ra ∠C=∠F vì là hai góc tương ứng.",
  },
  {
    id: "l15-advanced-prerequisite-audit",
    lessonId: "lesson-player-15",
    knowledgeNodeId: "lesson-15-tam-giac-vuong-bang-nhau",
    title: "Phản biện: dữ kiện giống đúng nhưng chưa biết cả hai tam giác vuông",
    prompt:
      "Một lời giải ghi: “BC=EF và AB=DE nên ΔABC=ΔDEF theo cạnh huyền–cạnh góc vuông.” Đề bài chỉ cho ΔABC vuông tại A, còn ΔDEF chưa biết có vuông hay không. Hãy đánh giá lời giải, chỉ ra giả thiết tiên quyết còn thiếu và nêu cách sửa tối thiểu. Sau đó giải thích vì sao không thể gọi EF là cạnh huyền trước khi biết ΔDEF vuông.",
    skillName: "Kiểm tra điều kiện tiên quyết của các trường hợp tam giác vuông",
    canonicalSkillId: "L15_ADV_RIGHT_TRIANGLE_PREREQUISITE_AUDIT",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Kiểm tra giả thiết tiên quyết",
    learningGoal:
      "Không áp dụng trường hợp bằng nhau của tam giác vuông khi chưa chứng minh hoặc chưa được cho cả hai tam giác đều vuông.",
    companionMessage:
      "Tên trường hợp bắt đầu bằng 'tam giác vuông'. Vậy điều gì phải được xác nhận trước mọi so sánh cạnh?",
    steps: [
      {
        id: "l15a3-step1",
        instruction:
          "Đánh giá lời giải và nêu điều kiện tiên quyết còn thiếu.",
        acceptedPatterns: ["chưa đủ", "ΔDEF phải vuông", "∠D=90°", "cả hai tam giác vuông"],
        keyIdea:
          "Lời giải chưa đủ vì chưa biết ΔDEF là tam giác vuông; phải có ∠D=90° hoặc một căn cứ tương đương.",
        hint1: "Trường hợp đặc biệt chỉ áp dụng cho hai tam giác vuông.",
        hint2: "ABC vuông chưa đủ.",
        explanation:
          "Thiếu tính vuông của tam giác thứ hai làm tiêu chuẩn không thể áp dụng.",
      },
      {
        id: "l15a3-step2",
        instruction:
          "Giải thích vì sao trước khi biết ΔDEF vuông tại D, chưa được gọi EF là cạnh huyền.",
        acceptedPatterns: ["cạnh huyền đối diện góc vuông", "chưa có góc vuông", "không thể xác định cạnh huyền"],
        keyIdea:
          "Cạnh huyền được định nghĩa là cạnh đối diện góc vuông; chưa biết góc vuông của ΔDEF thì chưa thể xác định EF là cạnh huyền.",
        hint1: "Tên cạnh phụ thuộc cấu trúc tam giác vuông.",
        hint2: "Không suy từ độ dài hoặc hình vẽ.",
        explanation:
          "Phân loại cạnh phải dựa trên giả thiết góc vuông, không dựa trên cảm giác từ hình.",
      },
      {
        id: "l15a3-step3",
        instruction:
          "Nêu cách sửa tối thiểu để lời giải trở thành hợp lệ và viết lại chuỗi kết luận.",
        acceptedPatterns: ["thêm ∠D=90°", "ΔDEF vuông tại D", "BC=EF", "AB=DE", "cạnh huyền–cạnh góc vuông", "ΔABC=ΔDEF"],
        keyIdea:
          "Bổ sung ΔDEF vuông tại D. Khi đó BC,EF là cạnh huyền; AB,DE là cạnh góc vuông; từ BC=EF, AB=DE suy ra ΔABC=ΔDEF theo cạnh huyền–cạnh góc vuông.",
        hint1: "Chỉ cần bổ sung đúng giả thiết vuông còn thiếu.",
        hint2: "Sau đó mới phân loại cạnh và áp dụng tiêu chuẩn.",
        explanation:
          "Chuỗi hợp lệ bắt đầu từ cả hai tam giác vuông rồi mới đến loại cạnh và trường hợp bằng nhau.",
      },
    ],
    finalAnswer:
      "Lời giải chưa đủ vì chưa biết ΔDEF vuông. Phải bổ sung ∠D=90°. Khi đó EF mới là cạnh huyền, DE là cạnh góc vuông; với BC=EF, AB=DE suy ra ΔABC=ΔDEF theo trường hợp cạnh huyền–cạnh góc vuông.",
  },
];
