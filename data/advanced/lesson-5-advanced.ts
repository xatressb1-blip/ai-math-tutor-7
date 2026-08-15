import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson5AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l5-advanced-period-structure",
    lessonId: "lesson-player-05",
    knowledgeNodeId: "lesson-5-thap-phan-vo-han-tuan-hoan",
    title: "Đọc cấu trúc số thập phân: phần không lặp và chu kì",
    prompt:
      "Cho 7/12 = 0,58333... = 0,58(3). Em hãy giải thích vì sao chu kì chỉ là 3 chứ không phải 583, và chỉ ra phần thập phân xuất hiện trước khi chu kì bắt đầu.",
    skillName: "Phân tích cấu trúc số thập phân tuần hoàn",
    canonicalSkillId: "L05_ADV_PERIOD_STRUCTURE",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Khám phá cấu trúc",
    learningGoal:
      "Phân biệt phần thập phân không lặp với chu kì thực sự lặp lại vô hạn.",
    companionMessage:
      "Đừng chọn chu kì chỉ vì thấy một nhóm chữ số xuất hiện đầu tiên. Hãy hỏi: nhóm nào thực sự lặp lại mãi?",
    steps: [
      {
        id: "l5a1-step1",
        instruction:
          "Viết vài chữ số đầu của 0,58(3) dưới dạng khai triển và đánh dấu phần nào lặp lại.",
        acceptedPatterns: ["0,58333", "0.58333", "3 lặp"],
        keyIdea:
          "0,58(3) = 0,583333..., trong đó chữ số 3 lặp lại mãi.",
        hint1: "Kí hiệu (3) có nghĩa là chữ số nào được lặp vô hạn?",
        hint2: "Viết 0,58(3) thành 0,583333... rồi quan sát.",
        explanation:
          "0,58(3)=0,583333...; sau hai chữ số 5 và 8, chữ số 3 tiếp tục lặp mãi.",
      },
      {
        id: "l5a1-step2",
        instruction:
          "Nêu chu kì và phần đứng trước chu kì. Giải thích vì sao 583 không thể là chu kì.",
        acceptedPatterns: ["chu kì 3", "chu ky 3", "58", "583 không lặp"],
        keyIdea:
          "Chu kì là 3; phần 58 đứng trước chu kì. Nhóm 583 không lặp lại liên tiếp vô hạn.",
        hint1: "Một chu kì phải là nhóm chữ số lặp lại liên tiếp mãi mãi.",
        hint2: "Trong 0,583333..., sau 583 có xuất hiện lại 583 hay chỉ có 3 tiếp tục lặp?",
        explanation:
          "Chu kì là 3. Hai chữ số 5 và 8 chỉ xuất hiện trước khi quá trình lặp bắt đầu; 583 không lặp liên tiếp.",
      },
      {
        id: "l5a1-step3",
        instruction:
          "Phát biểu một tiêu chí để nhận ra chu kì của một số thập phân vô hạn tuần hoàn.",
        acceptedPatterns: ["lặp lại mãi", "lặp vô hạn", "nhóm chữ số"],
        keyIdea:
          "Chu kì là nhóm chữ số ngắn nhất lặp lại liên tiếp vô hạn từ một vị trí nào đó trong phần thập phân.",
        hint1: "Tiêu chí phải nói đến một nhóm chữ số và việc lặp lại vô hạn.",
        hint2: "Hãy dùng ý: 'nhóm chữ số ngắn nhất lặp lại liên tiếp mãi mãi'.",
        explanation:
          "Có thể nhận ra chu kì bằng cách tìm nhóm chữ số ngắn nhất bắt đầu từ một vị trí nào đó và lặp lại liên tiếp vô hạn.",
      },
    ],
    finalAnswer:
      "0,58(3)=0,583333...; chu kì là 3, còn 58 là phần đứng trước chu kì. Chu kì phải là nhóm chữ số lặp lại liên tiếp vô hạn.",
  },
  {
    id: "l5-advanced-counterexample",
    lessonId: "lesson-player-05",
    knowledgeNodeId: "lesson-5-thap-phan-vo-han-tuan-hoan",
    title: "Phản ví dụ: vô hạn chưa chắc đã tuần hoàn",
    prompt:
      "Một bạn nói: “Hễ phần thập phân kéo dài vô hạn thì đó là số thập phân vô hạn tuần hoàn.” Hãy bác bỏ nhận định bằng cách so sánh A = 0,12121212... và B = 0,122122212222122222... . Em phải chỉ ra vì sao A có chu kì còn B không có một nhóm chữ số cố định lặp lại mãi.",
    skillName: "Dùng phản ví dụ để phân biệt vô hạn và tuần hoàn",
    canonicalSkillId: "L05_ADV_COUNTEREXAMPLE_PERIODICITY",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Phản ví dụ",
    learningGoal:
      "Biết bác bỏ một mệnh đề sai bằng phản ví dụ và phân biệt 'vô hạn' với 'vô hạn tuần hoàn'.",
    companionMessage:
      "Đây không phải bài tính. Em cần kiểm tra cấu trúc lặp: độ dài của mẫu có giữ nguyên hay đang thay đổi?",
    steps: [
      {
        id: "l5a2-step1",
        instruction:
          "Phân tích A = 0,12121212...: nêu chu kì và bằng chứng cho thấy chu kì đó lặp lại liên tiếp.",
        acceptedPatterns: ["12", "chu kì 12", "121212"],
        keyIdea:
          "A có chu kì 12 vì nhóm 12 lặp lại liên tiếp: 12|12|12|12|...",
        hint1: "Thử tách phần thập phân của A thành các khối có cùng độ dài.",
        hint2: "A = 0,12|12|12|12|...",
        explanation:
          "A là số thập phân vô hạn tuần hoàn với chu kì 12.",
      },
      {
        id: "l5a2-step2",
        instruction:
          "Phân tích B: mô tả quy luật số chữ số 2 giữa các chữ số 1 và giải thích vì sao không có một khối cố định lặp lại mãi.",
        acceptedPatterns: ["số chữ số 2 tăng", "không có chu kì", "không lặp"],
        keyIdea:
          "Ở B, số chữ số 2 giữa hai chữ số 1 tăng dần nên không tồn tại một nhóm chữ số cố định lặp lại liên tiếp vô hạn.",
        hint1: "Quan sát các đoạn: 1·22·1·222·1·2222·1...",
        hint2: "Độ dài mỗi đoạn chứa các chữ số 2 có giữ nguyên không?",
        explanation:
          "Các khối thay đổi độ dài: 22, 222, 2222, 22222,... nên B không có một chu kì cố định.",
      },
      {
        id: "l5a2-step3",
        instruction:
          "Kết luận nhận định ban đầu đúng hay sai và phát biểu lại điều kiện đúng để một số thập phân vô hạn là tuần hoàn.",
        acceptedPatterns: ["sai", "nhóm chữ số cố định", "lặp lại vô hạn"],
        keyIdea:
          "Nhận định sai. Một số thập phân vô hạn chỉ là tuần hoàn khi từ một vị trí nào đó có một nhóm chữ số cố định lặp lại liên tiếp vô hạn.",
        hint1: "A và B đều vô hạn nhưng chỉ A có chu kì.",
        hint2: "Kết luận phải có cụm ý 'nhóm chữ số cố định lặp lại mãi'.",
        explanation:
          "Vô hạn không đủ để kết luận tuần hoàn. Điều quyết định là sự tồn tại của một chu kì cố định lặp lại vô hạn.",
      },
    ],
    finalAnswer:
      "Nhận định sai. A có chu kì 12; B có các khối chữ số 2 dài dần nên không có chu kì cố định. Vô hạn và vô hạn tuần hoàn là hai điều kiện khác nhau.",
  },
  {
    id: "l5-advanced-rounding-decision",
    lessonId: "lesson-player-05",
    knowledgeNodeId: "lesson-5-thap-phan-vo-han-tuan-hoan",
    title: "Ra quyết định làm tròn và kiểm soát sai số",
    prompt:
      "Một phép đo cho khối lượng m = 18,374 kg. Cần báo cáo với độ chính xác 0,05 kg. Em hãy xác định hàng làm tròn, cho giá trị báo cáo và dùng sai số tuyệt đối để kiểm tra quyết định của mình. Sau đó giải thích vì sao 18,3 kg không đạt yêu cầu.",
    skillName: "Ra quyết định làm tròn theo độ chính xác",
    canonicalSkillId: "L05_ADV_ROUNDING_DECISION",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Mô hình hóa",
    learningGoal:
      "Liên hệ độ chính xác với hàng làm tròn và kiểm tra kết quả bằng sai số tuyệt đối trong tình huống thực tế.",
    companionMessage:
      "Hãy tách bài toán thành hai quyết định: chọn hàng làm tròn trước, rồi kiểm tra xem giá trị gần đúng cách số ban đầu bao xa.",
    steps: [
      {
        id: "l5a3-step1",
        instruction:
          "Từ độ chính xác 0,05 kg, xác định hàng cần làm tròn và giải thích mối liên hệ giữa 0,05 và đơn vị của hàng đó.",
        acceptedPatterns: ["hàng phần mười", "0,1", "0,05 là một nửa"],
        keyIdea:
          "0,05 là một nửa của 0,1 nên theo quy tắc của bài học ta làm tròn đến hàng phần mười.",
        hint1: "Tìm đơn vị hàng mà một nửa của nó bằng 0,05.",
        hint2: "Một nửa của 0,1 là 0,05.",
        explanation:
          "Độ chính xác 0,05 tương ứng với làm tròn đến hàng phần mười.",
      },
      {
        id: "l5a3-step2",
        instruction:
          "Làm tròn 18,374 kg đến hàng phần mười và tính sai số tuyệt đối giữa số đo ban đầu với giá trị đã làm tròn.",
        acceptedPatterns: ["18,4", "0,026"],
        keyIdea:
          "18,374 làm tròn đến hàng phần mười được 18,4; sai số tuyệt đối là |18,4 - 18,374| = 0,026 kg.",
        hint1: "Nhìn chữ số hàng phần trăm của 18,374.",
        hint2: "18,374 → 18,4; sau đó lấy |18,4 - 18,374|.",
        explanation:
          "Giá trị báo cáo là 18,4 kg và sai số tuyệt đối bằng 0,026 kg, nhỏ hơn 0,05 kg.",
      },
      {
        id: "l5a3-step3",
        instruction:
          "Tính sai số nếu báo cáo 18,3 kg và kết luận vì sao phương án đó không đạt độ chính xác 0,05 kg.",
        acceptedPatterns: ["0,074", "lớn hơn 0,05", "không đạt"],
        keyIdea:
          "|18,3 - 18,374| = 0,074 kg > 0,05 kg nên 18,3 kg không đạt yêu cầu.",
        hint1: "Tính khoảng cách giữa 18,3 và 18,374.",
        hint2: "0,074 so với 0,05: số nào lớn hơn?",
        explanation:
          "Sai số của 18,3 kg là 0,074 kg, vượt quá 0,05 kg; vì vậy không đạt yêu cầu.",
      },
    ],
    finalAnswer:
      "Độ chính xác 0,05 kg → làm tròn đến hàng phần mười. 18,374 kg → 18,4 kg; sai số 0,026 kg ≤ 0,05 kg. Nếu dùng 18,3 kg thì sai số 0,074 kg > 0,05 kg.",
  },
];
