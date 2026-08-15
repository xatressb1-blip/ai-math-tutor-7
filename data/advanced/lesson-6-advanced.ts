import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson6AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l6-advanced-estimate-sqrt10",
    lessonId: "lesson-player-06",
    knowledgeNodeId: "lesson-6-so-vo-ti-can-bac-hai",
    title: "Ước lượng √10 bằng bình phương, không dùng máy tính",
    prompt:
      "Không dùng máy tính, hãy ước lượng √10 đến hàng phần mười. Em phải dùng các bình phương để tạo khoảng chứa √10 và giải thích vì sao kết quả làm tròn là 3,2 chứ không phải 3,1.",
    skillName: "Ước lượng căn bậc hai bằng chặn trên và chặn dưới",
    canonicalSkillId: "L06_ADV_SQRT_ESTIMATION",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Ước lượng có căn cứ",
    learningGoal:
      "Ước lượng căn bậc hai bằng cách so sánh bình phương và ra quyết định làm tròn có căn cứ.",
    companionMessage:
      "Đừng đoán √10 ≈ 3,2. Hãy dựng một khoảng chứa nó bằng các bình phương, rồi kiểm tra mốc giữa 3,15.",
    steps: [
      {
        id: "l6a1-step1",
        instruction:
          "Tính 3,1² và 3,2², rồi dùng chúng để kẹp √10 giữa hai số thập phân.",
        acceptedPatterns: ["3,1²=9,61", "3,2²=10,24", "3,1<√10<3,2"],
        keyIdea:
          "3,1²=9,61<10<10,24=3,2² nên 3,1<√10<3,2.",
        hint1: "Bình phương 3,1 và 3,2 rồi so sánh với 10.",
        hint2: "3,1²=9,61 và 3,2²=10,24.",
        explanation:
          "Vì 9,61<10<10,24 và căn bậc hai số học không âm nên 3,1<√10<3,2.",
      },
      {
        id: "l6a1-step2",
        instruction:
          "Muốn quyết định làm tròn đến hàng phần mười, hãy so √10 với mốc giữa 3,15 bằng cách tính 3,15².",
        acceptedPatterns: ["3,15²=9,9225", "√10>3,15"],
        keyIdea:
          "3,15²=9,9225<10 nên √10>3,15.",
        hint1: "Mốc giữa 3,1 và 3,2 là 3,15.",
        hint2: "Tính 3,15² rồi so sánh với 10.",
        explanation:
          "3,15²=9,9225<10, do đó √10>3,15.",
      },
      {
        id: "l6a1-step3",
        instruction:
          "Kết luận √10 làm tròn đến hàng phần mười bằng bao nhiêu và giải thích vì sao.",
        acceptedPatterns: ["3,2", "lớn hơn 3,15", "làm tròn"],
        keyIdea:
          "Vì 3,15<√10<3,2 nên khi làm tròn đến hàng phần mười ta được 3,2.",
        hint1: "Em đã biết √10 nằm phía trên mốc 3,15.",
        hint2: "Số nằm từ 3,15 trở lên và dưới 3,2 sẽ làm tròn đến hàng phần mười thành 3,2.",
        explanation:
          "√10≈3,2 đến hàng phần mười vì √10>3,15.",
      },
    ],
    finalAnswer:
      "3,1²=9,61<10<10,24=3,2² nên 3,1<√10<3,2. Vì 3,15²=9,9225<10 nên √10>3,15; do đó √10≈3,2 đến hàng phần mười.",
  },
  {
    id: "l6-advanced-symbol-versus-equation",
    lessonId: "lesson-player-06",
    knowledgeNodeId: "lesson-6-so-vo-ti-can-bac-hai",
    title: "Một kí hiệu, hai nghiệm: vì sao √49 = 7 nhưng x² = 49 có ±7?",
    prompt:
      "Một bạn viết: “Vì 7²=49 và (-7)²=49 nên √49=±7.” Em hãy phân tích vì sao kết luận đó sai, rồi phân biệt rõ giá trị của kí hiệu √49 với nghiệm của phương trình x²=49.",
    skillName: "Phân biệt căn bậc hai số học với nghiệm của phương trình bình phương",
    canonicalSkillId: "L06_ADV_SQRT_VS_EQUATION",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Phân biệt khái niệm",
    learningGoal:
      "Phân biệt một giá trị căn bậc hai số học với hai nghiệm đối nhau của phương trình x²=a.",
    companionMessage:
      "Cả 7 và -7 đều có bình phương bằng 49, nhưng kí hiệu √49 có một quy ước quan trọng. Hãy tìm đúng quy ước đó.",
    steps: [
      {
        id: "l6a2-step1",
        instruction:
          "Nêu điều đúng trong lời giải của bạn: những số nào có bình phương bằng 49?",
        acceptedPatterns: ["7²=49", "(-7)²=49", "7 và -7"],
        keyIdea:
          "Cả 7 và -7 đều có bình phương bằng 49.",
        hint1: "Kiểm tra 7² và (-7)².",
        hint2: "Hai số đối nhau có cùng bình phương.",
        explanation:
          "7²=49 và (-7)²=49, nên 7 và -7 là hai số có bình phương bằng 49.",
      },
      {
        id: "l6a2-step2",
        instruction:
          "Dùng định nghĩa căn bậc hai số học để giải thích vì sao √49 chỉ bằng 7.",
        acceptedPatterns: ["không âm", "√49=7", "căn bậc hai số học"],
        keyIdea:
          "Căn bậc hai số học của 49 là số không âm có bình phương bằng 49, nên √49=7.",
        hint1: "Trong định nghĩa có điều kiện về dấu của kết quả.",
        hint2: "Căn bậc hai số học luôn không âm.",
        explanation:
          "Vì 7≥0 và 7²=49 nên √49=7. Kí hiệu √49 không mang hai giá trị.",
      },
      {
        id: "l6a2-step3",
        instruction:
          "Kết luận nghiệm của x²=49 và giải thích vì sao phương trình có hai nghiệm trong khi √49 chỉ có một giá trị.",
        acceptedPatterns: ["x=7", "x=-7", "x=±7", "hai nghiệm"],
        keyIdea:
          "x²=49 có hai nghiệm x=7 và x=-7; còn √49 là căn bậc hai số học nên chỉ lấy giá trị không âm 7.",
        hint1: "Phương trình hỏi tất cả các số x có bình phương bằng 49.",
        hint2: "Hãy viết x=7 hoặc x=-7, rồi đối chiếu với định nghĩa √49.",
        explanation:
          "Phương trình x²=49 có hai nghiệm ±7, nhưng √49=7 vì dấu √ biểu thị căn bậc hai số học.",
      },
    ],
    finalAnswer:
      "7 và -7 đều có bình phương bằng 49. Tuy nhiên √49 là căn bậc hai số học nên √49=7. Phương trình x²=49 mới có hai nghiệm x=±7.",
  },
  {
    id: "l6-advanced-square-garden-model",
    lessonId: "lesson-player-06",
    knowledgeNodeId: "lesson-6-so-vo-ti-can-bac-hai",
    title: "Mô hình hóa: khu vườn hình vuông có diện tích 30 m²",
    prompt:
      "Một khu vườn hình vuông có diện tích 30 m². Không dùng máy tính căn, hãy ước lượng độ dài cạnh đến hàng phần mười rồi tính chu vi gần đúng. Em phải giải thích vì sao cạnh được làm tròn thành 5,5 m.",
    skillName: "Mô hình hóa độ dài bằng căn bậc hai và kiểm soát ước lượng",
    canonicalSkillId: "L06_ADV_SQRT_MODELING",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Mô hình hóa",
    learningGoal:
      "Chuyển bài toán diện tích hình vuông thành căn bậc hai, ước lượng có kiểm soát và diễn giải kết quả thực tế.",
    companionMessage:
      "Hãy bắt đầu từ công thức diện tích, không đoán cạnh. Sau đó dùng bình phương để quyết định cách làm tròn.",
    steps: [
      {
        id: "l6a3-step1",
        instruction:
          "Gọi cạnh là a. Từ diện tích 30 m², lập quan hệ a²=30 và giải thích vì sao a=√30 chứ không lấy -√30.",
        acceptedPatterns: ["a²=30", "a=√30", "độ dài không âm"],
        keyIdea:
          "a²=30 và a là độ dài nên a≥0; do đó a=√30.",
        hint1: "Diện tích hình vuông bằng bình phương cạnh.",
        hint2: "Độ dài có thể âm không?",
        explanation:
          "a²=30. Vì a là độ dài nên a≥0, vì vậy a=√30.",
      },
      {
        id: "l6a3-step2",
        instruction:
          "Dùng 5,4²=29,16; 5,5²=30,25 và mốc 5,45 để chứng minh √30 làm tròn đến hàng phần mười bằng 5,5.",
        acceptedPatterns: ["5,4²=29,16", "5,5²=30,25", "5,45²=29,7025", "√30>5,45"],
        keyIdea:
          "5,4<√30<5,5 và 5,45²=29,7025<30 nên √30>5,45; vì vậy làm tròn đến hàng phần mười được 5,5.",
        hint1: "Trước hết kẹp √30 giữa 5,4 và 5,5.",
        hint2: "Để chọn 5,4 hay 5,5 khi làm tròn, hãy kiểm tra mốc giữa 5,45.",
        explanation:
          "29,16<30<30,25 nên 5,4<√30<5,5. Vì 5,45²=29,7025<30 nên √30>5,45, do đó a≈5,5 m.",
      },
      {
        id: "l6a3-step3",
        instruction:
          "Từ cạnh gần đúng 5,5 m, tính chu vi gần đúng và ghi đơn vị. Nêu rõ đây là giá trị gần đúng, không phải chu vi chính xác.",
        acceptedPatterns: ["22 m", "4×5,5", "gần đúng"],
        keyIdea:
          "P≈4×5,5=22 m. Chu vi chính xác là 4√30 m, còn 22 m là giá trị gần đúng theo cạnh đã làm tròn.",
        hint1: "Chu vi hình vuông bằng 4 lần cạnh.",
        hint2: "Dùng cạnh gần đúng 5,5 m; đồng thời phân biệt '≈' với '='.",
        explanation:
          "P≈4×5,5=22 m. Giá trị chính xác là 4√30 m nên 22 m chỉ là xấp xỉ.",
      },
    ],
    finalAnswer:
      "a=√30 m. Vì 5,4²<30<5,5² và 5,45²<30 nên √30>5,45, suy ra a≈5,5 m. Chu vi gần đúng P≈22 m; chu vi chính xác là 4√30 m.",
  },
];
